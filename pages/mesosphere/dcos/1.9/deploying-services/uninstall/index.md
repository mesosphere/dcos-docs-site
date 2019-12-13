---
layout: layout.pug
navigationTitle:  Uninstalling Services
title: Uninstalling Services
menuWeight: 7
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


Services can be uninstalled from either the web interface or the CLI. If a Universe service has any reserved resources, you also need to run the framework cleaner script. The [framework cleaner script](#framework-cleaner) removes the service instance from ZooKeeper, along with any data associated with it.   

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

From the DC/OS web interface you can uninstall services from the **Services** or **Universe** tab. The Universe tab shows all of the available DC/OS services from package [repositories](/mesosphere/dcos/1.9/administering-clusters/repo/). The Services tab provides a full-featured interface to the native DC/OS Marathon instance.

### Universe tab

1.  Navigate to the **Universe > Packages** page in the DC/OS [web interface](/mesosphere/dcos/1.9/gui/universe/).
2.  Click on the **Installed** tab to see your installed services.
3.  Hover your cursor over the name of the package you wish to uninstall and you will see a red "Uninstall" link to the right. Click this link to uninstall the package.

### Services tab

1.  Navigate to the [**Services**](/mesosphere/dcos/1.9/gui/services/) tab in the DC/OS web interface.
1.  Select your application and click the toggle to **Destroy**.
    
    ![Destroy app](/mesosphere/dcos/1.9/img/app-destroy.png)

## Troubleshooting

It's possible for an uninstall to fail with the following error message:

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

For more information, see the [command reference](/mesosphere/dcos/1.9/cli/command-reference/dcos-marathon/).

### Web interface

From the DC/OS web interface you can uninstall services from the **Services**. The Services tab provides a full-featured interface to the native DC/OS Marathon instance.

### Services tab

1.  Navigate to the [**Services**](/mesosphere/dcos/1.9/gui/services/) tab in the DC/OS web interface.
2.  Click on the **Installed** tab to see your installed services.
3.  Hover your cursor over the name of the package you wish to uninstall and you will see a red "Uninstall" link to the right. Click this link to uninstall the package.

## <a name="framework-cleaner"></a>Cleaning up ZooKeeper

### About Cleaning up ZooKeeper

If your service has reserved resources, you can use the framework cleaner docker image, `mesosphere/janitor`, to simplify the process of removing your service instance from ZooKeeper and destroying all the data associated with it.

There are two ways to run the framework cleaner script. The preferred method is via the DC/OS CLI. If the CLI is unavailable, you can also run the image as a self-deleting Marathon task.

### Configuring the cleanup

The script takes the following flags:

* `-r`: The role of the resources to be deleted
* `-p`: The principal of the resources to be deleted
* `-z`: The configuration zookeeper node to be deleted

These are some examples of default configurations (these will vary depending on selected task name, etc):

* Cassandra default: 

  ```bash
  docker run mesosphere/janitor /janitor.py -r cassandra-role -p cassandra-principal -z dcos-service-cassandra
  ```
  
* HDFS default: 

  ```bash
  docker run mesosphere/janitor /janitor.py -r hdfs-role -p hdfs-principal -z dcos-service-hdfs
  ```
  
* Kafka default: 

  ```bash
  docker run mesosphere/janitor /janitor.py -r kafka-role -p kafka-principal -z dcos-service-kafka
  ```
  
* Custom values: 
  
  ```bash
  docker run mesosphere/janitor /janitor.py -r <custom_role> -p <custom_principal> -z dcos-service-<custom_service_name>
  ```

### Running from the DC/OS CLI

Connect to the leader and start the script:

1. Open an SSH session to the cluster leader.

        your-machine$ dcos node ssh --master-proxy --leader

1. Run the `mesosphere/janitor` image with the role, principal, and zookeeper nodes that were configured for your service:

        leader$ docker run mesosphere/janitor /janitor.py -r sample-role -p sample-principal -z sample-zk

### Running from Marathon

From the DC/OS [**Services**](/mesosphere/dcos/1.9/gui/) tab, use the JSON editor to add the following as a Marathon task. Replace the values passed to `-r`/`-p`/`-z` according to what needs to be cleaned up.

    {
      "id": "janitor",
      "cmd": "/janitor.py -r sample-role -p sample-principal -z sample",
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

Here's an example of the output for a successful run for a Cassandra installation:

    your-machine$ dcos node ssh --master-proxy --leader

    leader-node$ docker run mesosphere/janitor /janitor.py -r cassandra_role -p cassandra_principal -z cassandra
    [... docker download ...]
    Master: http://leader.mesos:5050/master/ Exhibitor: http://leader.mesos:8181/ Role: cassandra_role Principal: cassandra_principal ZK Path: cassandra
    
    Destroying volumes...
    Mesos version: 0.28.1 => 28
    Found 1 volume(s) for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S5, deleting...
    200 
    Found 1 volume(s) for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S4, deleting...
    200 
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S3
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S2
    Found 1 volume(s) for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S1, deleting...
    200 
    No reserved resources for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S0. Known roles are: [slave_public]
    
    Unreserving resources...
    Found 4 resource(s) for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S5, deleting...
    200 
    Found 4 resource(s) for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S4, deleting...
    200 
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S3
    No reserved resources for any role on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S2
    Found 4 resource(s) for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S1, deleting...
    200 
    No reserved resources for role 'cassandra_role' on slave 3ce447e3-2894-4c61-bd0f-be97e4d99ee9-S0. Known roles are: [slave_public]
    
    Deleting zk node...
    Successfully deleted znode 'cassandra' (code=200), if znode existed.
    Cleanup completed successfully.

If you run the script via Marathon, you will also see the following output:

    Deleting self from Marathon to avoid run loop: /janitor
    Successfully deleted self from marathon (code=200): /janitor
