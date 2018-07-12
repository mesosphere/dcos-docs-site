---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 80
excerpt: Managing your DC/OS Minio Service configuration
featureMaturity:
enterprise: false
---


# Updating Configuration

You can make changes to the DC/OS Minio Service after it has been launched. Configuration management is handled by the Scheduler process, which in turn handles Minio deployment itself.

After you make a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `minio-0`, then `minio-1`, and so on.

Nodes are configured with a "Readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment. See [Limitations](../limitations/index.md).

The instructions below describe how to update the configuration for a running DC/OS Minio Service.

### Enterprise DC/OS 1.10

Enterprise DC/OS 1.10 introduces a convenient command line option that allows for easier updates to a service's configuration, as well as allowing users to inspect the status of an update, to pause and resume updates, and to restart or complete steps if necessary.

#### Prerequisites

+ Enterprise DC/OS 1.10 or later.
+ Service with 1.5.0 version.
+ [The DC/OS CLI](https://docs.mesosphere.com/latest/cli/install/) installed and available.
+ The service's subcommand available and installed on your local machine.
  + You can install just the subcommand CLI by running `dcos package install --cli --yes minio`.
  + If you are running an earlier version of the subcommand CLI that does not have the `update` command, uninstall it and reinstall your CLI, using these commands:

    ```shell
    dcos package uninstall --cli minio
    dcos package install --cli minio
     ```
#### Preparing configuration

If you installed DC/OS Minio Service with Enterprise DC/OS 1.10, you can fetch the full configuration of a service (including any default values that were applied during installation). For example:

```shell
dcos minio describe > options.json
```
Make any configuration changes to the `options.json` file.

If you installed DC/OS Minio Service with an earlier version of DC/OS, this configuration will not have been persisted by the the DC/OS package manager. You can instead use the `options.json` file that was used when [installing the service](https://github.com/Mohini6649/dcos-docs-site/blob/minio-service-guide/pages/services/minio/0.1.0-25/install/index.md).

**Caution:** You must specify all configuration values in the `options.json` file when performing a configuration update. Any unspecified values revert to the default values specified by the DC/OS Minio Service. See the "Recreating `options.json`" section below for information on recovering these values.

##### Recreating `options.json` (optional)

If the `options.json` file from the last service installation or update is not available, you must manually recreate it using the following steps.

First, you will fetch the default application's environment, current application's environment, and the actual minio that maps config values to the environment:

1. Ensure you have `[jq](https://stedolan.github.io/jq/)` installed.
2. Set the service name that you're using, for example:
	```shell
	SERVICE_NAME=minio
	```
3. Get the version of the package that is currently installed:
	```shell
	PACKAGE_VERSION=$(dcos package list | grep $SERVICE_NAME | awk '{print $2}')
	```
4. Fetch and save the environment variables that have been set for the service:
	```shell
	dcos marathon app show $SERVICE_NAME | jq .env > current_env.json
	```
5. To identify those values that are custom, get the default environment variables for this version of the service:
	```shell
	dcos package describe --package-version=$PACKAGE_VERSION --render --app $SERVICE_NAME | jq .env > default_env.json
	```
6. Get the entire application `minio`:
	```shell
	dcos package describe $SERVICE_NAME --app > marathon.json.mustache
	```
Now that you have these files, you can recreate the `options.json`.

1. Use JQ and `diff` to compare the two files:
	```shell
	diff <(jq -S . default_env.json) <(jq -S . current_env.json)
	```
2. Compare these values to the values contained in the `env` section in application `minio`:
	```shell
	less marathon.json.mustache
	```
3. Use the variable names (e.g. `{{service.name}}`) to create a new `options.json` file as described in [Initial service configuration](#initial-service-configuration).

#### Starting the update

To begin, initiate an update using the DC/OS CLI, passing in the updated `options.json` file:

```shell
dcos minio update start --options=options.json
```
You will receive an acknowledgement message. The DC/OS package manager will restart the Scheduler in Marathon.

See [Advanced update actions](#advanced-update-actions) for commands you can use to inspect and manipulate an update after it has started.

To see a full listing of available options, run `dcos package describe --config minio` in the CLI, or browse the DC/OS Minio Service install dialog in the DC/OS Dashboard.

<a name="resizing-a-node"></a>
### Resizing a node

The CPU and Memory requirements of each node can be increased or decreased as follows:
- CPU: ` "node": {"cpus": <CPU Value>}`
- Memory (in MB): `"node": {"mem": 4096}`

**Caution:** Volume requirements (type and/or size) cannot be changed after initial deployment.
