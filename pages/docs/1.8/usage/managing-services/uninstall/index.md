---
layout: layout.pug
navigationTitle:  Uninstalling Services
title: Uninstalling Services
menuWeight: 4
excerpt:
featureMaturity:
enterprise: true
---

## About uninstalling services

Services can be uninstalled from either the web interface or the CLI. If the service has any reserved resources, you also need to run the framework cleaner script. The framework cleaner script removes the service instance from ZooKeeper, along with any data associated with it.

# Uninstalling a service

## Uninstalling a service using the CLI

1.  Uninstall a datacenter service with this command:

    ```bash
    dcos package uninstall <servicename>
    ```

    For example, to uninstall Chronos:

    ```bash
    dcos package uninstall chronos
    ```

### Uninstalling a service using the UI

From the DC/OS UI you can uninstall services from the **Services** or **Universe** tab. The Universe tab shows all of the available DC/OS services from package [repositories](/docs/1.8/usage/repo/). The Services tab provides a full featured interface to the native DC/OS Marathon instance.

### Universe tab

1.  Navigate to the **Universe** page in the DC/OS [UI](/docs/1.8/usage/webinterface/#universe).

2.  Click on the **Installed** tab to see your installed services.

3.  Hover your cursor over the name of the package you wish to uninstall and you will see a red "Uninstall" link to the right. Click this link to uninstall the package.

### Services tab

1.  Navigate to the [**Services**](/docs/1.8/usage/webinterface/#services) tab in the DC/OS UI.
1.  Select your application and click **Edit**, then select the **More -> Destroy**.

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

1.  Uninstall a user-created service with this command:

    ```bash
    dcos marathon app remove [--force] <app-id>
    ```

    For more information, see the [command reference](/docs/1.8/usage/cli/command-reference/#dcos-marathon).

### Web interface

From the DC/OS web interface you can uninstall services from the **Services**. The Services tab provides a full-featured interface to the native DC/OS Marathon instance.

### Services tab

1.  Navigate to the [**Services**](/docs/1.8/usage/webinterface/#services) tab in the DC/OS web interface.
1.  Select your application and click **Edit**, then select the **More -> Destroy**.

## <a name="framework-cleaner"></a>Cleaning up ZooKeeper

### About cleaning up ZooKeeper

If your service has reserved resources, you can use the framework cleaner docker image, `mesosphere/janitor`, to simplify the process of removing your service instance from ZooKeeper and destroying all the data associated with it.

There are two ways to run the framework cleaner script. The preferred method is via the DC/OS CLI. If the CLI is unavailable, you can also run the image as a self-deleting Marathon task.

### Configuring the cleanup

The script takes the following flags:

* `-r`: The role of the resources to be deleted
* `-p`: The principal of the resources to be deleted
* `-z`: The configuration zookeeper node to be deleted

These are some examples of default configurations (these will vary depending on selected task name, etc):

* Cassandra default: `docker run mesosphere/janitor /janitor.py -r cassandra-role -p cassandra-principal -z dcos-service-cassandra`
* HDFS default: `docker run mesosphere/janitor /janitor.py -r hdfs-role -p hdfs-principal -z dcos-service-hdfs`
* Kafka default: `docker run mesosphere/janitor /janitor.py -r kafka-role -p kafka-principal -z dcos-service-kafka`
* Custom values: `docker run mesosphere/janitor /janitor.py -r <custom_role> -p <custom_principal> -z dcos-service-<custom_service_name>`

### Running from the DC/OS CLI

Get the auth token, connect to the leader, and start the script:

1. Log into the DC/OS CLI if you have not done so already:

        dcos auth login

   Then, run `dcos config show core.dcos_acs_token` from the DC/OS CLI on your local machine.

        dcos config show core.dcos_acs_token
        eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0NzEyNzQyNzUsInVpZCI6ImJvb3RzdHJhcHVzZXIifQ.NrIG5ZiRcAW6Ra5wfmKRHFwiNNQBSJKMocaads9KXJIJRxYfTsPT_gHJsUGW5ZEiVxeLpraLCLB385bolb8aluDDt7RpNlxA6qQAZ84xZI3JU69SMAZxJSXY7TO_MhBEz0DcszD8Guem6F8eTA0uqQPI5FcFxER8okCjlScLF1-r55hP7PF5yLsIX5F4Ti_Jz12Yz3xRKMuDiBX2L4e_WJhzc_t5UXkTx25QPbC8M4pOlwRBeplqTpjQL6b7BLM4n7m35JUpUH56aWpk94kCK3XPO66YYjrWm3tlmQegTTs99XkKIYUfuSGbWi3Fytse8zXrctuiloresfJ37y3Y9g

1. Open an SSH session to the cluster leader.

        your-machinedcos node ssh --master-proxy --leader

1. Run the `mesosphere/janitor` image with the role, principal, and zookeeper nodes that were configured for your service. Replace `<token>` with the auth token you found in step 1.

        leaderdocker run mesosphere/janitor /janitor.py -r sample-role -p sample-principal -z sample-zk --auth_token=<token>

### Running from Marathon

Find and note your auth token using the instructions above.

From the DC/OS [**Services**](/docs/1.8/usage/webinterface) tab, use the JSON editor to add the following as a Marathon task. Replace the values passed to `-r`/`-p`/`-z` according to what needs to be cleaned up and the value of `<token>` with your auth token.

    {
      "id": "janitor",
      "cmd": "/janitor.py -r sample-role -p sample-principal -z sample --auth_token=<token>",
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

To view the script's outcome, go to Mesos (http://your-cluster.com/mesos) and look at the task's `stdout` content. If `stdout` lacks content, run the following command manually:

    # Determine id of agent which ran the Docker task. This is an example:

    your-machinedcos node ssh --master-proxy --mesos-id=c62affd0-ce56-413b-85e7-32e510a7e131-S3

    agent-nodedocker ps -a
    CONTAINER ID        IMAGE                       COMMAND             ...
    828ee17b5fd3        mesosphere/janitor:latest   /bin/sh -c /janito  ...

    agent-nodedocker logs 828ee17b5fd3

### Sample result

Here's an example of the output for a successful run for a Cassandra installation:

    your-machinedcos node ssh --master-proxy --leader

    leader-nodedocker run mesosphere/janitor /janitor.py -r cassandra_role -p cassandra_principal -z cassandra
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

### Troubleshooting Cleanup

If you run the `mesosphere/janitor` image and get the error below, you must provide an auth token:

     docker run mesosphere/janitor /janitor.py [... role/principal/zk args ...]
    [... other output ...]
    ('Invalid HTTP response:', HTTPError(u'401 Client Error: Unauthorized for url: http://leader.mesos:5050/master/slaves',))
    Deleting volumes failed, skipping other steps.

    /janitor.py
      -v/--verbose
      -r/--role=<framework-role>
      -p/--principal=<framework-principal>
      -z/--zk_path=<zk-path>
      [-m/--master_url=http://leader.mesos:5050/master/]
      [-n/--marathon_url=http://marathon.mesos:8080/v2/apps/]
      [-e/--exhibitor_url=http://leader.mesos:8181/]
      [--username=dcos_user]
      [--password=dcos_password]
      [--auth_token=dcos_auth_tok]
