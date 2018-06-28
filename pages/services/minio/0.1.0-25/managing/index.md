---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 80
excerpt: Managing your DC/OS Minio configuration
featureMaturity:
enterprise: false
---

# Updating Configuration

You can make changes to the service after it has been launched. Configuration management is handled by the scheduler process, which in turn handles Minio deployment itself.

After making a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `minio-0`, then `minio-1`, and so on.

Nodes are configured with a "Readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment. See [Limitations](../limitations/index.md).


The instructions below describe how to update the configuration for a running DC/OS service.

### Enterprise DC/OS 1.10

Enterprise DC/OS 1.10 introduces a convenient command line option that allows for easier updates to a service's configuration, as well as allowing users to inspect the status of an update, to pause and resume updates, and to restart or complete steps if necessary.

#### Prerequisites

+ Enterprise DC/OS 1.10 or newer.
+ Service with 1.5.0 version.
+ [The DC/OS CLI](https://docs.mesosphere.com/latest/cli/install/) installed and available.
+ The service's subcommand available and installed on your local machine.
  + You can install just the subcommand CLI by running `dcos package install --cli --yes minio`.
  + If you are running an older version of the subcommand CLI that doesn't have the `update` command, uninstall and reinstall your CLI.
    ```shell
    dcos package uninstall --cli minio
    dcos package install --cli minio
    ```

#### Preparing configuration

If you installed this service with Enterprise DC/OS 1.10, you can fetch the full configuration of a service (including any default values that were applied during installation). For example:

```shell
dcos minio describe > options.json
```

Make any configuration changes to the `options.json` file.

If you installed this service with a prior version of DC/OS, this configuration will not have been persisted by the the DC/OS package manager. You can instead use the `options.json` file that was used when [installing the service].

<strong>Note:</strong> You need to specify all configuration values in the `options.json` file when performing a configuration update. Any unspecified values will be reverted to the default values specified by the DC/OS service. See the "Recreating `options.json`" section below for information on recovering these values.

##### Recreating `options.json` (optional)

If the `options.json` from when the service was last installed or updated is not available, you will need to manually recreate it using the following steps.

First, we'll fetch the default application's environment, current application's environment, and the actual prometheus that maps config values to the environment:

1. Ensure you have [jq](https://stedolan.github.io/jq/) installed.
2. Set the service name that you're using, for example:
	```shell
	SERVICE_NAME=minio
	```
3. Get the version of the package that is currently installed:
	```shell
	PACKAGE_VERSION=$(dcos package list | grep $SERVICE_NAME | awk '{print $2}')
	```
4. Then fetch and save the environment variables that have been set for the service:
	```shell
	dcos marathon app show $SERVICE_NAME | jq .env > current_env.json
	```
5. To identify those values that are custom, we'll get the default environment variables for this version of the service:
	```shell
	dcos package describe --package-version=$PACKAGE_VERSION --render --app $SERVICE_NAME | jq .env > default_env.json
	```
6. We'll also get the entire application prometheus:
	```shell
	dcos package describe $SERVICE_NAME --app > marathon.json.mustache
	```

Now that you have these files, we'll attempt to recreate the `options.json`.

1. Use JQ and `diff` to compare the two:
	```shell
	diff <(jq -S . default_env.json) <(jq -S . current_env.json)
	```
2. Now compare these values to the values contained in the `env` section in application minio:
	```shell
	less marathon.json.mustache
	```
3. Use the variable names (e.g. `{{service.name}}`) to create a new `options.json` file as described in [Initial service configuration](#initial-service-configuration).

#### Starting the update

Once you are ready to begin, initiate an update using the DC/OS CLI, passing in the updated `options.json` file:

```shell
dcos minio update start --options=options.json
```

You will receive an acknowledgement message and the DC/OS package manager will restart the Scheduler in Marathon.

See [Advanced update actions](#advanced-update-actions) for commands you can use to inspect and manipulate an update after it has started.

To see a full listing of available options, run `dcos package describe --config prometheus` in the CLI, or browse the DC/OS prometheus Service install dialog in the DC/OS Dashboard.

<a name="adding-a-node"></a>
### Adding a Node

The service deploys 2 nodes by default. You can customize this value at initial deployment or after the cluster is already running. Shrinking the cluster is not supported.

Modify the COUNT `"node":{"count":3}` environment variable to update the node count. If you decrease this value, the scheduler will prevent the configuration change until it is reverted back to its original value or larger.

<a name="resizing-a-node"></a>
### Resizing a Node

The CPU and Memory requirements of each node can be increased or decreased as follows:
- CPU: ` "node": {"cpus": <CPU Value>}`
- Memory (in MB): `"node": {"mem": 4096}`

**Note:** Volume requirements (type and/or size) cannot be changed after initial deployment.

<a name="updating-placement-constraints"></a>
### Updating Placement Constraints

Placement constraints may be updated after initial deployment using the following procedure. See [Service Settings](#service-settings) above for more information on placement constraints.

Let's say we have the following deployment of our nodes

- Placement constraint of: `hostname:LIKE:10.0.10.3|10.0.10.8|10.0.10.26|10.0.10.28|10.0.10.84`
- Tasks:

```shell
10.0.10.3: minio-0
10.0.10.8: minio-1
10.0.10.26: minio-2
10.0.10.28: empty
10.0.10.84: empty
```


`10.0.10.8` is being decommissioned and we should move away from it. Steps:

    1. Remove the decommissioned IP and add a new IP to the placement rule whitelist by editing `placement_constraint`:1.69 KB


```shell
	hostname:LIKE:10.0.10.3|10.0.10.26|10.0.10.28|10.0.10.84|10.0.10.123
```
    2. Redeploy `_NODEPOD_-1` from the decommissioned node to somewhere within the new whitelist: `dcos minio pod replace _NODEPOD_-1`
    3. Wait for `_NODEPOD_-1` to be up and healthy before continuing with any other replacement operations.

The placement constraints can be modified by configuring the "placement constraint" section of the Config.json file:


```shell
	"placement_constraint": {
          "type": "string",
          "title": "Placement Constraint",
          "description": "Marathon-style placement constraint for nodes. Example: [[\"hostname\", \"UNIQUE\"]]",
          "default": "[[\"hostname\", \"UNIQUE\"]]",
          "media": {
            "type": "application/x-zone-constraints+json"
        }
```

<a name="restarting-a-node"></a>

## Replacing a Node

This operation will move a node to a new agent and will discard the persistent volumes at the prior system to be rebuilt at the new system. Perform this operation if a given system is about to be offlined or has already been offlined.

**Note:** Nodes are not moved automatically. You must perform the following steps manually to move nodes to new systems. You can automate node replacement according to your own preferences.

1. Run `dcos minio pod replace minio-<NUM>`, e.g. `minio-2` to halt the current instance with id `<NUM>` (if still running) and launch a new instance on a different agent.

For example, let's say `minio-2`'s host system has died and `minio-2` needs to be moved.

1. NOW THAT THE NODE HAS BEEN DECOMMISSIONED, (IF NEEDED BY YOUR SERVICE) start `minio-2` at a new location in the cluster.
    ```shell
    dcos minio pod replace minio-2
    ```

## Advanced update actions

The following sections describe advanced commands that be used to interact with an update in progress.

### Monitoring the update

Once the Scheduler has been restarted, it will begin a new deployment plan as individual pods are restarted with the new configuration.

You can query the status of the update as follows:

```shell
dcos minio update status
```

If the Scheduler is still restarting, DC/OS will not be able to route to it and this command will return an error message. Wait a short while and try again. You can also go to the Services tab of the DC/OS GUI to check the status of the restart.

### Pause

To pause an ongoing update, issue a pause command:

```shell
dcos minio update pause
```

You will receive an error message if the plan has already completed or has been paused. Once completed, the plan will enter the `WAITING` state.

### Resume

If a plan is in a `WAITING` state, as a result of being paused or reaching a breakpoint that requires manual operator verification, you can use the `resume` command to continue the plan:

```shell
dcos minio update resume
```

You will receive an error message if you attempt to `resume` a plan that is already in progress or has already completed.

### Force Complete

In order to manually "complete" a step (such that the Scheduler stops attempting to launch a task), you can issue a `force-complete` command. This will instruct to Scheduler to mark a specific step within a phase as complete. You need to specify both the phase and the step, for example:

```shell
dcos minio update force-complete service-phase service-0:[node]
```

### Force Restart

Similar to force complete, you can also force a restart. This can either be done for an entire plan, a phase, or just for a specific step.

To restart the entire plan:
```shell
dcos minio update force-restart
```

Or for all steps in a single phase:
```shell
dcos minio update force-restart service-phase
```

Or for a specific step within a specific phase:
```shell
dcos minio update force-restart service-phase service-0:[node]
```

