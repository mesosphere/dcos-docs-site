---
layout: layout.pug
navigationTitle:  Uninstalling Services
title: Uninstalling Services
menuWeight: 7
excerpt: Uninstalling DC/OS services from the CLI

enterprise: false
---

Services can be uninstalled from the CLI. If a Universe service has any reserved resources that could not be cleaned up by the normal uninstall process, you may also need to run the framework cleaner script. The [framework cleaner script](#framework-cleaner) removes the service instance from ZooKeeper, along with any data associated with it.

# Uninstalling Universe services

## CLI

Uninstall a datacenter service with this command:

```bash
dcos package uninstall <servicename>
```

For example, to uninstall Chronos:

```bash
dcos package uninstall chronos
```

## Web interface

From the DC/OS web interface you can uninstall services from the **Services** tab. The Services tab provides a full-featured interface to the native DC/OS Marathon instance.

1.  Navigate to the [**Services**](/1.13/gui/services/) tab in the DC/OS web interface.
1.  Select your service, click the vertical ellipsis at the far right, and select **Delete**.

    ![Destroy app](/1.13/img/service-delete.png)
    
    Figure 1. Delete Services
    
1.  Copy and run the displayed command.

## Troubleshooting

It is possible for an uninstall to fail with the following error message:

```
Incomplete uninstall of package [chronos] due to Mesos unavailability
```

The service may be inactive and will not be shown in the DC/OS UI, but you can find it by using this CLI command:

```bash
dcos service --inactive
NAME          HOST     ACTIVE  TASKS  CPU  MEM  DISK  ID
chronos    10.0.6.138  False     0    0.0  0.0  0.0   7c0a7bd4-3649-4ec1-866c-5db8f2292bf2-0001
```

You can complete the uninstall by shutting down the service by using this CLI command with the service ID specified, and then run the [framework cleaner](#framework-cleaner):

```bash
dcos service shutdown 7c0a7bd4-3649-4ec1-866c-5db8f2292bf2-0001
```

# Uninstalling user-created services

### CLI

Uninstall a user-created service with this command:

```bash
dcos marathon app remove [--force] <app-id>
```

For more information, see the [command reference](/1.13/cli/command-reference/#dcos-marathon).

### Web interface

You can uninstall services from the DC/OS web interface, from the **Services** tab. The Services tab provides a full-featured interface to the native DC/OS Marathon instance.

### Services tab

1.  Navigate to the [**Services**](/1.13/gui/services/) tab in the DC/OS web interface.
2.  Click on the **Installed** tab to see your installed services.
3.  Hover your cursor over the name of the package you wish to uninstall and you will see a red "Uninstall" link to the right. Click this link to uninstall the package.

## <a name="framework-cleaner"></a>Cleaning up Resources and ZooKeeper

### About the cleanup

If your service has reserved resources and it did not completely clean itself up automatically, you can use the framework cleaner docker image, `mesosphere/janitor`, to simplify the process of removing your service instance from ZooKeeper and destroying all the data associated with it. **On DC/OS 1.10+ clusters, this should only be necessary in rare circumstances such as a failed uninstall.** The package's documentation may have its own additional information in an "Uninstall" section.

There are two ways to run the framework cleaner script. The preferred method is via the DC/OS CLI. If the CLI is unavailable, you can also run the image as a self-deleting Marathon task.

### Configuring the cleanup

The script takes the following flags:

* `-r <role>`: The role of the resources to be deleted
* `-z <zk-node>`: The configuration zookeeper node to be deleted

The command would be run as follows:

```bash
docker run mesosphere/janitor /janitor.py -r <service_name>-role -z dcos-service-<service_name>
```

If you are using a strict-mode cluster, you must provide additional arguments providing credentials to perform the cleanup:
* `-a <token>`: Token to be used for authentication
* `--username <username>` and `--password <password>`: Username and password to be used for authentication

For example, the command could be run with an auth token included as follows:

```bash
docker run mesosphere/janitor /janitor.py -r <service_name>-role -z dcos-service-<service_name> -a <content of "dcos config show core.dcos_acs_token">
```

### Running from the DC/OS CLI

Connect to the leader and start the script:

1. Open an SSH session to the cluster leader.

        your-machine$ dcos node ssh --master-proxy --leader

1. Run the `mesosphere/janitor` image with the role and zookeeper node that were configured for your service, along with an auth token if on a strict mode cluster:

        docker run mesosphere/janitor /janitor.py -r sample-role -z sample-zk [-a auth-token]

### Running from Marathon

From the DC/OS [**Services**](/1.13/gui/) tab, use the JSON editor to add the following as a Marathon task. Replace the values passed to `-r`/`-z` according to what needs to be cleaned up.

    {
      "id": "janitor",
      "cmd": "/janitor.py -r sample-role -z dcos-service-sample",
      "cpus": 1,
      "mem": 128,
      "disk": 1,
      "instances": 1,
      "container": {
        "docker": {
          "image": "mesosphere/janitor:latest",
          "network": "HOST"
        },
        "type": "DOCKER"
      }
    }

When the framework cleaner has completed its work, it will automatically remove itself from Marathon to ensure that it's only run once. This removal will often result in a `TASK_KILLED` or even a `TASK_FAILED` outcome for the janitor task, even if it finished successfully. The janitor task will also quickly disappear from both the Services and Dashboard tab.

### Verifying the outcome

To view the script's outcome, go to Mesos (`http://your-cluster.com/mesos`) and look at the task's `stdout` content. If `stdout` lacks content, run the following command manually:

    # Determine id of agent which ran the Docker task. This is an example:

    your-machine$ dcos node ssh --master-proxy --mesos-id=c62affd0-ce56-413b-85e7-32e510a7e131-S3

    agent-node$ docker ps -a
    CONTAINER ID        IMAGE                       COMMAND             ...
    828ee17b5fd3        mesosphere/janitor:latest   /bin/sh -c /janito  ...

    agent-node$ docker logs 828ee17b5fd3

### Sample result

Here is an example of the output for a successful run for a sample installation:

    your-machine$ dcos node ssh --master-proxy --leader

    leader-node$ docker run mesosphere/janitor /janitor.py -r sample_role -z dcos-service-sample
    [... docker download ...]
    Master: http://leader.mesos:5050/master/ Exhibitor: http://leader.mesos:8181/ Role: sample_role ZK Path: sample

    Destroying volumes...
    Mesos version: 0.28.1 => 28
    Found 1 volume(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S5, deleting...
    200
    Found 1 volume(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S4, deleting...
    200
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S3
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S2
    Found 1 volume(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S1, deleting...
    200
    No reserved resources for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S0. Known roles are: [slave_public]

    Unreserving resources...
    Found 4 resource(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S5, deleting...
    200
    Found 4 resource(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S4, deleting...
    200
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S3
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S2
    Found 4 resource(s) for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S1, deleting...
    200
    No reserved resources for role 'sample_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S0. Known roles are: [slave_public]

    Deleting zk node...
    Successfully deleted znode 'dcos-service-sample' (code=200), if znode existed.
    Cleanup completed successfully.

If you run the script via Marathon, you will also see the following output:

    Deleting self from Marathon to avoid run loop: /janitor
    Successfully deleted self from marathon (code=200): /janitor
