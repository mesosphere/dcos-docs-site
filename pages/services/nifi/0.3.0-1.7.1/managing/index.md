---
layout: layout.pug
navigationTitle:  Operations
title: Operations
menuWeight: 35
excerpt: Managing your DC/OS NiFi service
featureMaturity:
enterprise: false
model: ../../data.yml
render: mustache
---
This section describes various operations tasks you may need. DC/OS {{ model.techName }} allows you to 
- Update your configuration after launch
- Update your placement constraints
- Add, replace, restart or resize a node
- Back up your application
- Use the DC/OS {{ model.techName }} Administration Toolkit
- User metrics to troubleshoot your nodes

# Updating Configuration

You can make changes to the service after it has been launched. Configuration management is handled by the scheduler process, which in turn handles DC/OS {{model.techName }} deployment itself.

After making a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `{{ model.serviceName }}-0`, then `{{ model.serviceName }}-1`, and so on.

Nodes are configured with a "Readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment. See [Limitations](../limitations/index.md).


The instructions below describe how to update the configuration for a running DC/OS service.

### Enterprise DC/OS 1.10 and later

Enterprise DC/OS 1.10 introduces a convenient command line option that allows for easier updates to a service's configuration, as well as allowing users to inspect the status of an update, to pause and resume updates, and to restart or complete steps if necessary.

#### Prerequisites

- Enterprise DC/OS 1.10 or later.
- Service with 1.5.0 version.
- [The DC/OS CLI](/latest/cli/install/) installed and available.
- The service's subcommand available and installed on your local machine.
  - You can install just the subcommand CLI by running 
    ```shell
    dcos package install --cli --yes {{ model.serviceName }}
    ```
  - If you are running an older version of the subcommand CLI that doesn't have the `update` command, uninstall and reinstall your CLI.
    ```shell
    dcos package uninstall --cli {{ model.serviceName }}
    dcos package install --cli {{ model.serviceName }}
    ```

#### Preparing configuration

If you installed this service with Enterprise DC/OS 1.10 or later, you can fetch the full configuration of a service (including any default values that were applied during installation). For example:

```shell
dcos {{ model.serviceName }} describe > options.json
```

Make any configuration changes to the `options.json` file.

If you installed this service with a prior version of DC/OS, this configuration will not have been persisted by the the DC/OS package manager. You can instead use the `options.json` file that was used when [installing the service](https://github.com/mesosphere/dcos-{{ model.serviceName }}/blob/ServiceGuide/docs/install.md).

<p class="message--note"><strong>NOTE: </strong> You need to specify all configuration values in the <tt>options.json</tt> file when performing a configuration update. Any unspecified values will be reverted to the default values specified by the DC/OS service. See the "Recreating <tt>options.json</tt>" section below for information on recovering these values.</p>

#### Recreating `options.json` (optional)

If the `options.json` from the last service installation or update is not available, you will need to manually recreate it using the following steps.

First, we'll fetch the default application's environment, current application's environment, and the actual {{ model.serviceName }} that maps config values to the environment:

1. Ensure you have [jq](https://stedolan.github.io/jq/) installed.
1. Set the service name that you're using, for example:
	```shell
	SERVICE_NAME={{ model.serviceName }}
	```
1. Get the version of the package that is currently installed:
	```shell
	PACKAGE_VERSION=$(dcos package list | grep $SERVICE_NAME | awk '{print $2}')
	```
1. Then fetch and save the environment variables that have been set for the service:
	```shell
	dcos marathon app show $SERVICE_NAME | jq .env > current_env.json
	```
1. To identify customized values, we'll get the default environment variables for this version of the service:
	```shell
	dcos package describe --package-version=$PACKAGE_VERSION --render --app $SERVICE_NAME | jq .env > default_env.json
	```
1. We'll also get the entire application {{ model.serviceName }}:
	```shell
	dcos package describe $SERVICE_NAME --app > marathon.json.mustache
	```

Now that you have these files, we'll attempt to recreate the `options.json`.

1. Use JQ and `diff` to compare the two:
	```shell
	diff <(jq -S . default_env.json) <(jq -S . current_env.json)
	```
1. Now compare these values to the values contained in the `env` section in application {{ model.serviceName }}:
	```shell
	less marathon.json.mustache
	```
1. Use the variable names (e.g. `{{service.name}}`) to create a new `options.json` file as described in [Initial service configuration](#initial-service-configuration).

#### Starting the update

When you are ready to begin, initiate an update using the DC/OS CLI, passing in the updated `options.json` file:

```shell
dcos {{ model.serviceName }} update start --options=options.json
```

You will receive an acknowledgement message and the DC/OS package manager will restart the Scheduler in Marathon.

See [Advanced update actions](#advanced-update-actions) for commands you can use to inspect and manipulate an update after it has started.

To see a full listing of available options, run 
```shell
dcos package describe --config {{ model.serviceName }}
```
in the CLI, or browse the DC/OS {{ model.serviceName }} Service install dialog in the DC/OS Dashboard.

<a name="updating-placement-constraints"></a>

# Updating Placement Constraints

Placement constraints may be updated after initial deployment using the following procedure. See [Service Settings](#service-settings) above for more information on placement constraints.

Let's say we have the following deployment of our nodes

- Placement constraint of: `hostname:LIKE:10.0.10.3|10.0.10.8|10.0.10.26|10.0.10.28|10.0.10.84`
- Tasks:

    ```shell
    10.0.10.3: {{ model.serviceName }}-0
    10.0.10.8: {{ model.serviceName }}-1
    10.0.10.26: {{ model.serviceName }}-2
    10.0.10.28: empty
    10.0.10.84: empty
    ```


`10.0.10.8` is being decommissioned and we should move away from it. 

1. Remove the decommissioned IP and add a new IP to the placement rule whitelist by editing `placement_constraint`:

    ```shell
    hostname:LIKE:10.0.10.3|10.0.10.26|10.0.10.28|10.0.10.84|10.0.10.123
    ```
1. Redeploy `_NODEPOD_-1` from the decommissioned node to somewhere within the new whitelist: 
    ```shell
    dcos {{ model.serviceName }} pod replace _NODEPOD_-1
    ```
1. Wait for `_NODEPOD_-1` to be up and healthy before continuing with any other replacement operations.

The placement constraints can be modified by configuring the "placement constraint" section of the config.json file:


```json
"placement_constraint": {
        "type": "string",
        "title": "Placement Constraint",
        "description": "Marathon-style placement constraint for nodes. Example: [[\"hostname\", \"UNIQUE\"]]",
        "default": "[[\"hostname\", \"UNIQUE\"]]",
        "media": {
        "type": "application/x-zone-constraints+json"
    }
```



# Managing nodes

<a name="adding-a-node"></a>


### Adding a Node

The service deploys two nodes by default. You can customize this value at initial deployment or after the cluster is already running. Shrinking the cluster is not supported.

Modify the COUNT `"node":{"count":3}` environment variable to update the node count. If you decrease this value, the scheduler will prevent the configuration change until it is reverted back to its original value or larger.

<a name="resizing-a-node"></a>

### Resizing a Node

The CPU and memory requirements of each node can be increased or decreased as follows:
- CPU: 
```shell
"node":{
   "cpus":<CPU Value>
}
```
- Memory (in MB): 
```shell
"node":{
   "mem":4096
}
```

<p class="message--note"><strong>NOTE: </strong>Volume requirements (type and/or size) cannot be changed after initial deployment.</p>


<a name="restarting-a-node"></a>

## Restarting a Node

This operation will restart a node, while keeping it at its current location and with its current persistent volume data. This may be thought of as similar to restarting a system process, but it also deletes any data that is not on a persistent volume.

Run 
```shell
dcos {{ model.serviceName }} pod restart {{ model.serviceName }}-<NUM>`, e.g. `{{ model.serviceName }}_-2
```

<a name="replacing-a-node"></a>

## Replacing a Node

<p class="message--note"><strong>NOTE: </strong>Nodes are not moved automatically. You must perform the following steps manually to move nodes to new systems. You can automate node replacement according to your own preferences.</p>

This operation will move a node to a new agent and will discard the persistent volumes at the prior system to be rebuilt at the new system. Perform this operation if a given system is about to be offlined or has already been offlined.

1. Run `dcos {{ model.serviceName }} pod replace {{ model.serviceName }}-<NUM>`, e.g. `{{ model.serviceName }}_-2` to halt the current instance with id `<NUM>` (if still running) and launch a new instance on a different agent. For example, let's say `{{ model.serviceName }}-2`'s host system has died and `{{ model.serviceName }}-2` needs to be moved.

1. Now that the node has been decommissioned (if needed by your service) start `{{ model.serviceName }}-2` at a new location in the cluster.
    ```shell
    dcos {{ model.serviceName }} pod replace {{ model.serviceName }}-2
    ```

# Advanced update actions

The following sections describe advanced commands that be used to interact with an update in progress.

## Monitoring the update

Once the Scheduler has been restarted, it will begin a new deployment plan as individual pods are restarted with the new configuration.

You can query the status of the update as follows:

```shell
dcos {{ model.serviceName }} update status
```

If the Scheduler is still restarting, DC/OS will not be able to route to it and this command will return an error message. Wait a short while and try again. You can also go to the Services tab of the DC/OS web interface to check the status of the restart.

### Pause

To pause an ongoing update, issue a `pause` command:

```shell
dcos {{ model.serviceName }} update pause
```

You will receive an error message if the plan has already completed or has been paused. Once completed, the plan will enter the WAITING state.

### Resume

If a plan is in a WAITING state, as a result of being paused or reaching a breakpoint that requires manual operator verification, you can use the `resume` command to continue the plan:

```shell
dcos {{ model.serviceName }} update resume
```

You will receive an error message if you attempt to resume a plan that is already in progress or has already completed.

### Force-Complete

In order to manually "complete" a step (such that the Scheduler stops attempting to launch a task), you can issue a `force-complete` command. This will instruct to Scheduler to mark a specific step within a phase as complete. You need to specify both the phase and the step, for example:

```shell
dcos {{ model.serviceName }} update force-complete service-phase service-0:[node]
```

### Force-Restart

Similarly to `force-complete`, you can also force a restart. This can either be done for an entire plan, a phase, or just for a specific step.

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
# Disaster recovery 

## Backing up

The DC/OS {{model.techName }} framework allows you to back up your DC/OS {{model.techName }} application to Amazon S3. The following information/values are required for backup.

1. AWS_ACCESS_KEY_ID
1. AWS_SECRET_ACCESS_KEY
1. AWS_REGION
1. S3_BUCKET_NAME

To enable backup, trigger the backup-S3 plan with the following plan parameters:
```shell
{
 'AWS_ACCESS_KEY_ID': key_id,
 'AWS_SECRET_ACCESS_KEY': aws_secret_access_key,
 'AWS_REGION': 'us-east-1',
 'S3_BUCKET_NAME': bucket_name
}
```
This plan can be executed with the following command:
```shell
{
 dcos {{ model.serviceName }} --name=<service_name> plan start <plan_name> -p <plan_parameters>
}
```
or with a command, including plan parameters itself:
```shell
{
 dcos {{ model.serviceName }} --name=<SERVICE_NAME> plan start backup-s3 \
  -p AWS_ACCESS_KEY_ID=<ACCESS_KEY> \
  -p AWS_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY> \
  -p AWS_REGION=<REGION> \
  -p S3_BUCKET_NAME=<BUCKET_NAME>
}
```

<!-- However, the backup can also be started with the following command: -->



Once this plan execution is completed, the backup will be uploaded to S3.
The DC/OS {{model.techName }} backup is taken using the DC/OS {{model.techName }} toolkit. The DC/OS {{model.techName }} backup will be done using three sidecar tasks:

1. **Backup** - Back up to local node (ROOT/MOUNT). The Backup task is responsible for backing up the local application to the local node, which may be on the ROOT or Mount Volume.

    [<img src="../img/Backup.png" alt="backup" width="800"/>](../img/Backup.png)

    Figure 1. Backing up to local node


1. **Upload_to_S3** - Upload the backup from the local node to S3. This sidecar task takes the backup created in Step 1, from the ROOT/Mount volume, and uploads it to Amazon S3 in the Bucket Name specified.

    [<img src="../img/S3Upload.png" alt="S3Upload.png" width="800"/>](../img/S3Upload.png) 

    Figure 2. S3 upload      

1. **Cleanup** - Remove the backup from local node. When Step 2 is complete and the backup has been uploaded to S3, a sidecar task known as Cleanup is triggered. This task cleans up/removes the backup folder from the local Root/Mount volumes.

    [<img src="../img/Cleanup.png" alt="cleanup" width="800"/>](../img/Cleanup.png)

    Figure 3. Cleanup service

<!-- How does a user restore the service? -->

# DC/OS {{model.techName }} Toolkit Commands


The Admin Toolkit contains command line utilities for administrators to support DC/OS {{model.techName }} maintenance in standalone and clustered environments. These utilities include:

- **Notify** — The notification tool allows administrators to send bulletins to the DC/OS {{model.techName }} UI using the command line.
- **Node Manager** — The node manager tool allows administrators to perform a status check on a node as well as to connect, disconnect, or remove nodes that are part of a cluster.
- **File Manager** — The file manager tool allows administrators to backup, install or restore a DC/OS {{model.techName }} installation from backup.

The Administration Toolkit is bundled with the `{{ model.serviceName }}-toolkit` and can be executed with scripts found in the `bin` folder. Further documentation is available at [DC/OS {{model.techName }} Administration Toolkit](https://{{ model.serviceName }}.apache.org/docs/{{ model.serviceName }}-docs/html/administration-guide.html#admin-toolkit).

To execute the DC/OS {{model.techName }} Administration Toolkit commands, run  a `dcos task exec` command to a DC/OS {{model.techName }} node. 

1. Set the JAVA_HOME using the command:
    ```shell
    export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH
    ````
1. Run the node manager commands from the `$MESOS_SANDBOX/{{ model.serviceName }}-toolkit-1.5.0/bin` directory:

    To connect, disconnect, or remove a node from a cluster:
    ```shell
    node-manager.sh -d <NIFI_HOME> –b <{{ model.serviceName }} bootstrap file path>
    -o {remove|disconnect|connect|status} [-u {url list}] [-p {proxy name}] [-v]
    ```
    To show help:
    ```
    node-manager.sh -h
    ```
    The following are available options:
    ```shell
    -b,--bootstrapConf <arg> Existing Bootstrap Configuration file (required)

    -d,--{{ model.serviceName }}InstallDir <arg> {{ model.serviceName }} Root Folder (required)

    -h,--help Help Text (optional)

    -o, --operation <arg> Operations supported: status, connect (cluster), disconnect (cluster), remove (cluster)

    -p,--proxyDN <arg> Proxy or User DN (required for secured nodes doing connect, disconnect and remove operations)

    -u,--clusterUrls <arg> Comma delimited list of active urls for cluster (optional). Not required for disconnecting a node yet will be needed when connecting or removing from a cluster

    -v,--verbose Verbose messaging (optional)
    ```

**Example**

To check for `dcos` tasks:

```shell
>> dcos task

NAME            HOST         USER   STATE  ID                                                    MESOS ID                                 
{{ model.serviceName }}            10.0.0.196   root     R    {{ model.serviceName }}.9b11498f-415f-11e8-81a4-e25c6192ea05             1d166af3-8666-4f3e-8add-dcaad139c900-S3  
{{ model.serviceName }}-0-metrics  10.0.0.199  nobody    R    {{ model.serviceName }}-0-metrics__958e2af9-c7d0-4cb9-b1fc-08c810b05254  1d166af3-8666-4f3e-8add-dcaad139c900-S1  
{{ model.serviceName }}-0-node     10.0.0.199  nobody    R    {{ model.serviceName }}-0-node__68c0d8a0-4c36-4a86-a287-5dc67ce19fde     1d166af3-8666-4f3e-8add-dcaad139c900-S1  
{{ model.serviceName }}-1-metrics  10.0.0.58   nobody    R    {{ model.serviceName }}-1-metrics__e58b8f2d-e19f-48f7-b154-6d11e65c54a9  1d166af3-8666-4f3e-8add-dcaad139c900-S5  
{{ model.serviceName }}-1-node     10.0.0.58   nobody    R    {{ model.serviceName }}-1-node__1a3d71c6-3c23-4a96-bba3-859de2c0615d     1d166af3-8666-4f3e-8add-dcaad139c900-S5
```
To enter into a `dcos` node

```shell
dcos task exec -ti {{ model.serviceName }}-0-node__68c0d8a0-4c36-4a86-a287-5dc67ce19fde bash
```

To set the Java Path

```shell
export JAVA_HOME=$(ls -d $MESOS_SANDBOX/jdk*/jre*/) && export JAVA_HOME=${JAVA_HOME%/} && export PATH=$(ls -d $JAVA_HOME/bin):$PATH
```
To check for Java Home, run the following command:
```shell
echo $JAVA_HOME
```
This returns the Java home path:
```shell
/var/lib/mesos/slave/slaves/1d166af3-8666-4f3e-8add-dcaad139c900-S1/frameworks/1d166af3-8666-4f3e-8add-dcaad139c900-0003/executors/{{ model.serviceName }}__78b829b7-3963-4083-b33b-4147fcab559f/runs/fb826e37-17e6-4349-b7c4-63060b51ff0a/containers/8bd354e5-a2a6-4185-9454-647b98b9b327/jdk1.8.0_162/jre
```
**Example of Backup Command through Toolkit**
```shell
 sh $MESOS_SANDBOX/{{ model.serviceName }}-toolkit-${NIFI_VERSION}/bin/file-manager.sh -o backup -b {{ model.serviceName }}-backup -c $MESOS_SANDBOX/../../tasks/{{ model.serviceName }}-$POD_INSTANCE_INDEX-node*/{{ model.serviceName }}-{{NIFI_VERSION}} -v;
```

# Metrics

To check the metrics for the DC/OS {{model.techName }} instances on individual agent nodes, we need to do the following:

1. In the first step we need to obtain the `dcos auth` token by issuing the following command:
    ```shell
        dcos config show core.dcos_acs_token
    ````
    Keep a copy of this token for later use.

1. In the next step we need to ssh into the private agent on which we have the tasks running:
    ```shell
        dcos node ssh --master-proxy --mesos-id=<agent-mesos-id>
    ````  
1. Finally we need to make the following curl requests as per the security settings:

    **TLS and KDC Mode:**

    ```shell
    curl -k -H "Authorization: token=<acs_token>" https://localhost:61002/system/v1/metrics/v0/containers | jq
    ````
    **Non TLS and KDC Mode:**

    ```shell
    curl -k -H "Authorization: token=<acs_token>" http://localhost:61001/system/v1/metrics/v0/containers | jq
    ````  
More details about Metrics can be found [here](/latest/metrics/quickstart/).
