---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


## Updating Configuration
You may deploy changes to the DSE service after it has been launched. Configuration management is handled by the Scheduler process, which in turn handles deploying DSE.

Configuration changes may be performed by editing the runtime environment of the Scheduler. After making a change, the scheduler will be restarted, and it will automatically deploy any detected changes to the DSE service, one node at a time. For example a change affecting DSE Nodes will first be applied to `dse-0`, then `dse-1`, and so on.

The DSE Node tasks are configured with a "Readiness check" to ensure that Cassandra enters an "Up, Normal" state before continuing with applying a given change to the next node in the sequence. However this basic check is not foolproof and reasonable care should be taken to ensure that a given change will not negatively affect the behavior of the service.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment.

To make configuration changes via scheduler environment updates, perform the following steps:
1. Visit http://yourcluster.com/ to view the DC/OS Dashboard.
1. Navigate to `Services` and click on the service to be configured (default `dse`).
1. Click `Edit` in the upper right. On DC/OS 1.9.x, the `Edit` button is obscured behind three dots.
1. Navigate to `Environment` (or `Environment variables`) and search for the option to be updated.
1. Update the option value and click `Review and run` (or `Deploy changes`).
1. The Scheduler process will be restarted with the new configuration, and will validate any detected changes.
1. If the detected changes pass validation, the relaunched Scheduler will deploy the changes by sequentially relaunching affected tasks as described above.

### Adding a Node
DC/OS deploys 3 DSE nodes by default. This may be customized at initial deployment or after the cluster is already running. Shrinking the cluster is not supported.

Modify the `DSE_NODE_POD_COUNT` environment variable to update the node count. Shrinking the cluster after initial deployment is not supported. If you decrease this value, the scheduler will complain about the configuration change until it's reverted back to its original value or larger.

### Resizing a Node
The CPU and Memory requirements of each DSE Node may be increased or decreased as follows:
- CPU (1.0 = 1 core): `DSE_NODE_CPUS`
- Memory (in MB): `DSE_NODE_MEM` and `DSE_NODE_HEAP`. As a rule of thumb, `heap` should be half of `mem`.

Note that volume requirements (type and/or size) may not be changed after initial deployment.

### Adjusting dse.yaml or cassandra.yaml settings
Nearly all settings for `dse.yaml` and `cassandra.yaml` are exposed as configuration options, allowing them to be deployed and updated automatically by the service.

These options are generally exposed as environment variables in the scheduler environment with names that match their names in the config files. As some arbitrary examples, `cassandra.yaml`'s `max_value_size_in_mb` is exposed as an environment variable named `MAX_VALUE_SIZE_IN_MB`, and `dse.yaml`'s `max_solr_concurrency_per_core` is exposed as `MAX_SOLR_CONCURRENCY_PER_CORE`.

However not all `dse.yaml` and `cassandra.yaml` settings are customizable. To see a full listing of available options, run `dcos package describe --config dse` in the CLI and scroll to the **dse** and **cassandra** sections in the JSON output, or browse the **dse** and **cassandra** sections of the DSE install customization dialog in the DC/OS Dashboard.

For more information on each setting, view Datastax's documentation for [dse.yaml](https://docs.datastax.com/en/latest-dse/datastax_enterprise/config/configDseYaml.html) and [cassandra.yaml](https://docs.datastax.com/en/cassandra/3.0/cassandra/configuration/configCassandra_yaml.html).

### Updating Placement Constraints
Placement constraints may be updated after initial deployment using the following procedure. See [Service Settings](#service-settings) above for more information on placement constraints.

Let's say we have the following deployment of our DSE nodes:

- DSE Node placement constraint of: `hostname:LIKE:10.0.10.3|10.0.10.8|10.0.10.26|10.0.10.28|10.0.10.84`
- Tasks:
```
10.0.10.3: dse-0
10.0.10.8: dse-1
10.0.10.26: dse-2
10.0.10.28: empty
10.0.10.84: empty
```

Given the above configuration, let's assume `10.0.10.8` is being decommissioned and we should move away from it. Steps:

1. Remove the decommissioned IP and add a new IP to the placement rule whitelist, by configuring the Scheduler environment with a new `DSE_NODE_PLACEMENT` setting:
   ```
   hostname:LIKE:10.0.10.3|10.0.10.26|10.0.10.28|10.0.10.84|10.0.10.123
   ```
1. Wait for the Scheduler to restart with the new placement constraint setting.
1. Trigger a redeployment of `dse-1` from the decommissioned node to a new machine within the new whitelist:
    - run `nodetool removenode <dse-1's cassandra instance id>` if the DSE node is already offline, or run `nodetool decommission` if the DSE node is still online
    - `dcos dse node replace dse-1`
1. Wait for `dse-1` to be up and healthy before continuing with any other replacement operations.

The placement constraints for each task type may be changed via the following environment variables. **Tip:** Refer to the steps above to perform this reconfiguration correctly:
- DSE Nodes (as a group): `DSE_NODE_PLACEMENT`.
- OpsCenter (if built-in instance is enabled): `OPSCENTER_PLACEMENT`.
- Studio (if enabled): `STUDIO_PLACEMENT`.

### Updating enabled DSE features
DSE Search, Analytics, and Graph are enabled by default, but you can disable any or all of them by modifying the default configuration.

Enable or disable components by setting the following environment variables to either `true` or `false`. The configuration change will then be rolled out sequentially to the DSE nodes.

Go to the DSE service view of the DC/OS UI. Click the menu in the upper right and then choose **Edit**. Go to the **Environment** tab to modify the following environment variables.

- `DSE_ANALYTICS_ENABLED` = `true` or `false`
- `DSE_GRAPH_ENABLED` = `true` or `false`
- `DSE_SEARCH_ENABLED` = `true` or `false`

### Using an external or internal OpsCenter
The DSE DC/OS service may be configured to either launch its own OpsCenter dashboard (default), or to point to an external OpsCenter instance.

Follow these steps to configure an external OpsCenter after installation:

1. Set `OPSCENTER_HOSTNAME` to the desired opscenter instance. For example, if you wish for this service to use another service's OpsCenter, this may be set to `opscenter-0-node.<other-service-name>.mesos`.
1. Remove the `OPSCENTER_ENABLED` environment variable. This disables the built-in opscenter instance in favor of the external instance.

Conversely, if you wish to switch from an external OpsCenter to using a built-in OpsCenter, you may reverse the above steps:

1. Remove `OPSCENTER_HOSTNAME`.
1. Add an `OPSCENTER_ENABLED` option set to `DEFINITELY`.

## Restarting a Node
This operation will restart the DSE+Agent processes, while keeping them at their current location and with their current persistent volumes. This may be thought of as similar to restarting a system process.

1. Run `dcos dse pods restart dse-<NUM>`, e.g. `dse-2`.

## Replacing a Node
This operation will move a DSE+Agent container to a new system, and will discard the persistent volumes at the prior system to be rebuilt at the new system. Perform this operation if a given system is about to be offlined or has already been offlined. Note that nodes are not moved automatically, and you must manually perform the following steps to move nodes to a new system. Alternately automation may be built to perform this operation automatically according to your own preferences.

1. Perform one of the following:
    - Invoke `nodetool decommision` against the old node to be replaced if the DSE node is still online.
    - Invoke `nodetool removenode <DSE instance id>` against the old node to be replaced if the DSE node is already offline.
1. Run `dcos dse pods replace dse-#` to halt the current instance (if still running) and launch a new instance elsewhere.

For example, let's say `dse-3`'s host system has died and `dse-3` needs to be moved.

1. Determine the IP that `dse-3` was running on.
	```
	`dcos task --completed`
	```
	Let's assume `dse-3` was running on `192.168.0.123`.
1. Pick a running DSE node to run `nodetool` commands against. Lets pick `dse-0`.
    1. Run the following command on the node you chose to get a list of Cassandra IDs and their IPs.

		```
		/dse-5.0.7/bin/nodetool status
		```

    1. Search for `dse-3`'s IP in the list, then determine the DSE Instance ID for that IP.
    1. For the DSE Instance ID you found, run the following command to remove that node entry from the DSE Cluster.

		```
		`/dse-5.0.7/bin/nodetool removenode <instance id>`
		```

1. Now that the node has been removed from Cassandra, start `dse-3` at a new location in the cluster.
	```
	dcos dse pods replace dse-3
	```

### Restarting OpsCenter
The OpsCenter task may also be restarted in-place:

1. Run `dcos dse pods restart opscenter-0`.

### Replacing OpsCenter
The OpsCenter task may also be moved to a new system if the current one has failed or is scheduled to be turned down:

1. Run `dcos dse pods replace opscenter-0`.
1. Run `dcos dse plan restart deploy opscenter-phase opscenter-0:[configure]`.
