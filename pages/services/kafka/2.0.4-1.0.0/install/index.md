---
layout: layout.pug
navigationTitle:  Install and Customize
excerpt:
title: Install and Customize
menuWeight: 20
enterprise: false
---

Kafka is available in the Universe and can be installed by using either the web interface or the DC/OS CLI.

##  <a name="install-enterprise"></a>Prerequisites

- Depending on your security mode in Enterprise DC/OS, you may [need to provision a service account](/services/kafka/2.0.4-1.0.0/kafka-auth/) before installing Kafka. Only someone with `superuser` permission can create the service account.
	- `strict` [security mode](/1.11/installing/production/advanced-configuration/configuration-reference/) requires a service account.
	- `permissive` security mode a service account is optional.
	- `disabled` security mode does not require a service account.
- Your cluster must have at least three private nodes.

# Default Installation

To start a basic test cluster with three brokers, run the following command on the DC/OS CLI. Enterprise DC/OS users must follow additional instructions. [More information about installing Kafka on Enterprise DC/OS](#install-enterprise).

```bash
$ dcos package install kafka
```

This command creates a new Kafka cluster with the default name `kafka`. Two clusters cannot share the same name, so installing additional clusters beyond the default cluster requires [customizing the `name` at install time][4] for each additional instance.

All `dcos kafka` CLI commands have a `--name` argument allowing the user to specify which Kafka instance to query. If you do not specify a service name, the CLI assumes the default value, `kafka`. The default value for `--name` can be customized via the DC/OS CLI configuration:

```bash
$ dcos kafka --name=<kafka-dev> <cmd>
```

**Note:** Alternatively, you can [install Kafka from the DC/OS web interface](https://docs.mesosphere.com/1.9/deploying-services/install/). If you install Kafka from the web interface, you must install the Kafka DC/OS CLI subcommands separately. From the DC/OS CLI, enter:

```bash
dcos package install kafka --cli
```

# Minimal Installation

For development purposes, you may wish to install Kafka on a local DC/OS cluster. For this, you can use [dcos-vagrant][5].

To start a minimal cluster with a single broker, create a JSON options file named `sample-kafka-minimal.json`:

```json
{
  "brokers": {
    "count": 1,
    "mem": 512,
    "disk": 1000
  }
}
```


The command below creates a cluster using `sample-kafka-minimal.json`:

```bash
$ dcos package install --options=sample-kafka-minimal.json kafka
```

<a name="custom-installation"></a>
# Custom Installation

Customize the defaults by creating a JSON file. Then, pass it to `dcos package install` using the `--options` parameter.

Sample JSON options file named `sample-kafka-custom.json`:

```json
{
  "service": {
    "name": "sample-kafka-custom",
    "placement_strategy": "NODE"
  },
  "brokers": {
    "count": 10,
    "kill_grace_period": 30
  },
  "kafka": {
    "delete_topic_enable": true,
    "log_retention_hours": 128
  }
}
```

The command below creates a cluster using `sample-kafka.json`:

```bash
$ dcos package install --options=sample-kafka-custom.json kafka
```

**Recommendation:** Store your custom configuration in source control.

See [Configuration Options][6] for a list of fields that can be customized via an options JSON file when the Kafka cluster is created.

Alternatively, you can perform a custom installation from the DC/OS web interface. Choose `ADVANCED INSTALLATION` at install time.

# Multiple Kafka cluster installation

Installing multiple Kafka clusters is identical to installing Kafka clusters with custom configurations as described above. The only requirement on the operator is that a unique `name` be specified for each installation. For example:

```bash
$ cat kafka1.json
{
  "service": {
  "name": "kafka1"
  }
}

$ dcos package install kafka --options=kafka1.json
```
<!-- THIS BLOCK DUPLICATES THE OPERATIONS GUIDE -->

# Integration with DC/OS access controls


 [4]: #custom-installation
 [5]: https://github.com/mesosphere/dcos-vagrant
 [6]: #configuration-options

In Enterprise DC/OS 1.10 and above, you can integrate your SDK-based service with DC/OS ACLs to grant users and groups access to only certain services. You do this by installing your service into a folder, and then restricting access to some number of folders. Folders also allow you to namespace services. For instance, `staging/kafka` and `production/kafka`.

Steps:

1. In the DC/OS GUI, create a group, then add a user to the group. Or, just create a user. Click **Organization** > **Groups** > **+** or **Organization** > **Users** > **+**. If you create a group, you must also create a user and add them to the group.
1. Give the user permissions for the folder where you will install your service. In this example, we are creating a user called `developer`, who will have access to the `/testing` folder.

	 Select the group or user you created. Select **ADD PERMISSION** and then toggle to **INSERT PERMISSION STRING**. Add each of the following permissions to your user or group, and then click **ADD PERMISSIONS**.

           ```
		   dcos:adminrouter:service:marathon full
		   dcos:service:marathon:marathon:services:/testing full
		   dcos:adminrouter:ops:mesos full
		   dcos:adminrouter:ops:slave full
		   ```
1. Install your service into a folder called `test`. Go to **Catalog**, then search for **kafka**.
1. Click **CONFIGURE** and change the service name to `/testing/kafka`, then deploy.

	 The slashes in your service name are interpreted as folders. You are deploying Kafka in the `/testing` folder. Any user with access to the `/testing` folder will have access to the service.

**Important:**
- Services cannot be renamed. Because the location of the service is specified in the name, you cannot move services between folders.
- DC/OS 1.9 and earlier does not accept slashes in service names. You may be able to create the service, but you will encounter unexpected problems.

## Interacting with your foldered service

- Interact with your foldered service via the DC/OS CLI with this flag: `--name=/path/to/myservice`.
- To interact with your foldered service over the web directly, use `http://<dcos-url>/service/path/to/myservice`. E.g., `http://<dcos-url>/service/testing/kafka/v1/endpoints`.

<!-- END DUPLICATE BLOCK -->

<!-- THIS CONTENT DUPLICATES THE DC/OS OPERATION GUIDE -->
## Placement Constraints

Placement constraints allow you to customize where a service is deployed in the DC/OS cluster. Depending on the service, some or all components may be configurable using [Marathon operators (reference)](http://mesosphere.github.io/marathon/docs/constraints.html) with this syntax: `field:OPERATOR[:parameter]`. For example, if the reference lists `[["hostname", "UNIQUE"]]`, you should  use `hostname:UNIQUE`.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:
```
hostname:LIKE:10.0.0.159|10.0.1.202|10.0.3.3
```

You must include spare capacity in this list, so that if one of the whitelisted systems goes down, there is still enough room to repair your service (via [`pod replace`](#replace-a-pod)) without requiring that system.

### Regions and Zones

Placement constraints can be applied to zones by referring to the `@zone` key. For example, one could spread pods across a minimum of 3 different zones by specifying the constraint:
```
[["@zone", "GROUP_BY", "3"]]
```

When the region awareness feature is enabled (currently in beta), the `@region` key can also be referenced for defining placement constraints. Any placement constraints that do not reference the `@region` key are constrained to the local region.

<!-- end duplicate block -->


<a name="changing-configuration-at-runtime"></a>
# Changing Configuration at Runtime

You can customize your cluster in-place when it is up and running.

The Kafka scheduler runs as a Marathon process and can be reconfigured by changing values from the DC/OS web interface. These are the general steps to follow:

1.  Go to the `Services` tab of the DC/OS web interface.
1.  Click the name of the Kafka service to be updated.
1.  Within the Kafka instance details view, click the menu in the upper right, then choose **Edit**.
1.  In the dialog that appears, click the **Environment** tab and update any field(s) to their desired value(s). For example, to [increase the number of Brokers][8], edit the value for `BROKER_COUNT`. Do not edit the value for `FRAMEWORK_NAME` or `BROKER_DISK`.
1.  Choose a `DEPLOY_STRATEGY`: serial, serial-canary, parallel-canary, or parallel. See the SDK Developer guide for more information on [deployment plan strategies](https://mesosphere.github.io/dcos-commons/developer-guide.html#plans). <!-- I'm not sure I like this solution, since users aren't going to have the context for the dev guide). -->
1.  Click **REVIEW & RUN** to apply any changes and cleanly reload the Kafka scheduler. The Kafka cluster itself will persist across the change.

## Configuration Update REST API

Make the REST request below to view the current deployment plan. See the REST API Authentication part of the [REST API Reference](api-reference.md) section for information on how this request must be authenticated.

```bash
$ curl -H "Authorization: token=$auth_token" "<dcos_url>/service/kafka/v1/plan"

{
    "phases": [
        {
            "id": "b6180a4e-b25f-4307-8855-0b37d671fd46",
            "name": "Deployment",
            "steps": [
                {
                    "id": "258f19a4-d6bc-4ff1-8685-f314924884a1",
                    "status": "COMPLETE",
                    "name": "kafka-0:[broker]",
                    "message": "com.mesosphere.sdk.scheduler.plan.DeploymentStep: 'kafka-0:[broker] [258f19a4-d6bc-4ff1-8685-f314924884a1]' has status: 'COMPLETE'."
                },
                {
                    "id": "e59fb2a9-22e2-4900-89e3-bda24041639f",
                    "status": "COMPLETE",
                    "name": "kafka-1:[broker]",
                    "message": "com.mesosphere.sdk.scheduler.plan.DeploymentStep: 'kafka-1:[broker] [e59fb2a9-22e2-4900-89e3-bda24041639f]' has status: 'COMPLETE'."
                },
                {
                    "id": "0b5a5048-fd3a-4b2c-a9b5-746045176d29",
                    "status": "COMPLETE",
                    "name": "kafka-2:[broker]",
                    "message": "com.mesosphere.sdk.scheduler.plan.DeploymentStep: 'kafka-2:[broker] [0b5a5048-fd3a-4b2c-a9b5-746045176d29]' has status: 'COMPLETE'."
                }
            ],
            "status": "COMPLETE"
        }
    ],
    "errors": [],
    "status": "COMPLETE"
}
```

<!-- need to update this with current information for different deployments
When using the `STAGE` deployment strategy, an update plan will initially pause without doing any update to ensure the plan is correct. It will look like this:

    curl -H "Authorization: token=$auth_token" "<dcos_url>/service/kafka/v1/plan"
    GET <dcos_url>/service/kafka/v1/plan HTTP/1.1

    {
      "phases": [
        {
          "id": "9f8927de-d0df-4f72-bd0d-55e3f2c3ab21",
          "name": "Reconciliation",
          "steps": [
            {
              "id": "2d137273-249b-455e-a65c-3c83228890b3",
              "status": "COMPLETE",
              "name": "Reconciliation",
              "message": "Reconciliation complete"
            }
          ],
          "status": "COMPLETE"
        },
        {
          "id": "a7742963-f7e1-4640-8bd0-2fb28dc04045",
          "name": "Update to: 6092e4ec-8ffb-49eb-807b-877a85ef8859",
          "steps": [
            {
              "id": "b4453fb0-b4cc-4996-a05c-762673f75e6d",
              "status": "PENDING",
              "name": "broker-0",
              "message": "Broker-0 is WAITING"
            },
            {
              "id": "b8a8de9f-8758-4d0f-b785-0a38751a2c94",
              "status": "PENDING",
              "name": "broker-1",
              "message": "Broker-1 is WAITIN"
            },
            {
              "id": "49e85522-1bcf-4edb-9456-712e8a537dbc",
              "status": "PENDING",
              "name": "broker-2",
              "message": "Broker-2 is PENDING"
            }
          ],
          "status": "WAITING"
        }
      ],
      "errors": [],
      "status": "WAITING"
    }
-->
**Note:** After a configuration update, you may see an error from Mesos-DNS; this will go away 10 seconds after the update.

Enter the `continue` command to execute the first step:

```bash
$ curl -X PUT -H "Authorization: token=$auth_token" "<dcos_url>/service/kafka/v1/plan?cmd=continue"
PUT <dcos_url>/service/kafka/v1/continue HTTP/1.1

{
    "Result": "Received cmd: continue"
}
```

After you execute the continue operation, the plan will look like this:

```bash
$ curl -H "Authorization: token=$auth_token" "<dcos_url>/service/kafka/v1/plan"
GET <dcos_url>/service/kafka/v1/plan HTTP/1.1

{
    "phases": [
    {
        "id": "9f8927de-d0df-4f72-bd0d-55e3f2c3ab21",
        "name": "Reconciliation",
        "steps": [
        {
            "id": "2d137273-249b-455e-a65c-3c83228890b3",
            "status": "COMPLETE",
            "name": "Reconciliation",
            "message": "Reconciliation complete"
        }
        ],
        "status": "COMPLETE"
    },
    {
        "id": "a7742963-f7e1-4640-8bd0-2fb28dc04045",
        "name": "Update to: 6092e4ec-8ffb-49eb-807b-877a85ef8859",
        "steps": [
        {
            "id": "b4453fb0-b4cc-4996-a05c-762673f75e6d",
            "status": "IN_PROGRESS",
            "name": "broker-0",
            "message": "Broker-0 is IN_PROGRESS"
        },
        {
            "id": "b8a8de9f-8758-4d0f-b785-0a38751a2c94",
            "status": "WAITING",
            "name": "broker-1",
            "message": "Broker-1 is WAITING"
        },
        {
            "id": "49e85522-1bcf-4edb-9456-712e8a537dbc",
            "status": "PENDING",
            "name": "broker-2",
            "message": "Broker-2 is PENDING"
        }
        ],
        "status": "IN_PROGRESS"
    }
    ],
    "errors": [],
    "status": "IN_PROGRESS"
}
```


If you enter `continue` a second time, the rest of the plan will be executed without further interruption. If you want to interrupt a configuration update that is in progress, enter the `interrupt` command:

```bash
$ curl -X PUT -H "Authorization: token=$auth_token"  "<dcos_url>/service/kafka/v1/plan?cmd=interrupt"
PUT <dcos_url>/service/kafka/v1/interrupt HTTP/1.1

{
    "Result": "Received cmd: interrupt"
}
```

**Note:** The interrupt command can’t stop a step that is `InProgress`, but it will stop the change on the subsequent steps.

<a name="configuration-options"></a>
# Configuration Options

The following describes the most commonly used features of the Kafka service and how to configure them via the DC/OS CLI and from the DC/OS web interface. View the [default `config.json` in DC/OS Universe][11] to see all possible configuration options.

## Service Name

The name of this Kafka instance in DC/OS. This is an option that cannot be changed once the Kafka cluster is started: it can only be configured via the DC/OS CLI `--options` flag when the Kafka instance is created.

*   **In DC/OS CLI options.json**: `name`: string (default: `kafka`)
*   **DC/OS web interface**: The service name cannot be changed after the cluster has started.

## Kill Grace Period

The kiill grace period is the number of seconds each broker has to cleanly shut
down in response to SIGTERM. If a broker exceeds this time, it will be killed.
Use the `brokers.kill_grace_period` configuration option to set a kill grace period.

The graceful shutdown feature is especially important for large-scale deployments.
Use the graceful shutdown configuraiton option to provide the broker sufficient
time during shutdown. This ensure that all in-memory data is flushed to disk and
all state is replicated. When a broker has sufficient time to shut down, the
subsequent restart will be nearly as fast as the first startup. This is a large
contributor to the Kafka service's high availability.

You can observe the graceful shutdown feature via the following log entries:

1. The task launch log line contains `kill_policy { grace_period { nanoseconds: 30000000000 } }`.
1. The task graceful shutdown log line contains SIGTERM as well as the grace time granted.
1. The underlying Kafka logging of shutdown operations includes a stream of subsystem shutdowns prior to the overarching system
   shutdown indicated by the entry `[Kafka Server 1], shut down completed (kafka.server.KafkaServer)`.
1. The presence (or not) of a SIGKILL log line indicating that the underlying Kafka broker did not shutdown cleanly within the
   allotted grace period.
1. The task status update marked by `TASK_KILLED`, indicating the end of the shutdown activity.

## Broker Count

Configure the number of brokers running in a given Kafka cluster. The default count at installation is three brokers. This number may be increased, but not decreased, after installation.

*   **In DC/OS CLI options.json**: `broker-count`: integer (default: `3`)
*   **DC/OS web interface**: `BROKER_COUNT`: `integer`

## Broker Port

Configure the port number that the brokers listen on. If the port is set to a particular value, this will be the port used by all brokers. The default port is 9092.  Note that this requires that `placement-strategy` be set to `NODE` to take effect, since having every broker listening on the same port requires that they be placed on different hosts. Setting the port to 0 indicates that each Broker should have a random port in the 9092-10092 range.

*   **In DC/OS CLI options.json**: `broker-port`: integer (default: `9092`)
*   **DC/OS web interface**: `BROKER_PORT`: `integer`

## Configure Broker Placement Strategy <!-- replace this with a discussion of PLACEMENT_CONSTRAINTS? -->

`ANY` allows brokers to be placed on any node with sufficient resources, while `NODE` ensures that all brokers within a given Kafka cluster are never colocated on the same node. This is an option that cannot be changed once the Kafka cluster is started: it can only be configured via the DC/OS CLI `--options` flag when the Kafka instance is created.

*   **In DC/OS CLI options.json**: `placement-strategy`: `ANY` or `NODE` (default: `ANY`)
*   **DC/OS web interface**: `PLACEMENT_STRATEGY`: `ANY` or `NODE`

## Configure Kafka Broker Properties

Kafka Brokers are configured through settings in a server.properties file deployed with each Broker. The settings here can be specified at installation time or during a post-deployment configuration update. They are set in the DC/OS Universe's config.json as options such as:

```json
    "log_retention_hours": {
        "title": "log.retention.hours",
        "description": "Override log.retention.hours: The number of hours to keep a log file before deleting it (in hours), tertiary to log.retention.ms property",
        "type": "integer",
        "default": 168
    },
```

The defaults can be overridden at install time by specifying an options.json file with a format like this:

```json
    {
        "kafka": {
            "log_retention_hours": 100
        }
    }
```

These same values are also represented as environment variables for the scheduler in the form `KAFKA_OVERRIDE_LOG_RETENTION_HOURS` and may be modified through the DC/OS web interface and deployed during a rolling upgrade as [described here][12].

<a name="disk-type"></a>
## Disk Type

The type of disks that can be used for storing broker data are: `ROOT` (default) and `MOUNT`.  The type of disk may only be specified at install time.

* `ROOT`: Broker data is stored on the same volume as the agent work directory. Broker tasks will use the configured amount of disk space.
* `MOUNT`: Broker data will be stored on a dedicated volume attached to the agent. Dedicated MOUNT volumes have performance advantages and a disk error on these MOUNT volumes will be correctly reported to Kafka.

Configure Kafka service to use dedicated disk volumes:
* **DC/OS cli options.json**:

```json
    {
        "brokers": {
            "disk_type": "MOUNT"
        }
    }
```

* **DC/OS web interface**: Set the environment variable `DISK_TYPE`: `MOUNT`

When configured to `MOUNT` disk type, the scheduler selects a disk on an agent whose capacity is equal to or greater than the configured `disk` value.

## JVM Heap Size

Kafka service allows configuration of JVM Heap Size for the broker JVM process. To configure it:
* **DC/OS cli options.json**:

```json
    {
        "brokers": {
            "heap": {
                "size": 2000
            }
        }
    }
```

* **DC/OS web interface**: Set the environment variable `BROKER_HEAP_MB`: `2000`

**Note**: The total memory allocated for the Mesos task is specified by the `BROKER_MEM` configuration parameter. The value for `BROKER_HEAP_MB` should not be greater than `BROKER_MEM` value. Also, if `BROKER_MEM` is greater than `BROKER_HEAP_MB` then the Linux operating system will use `BROKER_MEM` - `BROKER_HEAP_MB` for [PageCache](https://en.wikipedia.org/wiki/Page_cache).

## Alternate ZooKeeper

By default, the Kafka services uses the ZooKeeper ensemble made available on the Mesos masters of a DC/OS cluster. You can configure an alternate ZooKeeper at install time. This enables you to increase Kafka's capacity and removes the system ZooKeeper's involvment in the service.

To configure it:

1. Create a file named `options.json` with the following contents.

**Note:** If you are using the [DC/OS Apache ZooKeeper service](https://docs.mesosphere.com/services/kafka-zookeeper), use the DNS addresses provided by the `dcos kafka-zookeeper endpoints clientport` command as the value of `kafka_zookeeper_uri`.

```json
{
    "kafka": {
      "kafka_zookeeper_uri": "zookeeper-0-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140,zookeeper-1-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140,zookeeper-2-server.kafka-zookeeper.autoip.dcos.thisdcos.directory:1140"
    }
}
```

1. Install Kafka with the options file.

```shell
dcos package install kafka --options="options.json"
```

You can also update an already-running Kafka instance from the DC/OS CLI, in case you need to migrate your ZooKeeper data elsewhere.

**Note:** The ZooKeeper ensemble you point to must have the same data as the previous ZooKeeper ensemble.

```shell
dcos kafka --name=/kafka update start --options=options.json
```


## Recovery and Health Checks

You can enable automated replacement of brokers and configure the circumstances under which they are replaced.

### Enable Broker Replacement

To enable automated replacement:

* **DC/OS CLI options.json**:

```json
    {
        "enable_replacement":{
            "description":"Enable automated replacement of Brokers. WARNING: May cause data loss. See documentation.",
            "type":"boolean",
            "default":false
        }
    }
```

* **DC/OS web interface**: Set the environment variable `ENABLE_REPLACEMENT`: `true` to enable replacement.

**Warning:** The replacement mechanism is unaware of whether the broker it is destructively replacing had the latest copy of data. Depending on your replication policy and the degree and duration of the permanent failures, you may lose data.

The following configuration options control the circumstances under which a broker is replaced.

### Minumum Grace Period

Configure the minimum amount of time before a broker should be replaced:

* **DC/OS CLI options.json**:

```json
    {
        "recover_in_place_grace_period_secs":{
            "description":"The minimum amount of time (in minutes) which must pass before a Broker may be destructively replaced.",
            "type":"number",
            "default":1200
        }
    }
```

* **DC/OS web interface**: Set the environment variable `RECOVERY_GRACE_PERIOD_SEC`: `1200`

### Minumum Delay Between Replacements

Configure the minimum amount of time between broker replacements.

```json
    {
        "min_delay_between_recovers_secs":{
            "description":"The minimum amount of time (in seconds) which must pass between destructive replacements of Brokers.",
            "type":"number",
            "default":600
        }
    }
```

* **DC/OS web interface**: Set the environment variable `REPLACE_DELAY_SEC`: `600`

The following configurations control the health checks that determine when a broker has failed:

### Enable Health Check

Enable health checks on brokers:

```json
    {
        "enable_health_check":{
            "description":"Enable automated detection of Broker failures which did not result in a Broker process exit.",
            "type":"boolean",
            "default":true
        }
    }
```

* **DC/OS web interface**: Set the environment variable `ENABLE_BROKER_HEALTH_CHECK`: `true`

### Health Check Delay

Set the amount of time before the health check begins:

```json
    {
        "health_check_delay_sec":{
            "description":"The period of time (in seconds) waited before the health-check begins execution.",
            "type":"number",
            "default":15
        }
    }
```

* **DC/OS web interface**: Set the environment variable `BROKER_HEALTH_CHECK_DELAY_SEC`: `15`

### Health Check Interval

Set the interval between health checks:

```json
    {
        "health_check_interval_sec":{
            "description":"The period of time (in seconds) between health-check executions.",
            "type":"number",
            "default":10
        }
    }
```

* **DC/OS web interface**: Set the environment variable `BROKER_HEALTH_CHECK_INTERVAL_SEC`: `10`

### Health Check Timeout

Set the time a health check can take to complete before it is considered a failed check:
```json
    {
        "health_check_timeout_sec":{
            "description":"The duration (in seconds) allowed for a health-check to complete before it is considered a failure.",
            "type":"number",
            "default":20
        }
    }
```

* **DC/OS web interface**: Set the environment variable `BROKER_HEALTH_CHECK_TIMEOUT_SEC`: `20`

### Health Check Grace Period

Set the amount of time after the delay before health check failures count toward the maximum number of consecutive failures:

```json
    {
        "health_check_grace_period_sec":{
            "description":"The period of time after the delay (in seconds) before health-check failures count towards the maximum consecutive failures.",
            "type":"number",
            "default":10
        }
    }
```

* **DC/OS web interface**: Set the environment variable `BROKER_HEALTH_CHECK_GRACE_SEC`: `10`

### Maximum Consecutive Health Check Failures

```json
    {
        "health_check_max_consecutive_failures":{
            "description":"The the number of consecutive failures which cause a Broker process to exit.",
            "type":"number",
            "default":3
        }
    }
```

* **DC/OS web interface**: Set the environment variable `BROKER_HEALTH_CHECK_MAX_FAILURES`: `3`

 [8]: #broker-count
 [11]: https://github.com/mesosphere/universe/tree/version-3.x/repo/packages/K/kafka/39
 [12]: #changing-configuration-at-runtime
