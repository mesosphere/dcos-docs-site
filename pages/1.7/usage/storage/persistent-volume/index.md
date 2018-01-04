---
layout: layout.pug
navigationTitle:  Local Persistent Volumes
title: Local Persistent Volumes
menuWeight: 10
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


**Note:** Local persistent volume functionality is considered experimental: use this feature at your own risk. We might add, change, or delete any functionality described in this document.

When you specify a local volume or volumes, tasks and their associated data are "pinned" to the node they are first launched on and will be relaunched on that node if they terminate. The resources the application requires are also reserved. Marathon will implicitly reserve an appropriate amount of disk space (as declared in the volume via `persistent.size`) in addition to the sandbox `disk` size you specify as part of your application definition.

## Benefits of using local persistent volumes

- All resources needed to run tasks of your stateful service are dynamically reserved, thus ensuring the ability to relaunch the task on the same node using the same volume when needed.
- You don't need constraints to pin a task to a particular agent where its data resides
- You can still use constraints to specify distribution logic
- Marathon lets you locate and destroy an unused persistent volume if you don't need it anymore

# Create an application with local persistent volumes

## Prerequisites

See the [DC/OS system requirements](/1.7/administration/installing/oss/custom/system-requirements/).

## Configuration options

Configure a persistent volume with the following options:

```json
{
  "containerPath": "data",
  "mode": "RW",
  "persistent": {
    "size": 10
  }
}
```

- `containerPath`: The path where your application will read and write data. This must be a single-level path relative to the container; it cannot contain a forward slash (`/`). (`"data"`, but not `"/data"`, `"/var/data"` or `"var/data"`). If your application requires an absolute path, or a relative path with slashes, [use this configuration](#abs-paths).
- `mode`: The access mode of the volume. Currently, `"RW"` is the only possible value and will let your application read from and write to the volume.
- `persistent.size`: The size of the persistent volume in MiBs.

You also need to set the `residency` node to tell Marathon to setup a stateful application. Currently, the only valid option for this is:

```json
"residency": {
  "taskLostBehavior": "WAIT_FOREVER"
}
```

<a name="abs-paths"></a>
### Specifing an unsupported container path

The value of `containerPath` must be relative to allow you to dynamically add a local persistent volume to a running container and to ensure consistency across operating systems. However, your application may require an absolute or container path, or a relative one with slashes.

If your application does require an unsupported `containerPath`, configure two volumes. The first volume has the absolute container path you need and does not have the `persistent` parameter. The `hostPath` parameter will match the relative `containerPath` value for the second volume.

```json
{
  "containerPath": "/var/lib/data",
  "hostPath": "mydata",
  "mode": "RW"
}
```

The second volume is a persistent volume with a `containerPath` that matches the `hostPath` of the first volume.

```json
{
  "containerPath": "mydata",
  "mode": "RW",
  "persistent": {
    "size": 1000
  }
}
```

For a complete example, see the [Running stateful MySQL on Marathon](#stateful-sql) section.

# Scaling stateful applications

When you scale your app down, the volumes associated with the terminated instances are detached but all resources are still reserved. At this point, you may delete the tasks via the Marathon API, which will free reserved resources and destroy the persistent volumes.

Since all the resources your application needs are still reserved when a volume is detached, you may wish to destroy detached volumes to allow other applications and frameworks to use the resources. You may wish to leave them in the detached state, however, if you think you will be scaling your app up again; the data on the volume will still be there.

**Note:** If your app is destroyed, any associated volumes and reserved resources will also be deleted.
**Note:** Mesos will currently not remove the data but might do so in the future.

# Upgrading/restarting stateful applications

The default `UpgradeStrategy` for a stateful application is a `minimumHealthCapacity` of `0.5` and a `maximumOverCapacity` of `0`. If you override this default, your definition must stay below these values to pass validation. The `UpgradeStrategy` must stay below these values because Marathon needs to be able to kill old tasks before starting new ones so that the new versions can take over reservations and volumes and Marathon cannot create additional tasks (as a `maximumOverCapacity > 0` would induce) to prevent additional volume creation.

**Note:** For a stateful application, Marathon will never start more instances than specified in the `UpgradeStrategy`, and will kill old instances rather than create new ones during an upgrade or restart.

# Under the Hood

Marathon leverages three Mesos features to run stateful applications: [dynamic reservations](http://mesos.apache.org/documentation/latest/reservation/), reservation labels, and [persistent volumes](http://mesos.apache.org/documentation/latest/persistent-volume/).

In contrast to static reservations, dynamic reservations are created at runtime for a given role and will associate resources with a combination of `frameworkId` and `taskId` using reservation labels. This allows Marathon to restart a stateful task after it has terminated for some reason, since the associated resources will not be offered to frameworks that are not configured to use this role. Consult [non-unique roles](#non-unique-roles) for more information.

Mesos creates persistent volumes to hold your application's stateful data. Because persistent volumes are local to an agent, the stateful task using this data will be pinned to the agent it was initially launched on, and will be relaunched on this node whenever needed. You do not need to specify any constraints for this to work: when Marathon needs to launch a task, it will accept a matching Mesos offer, dynamically reserve the resources required for the task, create persistent volumes, and make sure the task is always restarted using these reserved resources so that it can access the existing data.

When a task that used persistent volumes has terminated, its metadata will be kept. This metadata will be used to launch a replacement task when needed.

For example, if you scale down from 5 to 3 instances, you will see 2 tasks in the `Waiting` state along with the information about the persistent volumes the tasks were using as well as about the agents on which they are placed. Marathon will not unreserve those resources and will not destroy the volumes. When you scale up again, Marathon will attempt to launch tasks that use those existing reservations and volumes as soon as it gets a Mesos offer containing the labeled resources. Marathon will only schedule unreserve/destroy operations when:

- the application is deleted (in which case volumes of all its tasks are destroyed, and all reservations are deleted).
- you explicitly delete one or more suspended tasks with a `wipe=true` flag.

If reserving resources or creating persistent volumes fails, the created task will timeout after the configured `task_reservation_timeout` (default: 20 seconds) and a new reservation attempt will be made. In case a task is `LOST` (because its agent is disconnected or crashed), the reservations and volumes will not timeout and you need to manually delete and wipe the task to let Marathon launch a new one.

# Potential Pitfalls

Be aware of the following issues and limitations when using stateful applications in Marathon that make use of dynamic resevations and persistent volumes.

## Resource requirements

Currently, the resource requirements of a stateful application **cannot** be changed. Your initial volume size, cpu usage, memory requirements, etc., cannot be changed once you've posted the AppDefinition.

## Replication and Backups

Because persistent volumes are pinned to nodes, they are no longer reachable if the node is disconnected from the cluster, e.g. due to a network partition or a crashed agent. If the stateful service does not take care of data replication on its own, you need to manually setup a replication or backup strategy to guard against data loss from a network partition or from a crashed agent.

If an agent re-registers with the cluster and offers its resources, Marathon is eventually able to relaunch a task there. If a node does not re-register with the cluster, Marathon will wait forever to receive expected offers, as it's goal is to re-use the existing data. If the agent is not expected to come back, you can manually delete the relevant tasks by adding a `wipe=true` flag and Marathon will eventually launch a new task with a new volume on another agent.

## Disk consumption

As of Mesos 0.28, destroying a persistent volume will not cleanup or destroy data. Mesos will delete metadata about the volume in question, but the data will remain on disk. To prevent disk consumption, you should manually remove data when you no longer need it.

<a name="non-unique-roles"></a>
## Non-unique Roles

Both static and dynamic reservations in Mesos are bound to roles, not to frameworks or framework instances. Marathon will add labels to claim that resources have been reserved for a combination of `frameworkId` and `taskId`, as noted above. However, these labels do not protect from misuse by other frameworks or old Marathon instances (prior to 1.0). Every Mesos framework that registers for a given role will eventually receive offers containing resources that have been reserved for that role.

However, if another framework does not respect the presence of labels and the semantics as intended and uses them, Marathon is unable to reclaim these resources for the initial purpose. We recommend never using the same role for different frameworks if one of them uses dynamic reservations. Marathon instances in HA mode do not need to have unique roles, though, because they use the same role by design.

### The Mesos Sandbox

The temporary Mesos sandbox is still the target for the `stdout` and `stderr` logs. To view these logs, go to the Marathon pane of the DC/OS web interface.

# Examples

## Creating a stateful application via the Marathon UI

1. Create a new Marathon application via the web interface.
1. Click the Volumes tab.
1. Choose the size of the volume or volumes you will use. Be sure that you choose a volume size that will fit the needs of your application; you will not be able to modify this size after you launch your application.
1. Specify the container path from which your application will read and write data. The container path must be non-nested and cannot contain slashes e.g. `data`, but not  `../../../etc/opt` or `/user/data/`. If your application requires such a container path, [use this configuration](#abs-paths).
1. Click **Create**.

## Running stateful PostgreSQL on Marathon

A model app definition for PostgreSQL on Marathon would look like this. Note that we set the postgres data folder to `pgdata` which is relative to the Mesos sandbox (as contained in the `$MESOS_SANDBOX` variable). This enables us to set up a persistent volume with a containerPath of `pgdata`. This path is is not nested and relative to the sandbox as required:

```json
{
  "id": "/postgres",
  "cpus": 1,
  "instances": 1,
  "mem": 512,
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "pgdata",
        "mode": "RW",
        "persistent": {
          "size": 100
        }
      }
    ],
    "docker": {
      "image": "postgres:latest",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 5432,
          "hostPort": 0,
          "protocol": "tcp",
          "name": "postgres"
        }
      ]
    }
  },
  "env": {
    "POSTGRES_PASSWORD": "password",
    "PGDATA": "/mnt/mesos/sandbox/pgdata"
  },
  "residency": {
    "taskLostBehavior": "WAIT_FOREVER"
  },
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  }
}
```

<a name="stateful-sql"></a>
## Running stateful MySQL on Marathon

The default MySQL docker image does not allow you to change the data folder. Since we cannot define a persistent volume with an absolute nested `containerPath` like `/var/lib/mysql`, we need to configure a workaround to set up a docker mount from hostPath `mysqldata` (relative to the Mesos sandbox) to `/var/lib/mysql` (the path that MySQL attempts to read/write):

```json
{
  "containerPath": "/var/lib/mysql",
  "hostPath": "mysqldata",
  "mode": "RW"
}
```

In addition to that, we configure a persistent volume with a containerPath `mysqldata`, which will mount the local persistent volume as `mysqldata` into the docker container:

```json
{
  "containerPath": "mysqldata",
  "mode": "RW",
  "persistent": {
    "size": 1000
  }
}
```

The complete JSON application definition reads as follows:

```json
{
  "id": "/mysql",
  "cpus": 1,
  "mem": 512,
  "disk": 0,
  "instances": 1,
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "mysqldata",
        "mode": "RW",
        "persistent": {
          "size": 1000
        }
      },
      {
        "containerPath": "/var/lib/mysql",
        "hostPath": "mysqldata",
        "mode": "RW"
      }
    ],
    "docker": {
      "image": "mysql",
      "network": "BRIDGE",
      "portMappings": [
        {
          "containerPort": 3306,
          "hostPort": 0,
          "servicePort": 10000,
          "protocol": "tcp"
        }
      ],
      "forcePullImage": false
    }
  },
  "env": {
    "MYSQL_USER": "wordpress",
    "MYSQL_PASSWORD": "secret",
    "MYSQL_ROOT_PASSWORD": "supersecret",
    "MYSQL_DATABASE": "wordpress"
  },
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

## Inspecting and deleting suspended stateful tasks

To destroy and clean up persistent volumes and free the reserved resources associated with a task, perform 2 steps:

1. Locate the agent containing the persistent volume and remove the data inside it.
1. Send an HTTP DELETE request to Marathon that includes the `wipe=true` flag.

To locate the agent, inspect the Marathon UI and check out the detached volumes on the _Volumes_ tab. Or, query the `/v2/apps` endpoint, which provides information about the `host` and Mesos `slaveId`.

```
http GET http://dcos/service/marathon/v2/apps/postgres/tasks

response:

{
  "appId": "/postgres", 
  "host": "10.0.0.168", 
  "id": "postgres.53ab8733-fd96-11e5-8e70-76a1c19f8c3d", 
  "localVolumes": [
    {
      "containerPath": "pgdata", 
      "persistenceId": "postgres#pgdata#53ab8732-fd96-11e5-8e70-76a1c19f8c3d"
    }
  ], 
  "slaveId": "d935ca7e-e29d-4503-94e7-25fe9f16847c-S1"
}
```

_Note_: A running task will show `stagedAt`, `startedAt` and `version` in addition to the information provided above.

You can then

1. Remove the data on disk by `ssh'ing` into the agent and running the `rm -rf <volume-path>/*` command.
1. Delete the task with `wipe=true`, which will expunge the task information from the Marathon internal repository and eventually destroy the volume and unreserve the resources previously associated with the task:
```
http DELETE http://dcos/service/marathon/v2/apps/postgres/tasks/postgres.53ab8733-fd96-11e5-8e70-76a1c19f8c3d?wipe=true
```

## View the Status of Your Application with Persistent Local Volumes

After you have created your Marathon application, click the _Volumes_ tab of the application detail view to get detailed information about your app instances and associated volumes.

The Status column tells you if your app instance is attached to the volume or not. The app instance will read as "detached" if you have scaled down your application. Currently the only Operation Type available is read/write (RW).

Click a volume to view the Volume Detail Page, where you can see information about the individual volume.
