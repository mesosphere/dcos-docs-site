---
layout: layout.pug
navigationTitle: 
title: Managing
menuWeight: 60
excerpt:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


<a name="updating-configuration"></a>
# Updating Configuration
You can make changes to the service after it has been launched. Configuration management is handled by the scheduler process, which in turn handles deploying DC/OS Apache ZooKeeper itself.

Edit the runtime environment of the scheduler to make configuration changes. After making a change, the scheduler will be restarted and automatically deploy any detected changes to the service, one node at a time. For example, a given change will first be applied to `zookeeper-0-server`, then `zookeeper-1-server`, and so on.

Nodes are configured with a "readiness check" to ensure that the underlying service appears to be in a healthy state before continuing with applying a given change to the next node in the sequence. In this case, the "readiness check" checks if the node has successfully joined quorum. However, this basic check is not foolproof and reasonable care should be taken to ensure that a given configuration change will not negatively affect the behavior of the service.

Some changes, such as decreasing the number of nodes or changing volume requirements, are not supported after initial deployment. See [Limitations](/services/kafka-zookeeper/2.1.2-3.4.11/limitations).

To make configuration changes via scheduler environment updates, perform the following steps (documented in full [here](/1.11/deploying-services/config-universe-service/):

1. In the DC/OS GUI, go to your service, then click the **Configuration** tab to view the service configuration.
2. With your favorite text editor, create a file named 'options.json'.
3. In the first level of the JSON object, list the type of configuration from the tab it is from (`service`, `node`, or `zookeeper`).
4. In the next level of the JSON object, list the configuration and the new value you would like in key:value format.
5. Save your file.
6. Run this following command from the DC/OS CLI.

```
dcos beta-kafka-zookeeper update start --options=options.json
```

7. To check the status of the update, run:

```
dcos beta-kafka-zookeeper update status
```

A sample valid `options.json` looks like:
```json
{
    "node": {
        "cpu": 1.5
    },
    "zookeeper": {
      "maxClientCnxns": 250,
      "minSessionTimeout": 5000
    }
}
```

Passing in this file after deployment would increase each node CPU value from the default value of 1.0, and change the ZooKeeper-specific values `maxClientCnxns` and `minSessionTimeout` as well.  

***IMPORTANT***: Reconfiguration changes to node count, service name, ZooKeeper ticktime, and all ZooKeeper-specific port values (client port, follower port, and leader election port) will be blocked. These are blocked for the safety of the service. Please exercise caution when performing reconfigurations, as many configurations are unsafe to change after deployment. Reconfigurations can cause unpredictable behavior and should only be done to debug or increase service performance.

<a name="adding-a-node"></a>
## Adding a Node
You cannot change the size of your ZooKeeper instance after deployment.

<a name="resizing-a-node"></a>
## Resizing a Node
The CPU and memory requirements of each node can be increased or decreased as follows:
- CPU (1.0 = 1 core): `NODE_CPUS`.
- Memory (in MB): `NODE_MEM`.

**Note:** Volume requirements (type and/or size) cannot be changed after initial deployment.

<a name="updating-placement-constraints"></a>
## Updating Placement Constraints

Placement constraints can be updated after initial deployment using the following procedure. See [Node Settings](/services/kafka-zookeeper/2.1.2-3.4.11/service-settings/) above for more information on placement constraints.

Let's say we have the following deployment of our nodes:

- Placement constraint of: `[["hostname", "LIKE", "10.0.10.3|10.0.10.8|10.0.10.26|10.0.10.28|10.0.10.84"]]`.
- Tasks:
```
10.0.10.3: zookeeper-0-server
10.0.10.8: zookeeper-1-server
10.0.10.26: zookeeper-2-server
10.0.10.28: empty
10.0.10.84: empty
```

`10.0.10.8` is being decommissioned and we should move away from it. Steps:

1. Remove the decommissioned IP and add a new IP to the placement rule whitelist by editing `NODE_PLACEMENT`:

	```
	[["hostname", "LIKE", "10.0.10.3|10.0.10.26|10.0.10.28|10.0.10.84|10.0.10.123"]]
	```
2. Redeploy `zookeeper-1-server` from the decommissioned node to somewhere within the new whitelist: `dcos beta-kafka-zookeeper pods replace zookeeper-1`.
3. Wait for `zookeeper-1-server` to be up and healthy before continuing with any other replacement operations.

<a name="restarting-a-node"></a>
## Restarting a Node

This operation will restart a node while keeping it at its current location and with its current persistent volume data. This may be thought of as similar to restarting a system process, but it also deletes any data that is not on a persistent volume.

1. Run `dcos beta-kafka-zookeeper pods restart zookeeper-<NUM>`, e.g. `zookeeper-2`.

<a name="replacing-a-node"></a>
## Replacing a Node

This operation will move a node to a new system and will discard the persistent volumes at the prior system to be rebuilt at the new system. Perform this operation if a given system is about to be offlined or has already been offlined.

**Note:** Nodes are not moved automatically. You must perform the following steps manually to move nodes to new systems. You can build your own automation to perform node replacement automatically according to your own preferences.

1. Back up ZooKeeper log and directory files in case of cluster outage.
2. Run `dcos beta-kafka-zookeeper pods replace zookeeper-<NUM>` to halt the current instance (if still running) and launch a new instance elsewhere.
3. Restore log and directory files if necessary.
