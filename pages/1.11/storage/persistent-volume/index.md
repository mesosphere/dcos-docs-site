---
layout: layout.pug
navigationTitle:  Local Persistent Volumes
title: Local Persistent Volumes
menuWeight: 10
excerpt: Using local persistent volumes

enterprise: false
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


When you specify a local volume or volumes, tasks and their associated data are "pinned" to the node they are first launched on and will be relaunched on that node if they terminate. The resources the application requires are also reserved. Marathon will implicitly reserve an appropriate amount of disk space (as declared in the volume via `persistent.size`) in addition to the sandbox `disk` size you specify as part of your application definition.

# Benefits of using local persistent volumes

- All resources needed to run tasks of your stateful service are dynamically reserved, thus ensuring the ability to relaunch the task on the same node using the same volume when needed.
- You don't need constraints to pin a task to a particular agent where its data resides
- You can still use constraints to specify distribution logic
- Marathon lets you locate and destroy an unused persistent volume if you don't need it anymore

# Create an application definition with a local persistent volume

## Configure the volume

Configure a persistent volume with the following options:

```json
{
  "containerPath": "data",
  "mode": "RW",
  "persistent": {
    "type": "root",
    "size": 10,
    "constraints": []
  }
}
```

- `containerPath`: The path where your application will read and write data. This must be a single-level path relative to the container; it cannot contain a forward slash (`/`). (`"data"`, but not `"/data"`, `"/var/data"` or `"var/data"`).
- `mode`: The access mode of the volume. Currently, `"RW"` is the only possible value and will let your application read from and write to the volume.
- `persistent.type`: The type of Mesos disk resource to use; the valid options are `root`, `path`, and `mount`, corresponding to the [valid Mesos multi-disk resource types](http://mesos.apache.org/documentation/latest/multiple-disk/).
- `persistent.size`: The size of the persistent volume in MiBs.
- `persistent.profileName`: (not seen above) The storage [volume profile](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/terminology-and-concepts/#volume-profile). Only volumes with the specified profile are used to launch an application. It this option is not given, any volume (with or without a profile) will be used for launching.
- `persistent.maxSize`: (not seen above) For `root` Mesos disk resources, the optional maximum size of an exclusive mount volume to be considered.
- `persistent.constraints`: Constraints restricting where new persistent volumes should be created. Currently, it is only possible to constrain the path of the disk resource by regular expression.

## Configure stateful application

To set up a stateful application, set `unreachableStrategy` to "disabled".

```json
"unreachableStrategy": "disabled",
```

-
<a name="abs-paths"></a>
## Specify an unsupported container path

To allow you to dynamically add a local persistent volume to a running container and to ensure consistency across operating systems, the value of `containerPath` must be _relative_. However, your application may require an absolute container path or a relative one with slashes. If your application does require an unsupported `containerPath`, you can work around this restriction by configuring two volumes. The first volume has the absolute container path you need and _does not_ have the `persistent` parameter. The `hostPath` parameter of the first volume must match the relative `containerPath` of the second volume.

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

For a complete example, see [Running stateful MySQL on Marathon](#stateful-sql).

# Create a stateful application via the DC/OS GUI

1. Click the **Services** tab, then **RUN A SERVICE**.
1. Click the **Volumes** tab.
1. Choose the size of the volume or volumes you will use. Be sure that you choose a volume size that will fit the needs of your application; you will not be able to modify this size after you launch your application.
1. Specify the container path from which your application will read and write data. The container path must be non-nested and cannot contain slashes e.g. `data`, but not  `../../../etc/opt` or `/user/data/`. If your application requires such a container path, [use this configuration](#abs-paths).
1. Click **Create**.

# Scale stateful applications

When you scale your app down, the volumes associated with the terminated instances are detached but all resources are still reserved. At this point, you may delete the tasks via the Marathon API, which will free reserved resources and destroy the persistent volumes.

Since all the resources your application needs are still reserved when a volume is detached, you may wish to destroy detached volumes to allow other applications and frameworks to use the resources. You may wish to leave them in the detached state, however, if you think you will be scaling your app up again; the data on the volume will still be there.

**Notes:**

-  If your app is destroyed, any associated volumes and reserved resources will also be deleted.
-  Mesos will currently not remove the data but might do so in the future.

# Upgrade or restart stateful applications

The default `UpgradeStrategy` for a stateful application is a `minimumHealthCapacity` of `0.5` and a `maximumOverCapacity` of `0`. If you override this default, your definition must stay below these values to pass validation. The `UpgradeStrategy` must stay below these values because Marathon needs to be able to kill old tasks before starting new ones so that the new versions can take over reservations and volumes and Marathon cannot create additional tasks (as a `maximumOverCapacity > 0` would induce) to prevent additional volume creation.

**Note:** For a stateful application, Marathon will never start more instances than specified in the `UpgradeStrategy`, and will kill old instances rather than create new ones during an upgrade or restart.

[beta]
# Create a pod with a local persistent volume
[/beta]

## Configure the volume

Configure a persistent volume with the following options:

```json
"volumes": [
  {
    "name": "pst",
    "persistent": {
      "type": "root",
      "size": 10,
      "constraints": []
    }
  }
]
```

where

- `name`: Name of the pod level volume
- `persistent.type`: The type of Mesos disk resource to use; the valid options are `root`, `path`, and `mount`, corresponding to the [valid Mesos multi-disk resource types](http://mesos.apache.org/documentation/latest/multiple-disk/).
- `persistent.size`: The size of the persistent volume in MiBs.
- `persistent.maxSize`: (not seen above) For `root` Mesos disk resources, the optional maximum size of an exclusive mount volume to be considered.
- `persistent.profileName`: (not seen above) The storage [volume profile](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/terminology-and-concepts/#volume-profile). Only volumes with the specified profile are used to launch an application. It this option is not given, any volume (with or without a profile) will be used for launching.
- `persistent.constraints`: Constraints restricting where new persistent volumes should be created. Currently, it is only possible to constrain the path of the disk resource by regular expression.

## Configure stateful pod

To set up a stateful pod, set `unreachableStrategy` to "disabled".

```json
"unreachableStrategy": "disabled",
```

## Specify the volume mount parameters

```json
"volumeMounts": [
  {
    "name": "pst",
    "mountPath": "pst1",
    "readOnly": false
  }
]
```

where

- `name`: The name of the volume to reference.
- `mountPath`: The path inside the container at which the volume is mounted.
- `readOnly`: If the volume is mounted as read-only or not.


# Under the hood

Marathon leverages three Mesos features to run stateful applications: [dynamic reservations](http://mesos.apache.org/documentation/latest/reservation/), reservation labels, and [persistent volumes](http://mesos.apache.org/documentation/latest/persistent-volume/).

In contrast to static reservations, dynamic reservations are created at runtime for a given role and associate resources with a combination of `frameworkId` and `taskId` using reservation labels. This allows Marathon to restart a stateful task after it has terminated for some reason, since the associated resources will not be offered to frameworks that are not configured to use this role. Consult [non-unique roles](#non-unique-roles) for more information.

Mesos creates persistent volumes to hold your application's stateful data. Because persistent volumes are local to an agent, the stateful task using this data will be pinned to the agent it was initially launched on, and will be relaunched on this node whenever needed. You do not need to specify any constraints for this to work: when Marathon needs to launch a task, it will accept a matching Mesos offer, dynamically reserve the resources required for the task, create persistent volumes, and make sure the task is always restarted using these reserved resources so that it can access the existing data.

When a task that used persistent volumes has terminated, its metadata will be kept. This metadata will be used to launch a replacement task when needed.

For example, if you scale down from 5 to 3 instances, you will see 2 tasks in the `Waiting` state along with the information about the persistent volumes the tasks were using as well as about the agents on which they are placed. Marathon will not unreserve those resources and will not destroy the volumes. When you scale up again, Marathon will attempt to launch tasks that use those existing reservations and volumes as soon as it gets a Mesos offer containing the labeled resources. Marathon will only schedule unreserve/destroy operations when:

- The application is deleted (in which case volumes of all its tasks are destroyed, and all reservations are deleted).
- You explicitly delete one or more suspended tasks with a `wipe=true` flag.

If reserving resources or creating persistent volumes fails, the created task will time out after the configured `task_reservation_timeout` (default: 20 seconds) and a new reservation attempt will be made. In case a task is `LOST` (because its agent is disconnected or crashed), the reservations and volumes will not timeout and you need to manually delete and wipe the task to let Marathon launch a new one.

# Potential pitfalls

Be aware of the following issues and limitations when using stateful applications in Marathon that make use of dynamic reservations and persistent volumes.

## Resource requirements

Currently, the resource requirements&mdash;volume size, cpu usage, memory requirements, etc.&mdash;of a stateful application **cannot** be changed once you've deployed the app definition.

## Replication and backups

Because persistent volumes are pinned to nodes, they are no longer reachable if the node is disconnected from the cluster, e.g. due to a network partition or a crashed agent. If the stateful service does not take care of data replication on its own, you need to manually setup a replication or backup strategy to guard against data loss from a network partition or from a crashed agent.

If an agent re-registers with the cluster and offers its resources, Marathon is eventually able to relaunch a task there. If a node does not re-register with the cluster, Marathon will wait forever to receive expected offers, as its goal is to re-use the existing data. If the agent is not expected to come back, you can manually delete the relevant tasks by adding a `wipe=true` flag and Marathon will eventually launch a new task with a new volume on another agent.

## Disk consumption

As of Mesos 0.28, destroying a persistent volume does not clean up or destroy data. Mesos deletes metadata about the volume in question, but the data remains on disk. To prevent disk consumption, you should manually remove data when you no longer need it.

<a name="non-unique-roles"></a>
## Non-unique roles

Both static and dynamic reservations in Mesos are bound to roles, not to frameworks or framework instances. Marathon adds labels to claim that resources have been reserved for a combination of `frameworkId` and `taskId`, as noted above. However, these labels do not protect from misuse by other frameworks or old Marathon instances (prior to 1.0). Every Mesos framework that registers for a given role will eventually receive offers containing resources that have been reserved for that role.

However, if another framework does not respect the presence of labels and the semantics as intended and uses them, Marathon is unable to reclaim these resources for the initial purpose. We recommend never using the same role for different frameworks if one of them uses dynamic reservations. Marathon instances in HA mode do not need to have unique roles, though, because they use the same role by design.

### The Mesos sandbox

The temporary Mesos sandbox is still the target for the `stdout` and `stderr` logs. To view these logs, go to the Marathon pane of the DC/OS GUI.

# Examples

## Stateful PostgreSQL on Marathon

A model app definition for PostgreSQL on Marathon would look like the following. Note that we set the PostgreSQL data folder to `pgdata`, which is relative to the Mesos sandbox (as contained in the `$MESOS_SANDBOX` variable). This enables us to set up a persistent volume with a `containerPath` of `pgdata`. This path is is not nested and relative to the sandbox as required:


```json
{
  "id": "/postgres",
  "cpus": 1,
  "instances": 1,
  "mem": 512,
  "networks": [
    {
      "mode": "container/bridge"
    }
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "pgdata",
        "mode": "RW",
        "persistent": {
          "type": "mount",
          "size": 524288,
          "maxSize": 1048576,
          "constraints": [["path", "LIKE", "/mnt/ssd-.+"]]
        }
      }
    ],
    "docker": {
      "image": "postgres:latest"
    },
    "portMappings": [
      {
        "containerPort": 5432,
        "hostPort": 0,
        "protocol": "tcp",
        "name": "postgres"
      }
    ]
  },
  "env": {
    "POSTGRES_PASSWORD": "password",
    "PGDATA": "pgdata"
  },
  "unreachableStrategy": "disabled",
  "upgradeStrategy": {
    "maximumOverCapacity": 0,
    "minimumHealthCapacity": 0
  }
}
```

<a name="stateful-sql"></a>
## Stateful MySQL on Marathon

The default MySQL Docker image does not allow you to change the data folder. Since we cannot define a persistent volume with an absolute nested `containerPath` like `/var/lib/mysql`, we configure a workaround to set up a Docker mount from hostPath `mysqldata` (relative to the Mesos sandbox) to `/var/lib/mysql` (the path that MySQL attempts to read/write):

```json
{
  "containerPath": "/var/lib/mysql",
  "hostPath": "mysqldata",
  "mode": "RW"
}
```

In addition to that, we configure a persistent volume with a containerPath `mysqldata`, which will mount the local persistent volume as `mysqldata` into the Docker container:

```json
{
  "containerPath": "mysqldata",
  "mode": "RW",
  "persistent": {
    "type": "root",
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
  "networks": [
    {
      "mode": "container/bridge"
    }
  ],
  "container": {
    "type": "DOCKER",
    "volumes": [
      {
        "containerPath": "mysqldata",
        "mode": "RW",
        "persistent": {
          "type": "root",
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
      "forcePullImage": false
    },
    "portMappings": [
      {
        "containerPort": 3306,
        "hostPort": 0,
        "servicePort": 10000,
        "protocol": "tcp"
      }
    ]
  },
  "env": {
    "MYSQL_USER": "wordpress",
    "MYSQL_PASSWORD": "secret",
    "MYSQL_ROOT_PASSWORD": "supersecret",
    "MYSQL_DATABASE": "wordpress"
  },
  "unreachableStrategy": "disabled",
  "upgradeStrategy": {
    "minimumHealthCapacity": 0,
    "maximumOverCapacity": 0
  }
}
```

## Pod with persistent volume

The following example will create a pod with 2 containers and one shared persistent volume. Also see [Pods](/1.11/deploying-services/pods/).

```json
{
  "id": "/persistent-volume-pod",
  "volumes": [
    {
      "name": "pst",
      "persistent": {
        "type": "root",
        "size": 10,
        "constraints": []
      }
    }
  ],
  "scaling": {
    "kind": "fixed",
    "instances": 1
  },
  "scheduling": {
    "unreachableStrategy": "disabled",
    "upgrade": {
      "minimumHealthCapacity": 0,
      "maximumOverCapacity": 0
    }
  },
  "containers": [
    {
      "name": "container1",
      "exec": {
        "command": {
          "shell": "cd $MESOS_SANDBOX && echo 'hello' >> pst1/foo && /opt/mesosphere/bin/python -m http.server $EP_HOST_HTTPCT1"
        }
      },
      "resources": {
        "cpus": 0.1,
        "mem": 128
      },
      "endpoints": [
        {
          "name": "httpct1",
          "hostPort": 0,
          "protocol": [
            "tcp"
          ]
        }
      ],
      "volumeMounts": [
        {
          "name": "pst",
          "mountPath": "pst1",
          "readOnly": false
        }
      ],
      "lifecycle": {
        "killGracePeriodSeconds": 60
      }
    },
    {
      "name": "container2",
      "exec": {
        "command": {
          "shell": "cd $MESOS_SANDBOX && /opt/mesosphere/bin/python -m http.server $EP_HOST_HTTPCT2"
        }
      },
      "resources": {
        "cpus": 0.1,
        "mem": 128
      },
      "endpoints": [
        {
          "name": "httpct2",
          "hostPort": 0,
          "protocol": [
            "tcp"
          ]
        }
      ],
      "volumeMounts": [
        {
          "name": "pst",
          "mountPath": "pst2",
          "readOnly": false
        }
      ],
      "lifecycle": {
        "killGracePeriodSeconds": 60
      }
    }
  ],
  "networks": [
    {
      "mode": "host"
    }
  ]
}
```

## Inspect and delete suspended stateful tasks

To destroy and clean up persistent volumes and free the reserved resources associated with a task, perform 2 steps:

1. Locate the agent containing the persistent volume and remove the data inside it.
1. Send an HTTP DELETE request to Marathon that includes the `wipe=true` flag.

To locate the agent, inspect the Marathon UI and check out the detached volumes on the **Volumes** tab. Or, query the `/v2/apps` endpoint, which provides information about the `host` and Mesos `slaveId`.

```
http GET http://dcos/service/marathon/v2/apps/postgres/tasks
```

response:

```json
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

**Note:** A running task will show `stagedAt`, `startedAt`, and `version` in addition to the information provided above.

You can then

1. Remove the data on disk by `ssh'ing` into the agent and running the `rm -rf <volume-path>/*` command.
1. Delete the task with `wipe=true`, which will expunge the task information from the Marathon internal repository and eventually destroy the volume and unreserve the resources previously associated with the task:

```
http DELETE http://dcos/service/marathon/v2/apps/postgres/tasks/postgres.53ab8733-fd96-11e5-8e70-76a1c19f8c3d?wipe=true
```

## View the status of your application with persistent local volumes

After you have created your application, click the **Volumes** tab of the application detail view to get detailed information about your app instances and associated volumes.

The Status column tells you if your app instance is attached to the volume or not. The app instance will read as "detached" if you have scaled down your application. Currently the only Operation Type available is read/write (RW).

Click a volume to view the Volume Detail Page, where you can see information about the individual volume.
