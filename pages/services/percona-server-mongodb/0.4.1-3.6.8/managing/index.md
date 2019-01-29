---
layout: layout.pug
navigationTitle:  Operations
title: Managing Percona Server for MongoDB
menuWeight: 60
excerpt: Managing Percona Server for MongoDB
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

# Updating your configuration

You can make changes to the {{ model.techName }} service after it has been launched. Configuration management is handled by the scheduler process, which in turn handles deploying {{ model.techName }} itself. 

After making a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `mongo-rs-0`, then `mongo-rs-1`, and so on. Nodes are configured with a "Readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence. However, this basic check is not foolproof and reasonable care should be taken to ensure that a given configuration change will not negatively affect the behavior of the service.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment. See [Limitations](#limitations).

The instructions below describe how to update the configuration for a running DC/OS service.

### Enterprise DC/OS 1.10 and later

Enterprise DC/OS 1.10 introduced a convenient command line option that allows for easier updates to a service's configuration, as well as allowing users to inspect the status of an update, to pause and resume updates, and to restart or complete steps if necessary.

#### Prerequisites

+ Enterprise DC/OS 1.10 or later
+ Service with a version greater than 2.0.0-x
+ [The DC/OS CLI](https://docs.mesosphere.com/latest/cli/install/) installed and available
+ The service's subcommand available and installed on your local machine
  + You can install just the subcommand CLI by running `dcos package install --cli {{ model.serviceName }}`.
  + If you are running an older version of the subcommand CLI that does not have the `update` command, uninstall and reinstall your CLI.
    ```shell
    dcos package uninstall --cli {{ model.serviceName }}
    dcos package install --cli {{ model.serviceName }}
    ```

#### Preparing configuration

If you installed this service with Enterprise DC/OS 1.10 or later, you can fetch the full configuration of a service (including any default values that were applied during installation). For example:

```shell
dcos {{ model.serviceName }} describe > options.json
```

Make any configuration changes to this `options.json` file.

If you installed this service with a prior version of DC/OS, this configuration will not have been persisted by the DC/OS package manager. You can instead use the `options.json` file that was used when [installing the service](#initial-service-configuration).

<p class="message--important"><strong>IMPORTANT: </strong> You must specify all configuration values in the <tt>options.json</tt> file when performing a configuration update. Any unspecified values will be reverted to the default values specified by the DC/OS service. See the <tt>Recreating options.json</tt> section below for information on recovering these values.</pd> 


##### Recreating `options.json` (optional)

If the `options.json` from when the service was last installed or updated is not available, you will need to manually recreate it using the following steps.

1. Fetch the default application's environment, current application's environment, and the actual template that maps config values to the environment:

	1. Ensure you have [jq](https://stedolan.github.io/jq/) installed.
	1. Set the service name that you are using, for example:
        ```shell
        SERVICE_NAME={{ model.serviceName }}
        ```
	1. Get the version of the package that is currently installed:
        ```shell
        PACKAGE_VERSION=$(dcos package list | grep $SERVICE_NAME | awk '{print $2}')
        ```
	1. Fetch and save the environment variables that have been set for the service:
        ```shell
        dcos marathon app show $SERVICE_NAME | jq .env > current_env.json
        ```
	1. To identify those values that are custom, we will get the default environment variables for this version of the service:
        ```shell
        dcos package describe --package-version=$PACKAGE_VERSION --render --app $SERVICE_NAME | jq .env > default_env.json
        ```
	1. We will also get the entire application template:
        ```shell
        dcos package describe $SERVICE_NAME --app > marathon.json.mustache
        ```

2. Recreate the `options.json`.

	1. Use JQ and `diff` to compare the two:
        ```shell
        diff <(jq -S . default_env.json) <(jq -S . current_env.json)
        ```
	1. Now compare these values to the values contained in the `env` section in application template:
        ```shell
        less marathon.json.mustache
        ```
	1. Use the variable names (such as, `{{service.name}}`) to create a new `options.json` file as described in [Initial service configuration](#initial-service-configuration).

#### Starting the update

Once you are ready to begin, initiate an update using the DC/OS CLI, passing in the updated `options.json` file:

```shell
dcos {{ model.serviceName }} update start --options=options.json
```

You will receive an acknowledgement message and the DC/OS package manager will restart the Scheduler in Marathon.

See [Advanced update actions](#advanced-update-actions) for commands you can use to inspect and manipulate an update after it has started.

### Open Source DC/OS

If you do not have Enterprise DC/OS 1.10 or later, the CLI commands above are not available. For Open Source DC/OS of any version you can perform changes from the DC/OS web interface.

To make configuration changes via scheduler environment updates, perform the following steps:
1. Visit `<dcos-url>` to access the DC/OS web interface.
1. Navigate to `Services` and click on the service to be configured (default `{{ model.serviceName }}`).
1. Click `Edit` in the upper right.
1. Navigate to `Environment` (or `Environment variables`) and search for the option to be updated.
1. Update the option value and click `Review and run` (or `Deploy changes`).
1. The Scheduler process will be restarted with the new configuration and will validate any detected changes.
1. If the detected changes pass validation, the relaunched Scheduler will deploy the changes by sequentially relaunching affected tasks as described above.

To see a full listing of available options, run `dcos package describe --config {{ model.serviceName }}` in the CLI, or browse the DC/OS {{ model.techName }} Service install dialog in the DC/OS Dashboard.

<a name="adding-a-node"></a>

### Adding a Node

The service deploys 3 nodes by default, as 3 nodes is the minimum node requirement for a Highly-Available [{{ model.dbName }} Replica Set](https://docs.mongodb.com/manual/replication/). 

<p class="message--note"><strong>NOTE: </strong>Only 1 (not recommended), 3, 5 or 7 nodes are recommended and supported.</p> 


You can customize this value at initial deployment or after the cluster is already running. Shrinking the count is not supported. Modify the `NODE_COUNT` environment variable to update the node count. If you decrease this value, the scheduler will prevent the configuration change until it is reverted back to its original value or larger.

<a name="resizing-a-node"></a>

### Resizing a Node

The CPU and Memory requirements of each node can be increased or decreased as follows:
- CPU (1.0 = 1 core): `NODE_CPUS`
- Memory (in MB): `NODE_MEM`

<p class="message--note"><strong>NOTE: </strong>Volume requirements (type and/or size) cannot be changed after initial deployment.</p>


<a name="updating-placement-constraints"></a>

### Updating Placement Constraints

Placement constraints may be updated after initial deployment using the following procedure. See [Service Settings](#service-settings) above for more information on placement constraints. Let's say we have the following deployment of our nodes

- Placement constraint of: `hostname:LIKE:10.0.10.3|10.0.10.8|10.0.10.26|10.0.10.28|10.0.10.84`
- Tasks:
```
10.0.10.3: mongo-rs-0
10.0.10.8: mongo-rs-1
10.0.10.26: mongo-rs-2
10.0.10.28: empty
10.0.10.84: empty
```

`10.0.10.8` is being decommissioned and we should move away from it. 

1. Remove the decommissioned IP and add a new IP to the placement rule whitelist by editing `NODE_PLACEMENT`:

	```
	hostname:LIKE:10.0.10.3|10.0.10.26|10.0.10.28|10.0.10.84|10.0.10.123
	```
1. Redeploy `mongo-rs-1` from the decommissioned node to somewhere within the new whitelist: `dcos {{ model.serviceName }} pod replace mongo-rs-1`
1. Wait for `mongo-rs-1` to be up and healthy before continuing with any other replacement operations.

<a name="restarting-a-node"></a>

## Restarting a Node

This operation will restart a node, while keeping it at its current location and with its current persistent volume data. This may be thought of as similar to restarting a system process, but it deletes any data that is not on a persistent volume.

Run `dcos {{ model.serviceName }} pod restart mongo-rs-<NUM>`, such as, `mongo-rs-2`.

<a name="replacing-a-node"></a>

## Replacing a Node

This operation will move a node to a new system and will discard the persistent volumes at the prior system to be rebuilt at the new system. Perform this operation if a given system is about to be offlined or has already been offlined.

<p class="message--important"><strong>IMPORTANT: </strong>Nodes are not moved automatically. You must perform the following steps manually to move nodes to new systems. You can automate node replacement according to your own preferences.</p>

For data safety, ensure that there is at least one healthy node in the replica set and a recent successful backup of {{ model.dbName }} data. Ensure there is a ["majority" in the {{ model.dbName }} Replica Set](https://docs.mongodb.com/manual/reference/write-concern/#writeconcern._dq_majority_dq_) if you do not want the replica set to become read-only during the node replacement.

1. Connect to the node and check if the node is the [Replica Set Primary](https://docs.mongodb.com/manual/core/replica-set-primary/). If the `rs.isMaster().ismaster` command returns a value of true`, the node is the PRIMARY member.
    ```shell
    $ mongo mongodb://useradmin:useradminpassword@mongo-rs-<NUM>-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    > rs.isMaster().ismaster
    true
    ```
1. If the node is the PRIMARY member, run a [Replica Set Step Down](https://docs.mongodb.com/manual/reference/method/rs.stepDown/). Skip this step if you received `false` from the last step.
    ```shell
    $ mongo mongodb://useradmin:useradminpassword@mongo-rs-<NUM>-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    > rs.stepDown()
    2018-04-03T13:58:29.166+0200 E QUERY    [thread1] Error: error doing query: failed: network error while attempting to run command 'replSetStepDown' on host '10.2.3.1:27017'  :
    DB.prototype.runCommand@src/mongo/shell/db.js:132:1
    DB.prototype.adminCommand@src/mongo/shell/db.js:150:16
    rs.stepDown@src/mongo/shell/utils.js:1274:12
    @(shell):1:1
    2018-04-03T13:58:29.167+0200 I NETWORK  [thread1] trying reconnect to 10.2.3.1:27017 (10.2.3.1) failed
    2018-04-03T13:58:29.168+0200 I NETWORK  [thread1] reconnect 10.2.3.1:27017 (10.2.3.1) ok
    test1:SECONDARY>
    ```
1. Run `dcos {{ model.serviceName }} pod replace mongo-rs-<NUM>` to halt the current instance with id `<NUM>` (if still running) and launch a new instance elsewhere.

For example, let's say `mongo-rs-2`'s host system has died and `mongo-rs-2` needs to be moved.

1. Connect to the node and check if the node is the [Replica Set Primary](https://docs.mongodb.com/manual/core/replica-set-primary/). If the `rs.isMaster().ismaster` command returns a value of `true`, the node is the PRIMARY member.
    ```shell
    $ mongo mongodb://useradmin:useradminpassword@mongo-rs-2-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    > rs.isMaster().ismaster
    true
    ```
1. If the node is the PRIMARY member, run a [Replica Set Step Down](https://docs.mongodb.com/manual/reference/method/rs.stepDown/). Skip this step if you received a value of `false` from the last step.
    ```shell
    $ mongo mongodb://useradmin:useradminpassword@mongo-rs-<NUM>-mongod.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:27017/admin?replicaSet=rs
    > rs.stepDown()
    2018-04-03T13:58:29.166+0200 E QUERY    [thread1] Error: error doing query: failed: network error while attempting to run command 'replSetStepDown' on host '10.2.3.1:27017'  :
    DB.prototype.runCommand@src/mongo/shell/db.js:132:1
    DB.prototype.adminCommand@src/mongo/shell/db.js:150:16
    rs.stepDown@src/mongo/shell/utils.js:1274:12
    @(shell):1:1
    2018-04-03T13:58:29.167+0200 I NETWORK  [thread1] trying reconnect to 10.2.3.1:27017 (10.2.3.1) failed
    2018-04-03T13:58:29.168+0200 I NETWORK  [thread1] reconnect 10.2.3.1:27017 (10.2.3.1) ok
    test1:SECONDARY>
    ```
1. Now that the node has been decommissioned, start `mongo-rs-2` at a new location in the cluster.
    ```shell
    dcos {{ model.serviceName }} pod replace mongo-rs-2
    ```

<a name="upgrading"></a>

## Upgrading Service Version

The instructions below show how to safely update one version of `{{ model.serviceName }}` to the next.

##### Viewing available versions

The `update package-versions` command allows you to view the versions of a service that you can upgrade or downgrade to. These are specified by the service maintainer and depend on the semantics of the service (for example, whether or not upgrades are a reversal).

For example, run:

```shell
dcos {{ model.serviceName }} update package-versions
```

## Upgrading or downgrading a service

1. Before updating the service itself, update its CLI subcommand to the new version:
```shell
dcos package uninstall --cli {{ model.serviceName }}
dcos package install --cli {{ model.serviceName }} -package-version="0.4.1-3.6.8"
```
1. Once the CLI subcommand has been updated, call the update start command, passing in the version. For example, to update DC/OS {{ model.techName }} Service to version `0.4.1-3.6.8`:
```shell
dcos {{ model.serviceName }} update start --package-version="0.4.1-3.6.8"
```

If you are missing mandatory configuration parameters, the `update` command will return an error. To supply missing values, you can also provide an `options.json` file (see [Updating configuration](#updating-configuration)):
```shell
dcos {{ model.serviceName }} update start --options=options.json --package-version="0.4.1-3.6.8"
```

See [Advanced update actions](#advanced-update-actions) for commands you can use to inspect and manipulate an update after it has started.

## Advanced update actions

The following sections describe advanced commands that be used to interact with an update in progress.

### Monitoring the update

Once the Scheduler has been restarted, it will begin a new deployment plan as individual pods are restarted with the new configuration. Depending on the high availability characteristics of the service being updated, you may experience a service disruption.

You can query the status of the update as follows:

```shell
dcos {{ model.serviceName }} update status
```

If the Scheduler is still restarting, DC/OS will not be able to route to it and this command will return an error message. Wait a short while and try again. You can also go to the Services tab of the DC/OS web interface to check the status of the restart.

### Pause

To pause an ongoing update, issue a pause command:

```shell
dcos {{ model.serviceName }} update pause
```

You will receive an error message if the plan has already completed or has been paused. Once completed, the plan will enter the `WAITING` state.

### Resume

If a plan is in a `WAITING` state, as a result of being paused or reaching a breakpoint that requires manual operator verification, you can use the `resume` command to continue the plan:

```shell
dcos {{ model.serviceName }} update resume
```

You will receive an error message if you attempt to `resume` a plan that is already in progress or has already completed.

### Force Complete

In order to manually "complete" a step (such that the Scheduler stops attempting to launch a task), you can issue a `force-complete` command. This will instruct to Scheduler to mark a specific step within a phase as complete. You need to specify both the phase and the step, for example:

```shell
dcos {{ model.serviceName }} update force-complete service-phase service-0:[node]
```

### Force Restart

Similar to force complete, you can also force a restart. This can either be done for an entire plan, a phase, or just for a specific step.

To restart the entire plan:
```shell
dcos {{ model.serviceName }} update force-restart
```

Or for all steps in a single phase:
```shell
dcos {{ model.serviceName }} update force-restart service-phase
```

Or for a specific step within a specific phase:
```shell
dcos {{ model.serviceName }} update force-restart service-phase service-0:[node]
```

