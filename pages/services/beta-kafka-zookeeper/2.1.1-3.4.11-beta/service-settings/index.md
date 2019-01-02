---
layout: layout.pug
navigationTitle: 
title: Service Settings
menuWeight: 27
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


Adjust the following settings to customize the amount of resources allocated to each node. DC/OS Apache ZooKeeper's [system requirements](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_systemReq) must be taken into consideration when adjusting these values. Reducing these values below those requirements may result in adverse performance and/or failures while using the service.

<!-- Each of the following settings can be customized under the **node** configuration section. -->

Adjust each of these settings by entering the appropriate JSON into an `options.json` file. Then, update the service with the following command.

```
dcos kafka --name=/kafka update start --options=options.json
```

<a name="node-count"></a>
# Node Count

<!--
Customize the `Node Count` setting (default 3) under the **node** configuration section. You may only have Node Count value of 3 or 5.
-->

Customize the Node Count setting (default 3) by modifying the following JSON. You may only have Node Count value of 3 or 5.

```json
{
  "node": {
    "count": 3
  }
}
```


<a name="cpu"></a>
# CPU

You can customize the amount of CPU allocated to each node. A value of `1.0` equates to one full CPU core on a machine.

<!-- Change this value by editing the **cpus** value under the **node** configuration section. Turning this too low will result in throttled tasks. -->

Change this value by modifying the following JSON. Turning this too low will result in throttled tasks.

```json
{
  "node": {
    "cpus": 1
  }
}
```

<a name="memory"></a>
# Memory

You can customize the amount of RAM allocated to each node. <!-- Change this value by editing the **mem** value (in MB) under the **node** configuration section.--> Turning this too low will result in out-of-memory errors.

Change this value by modifying the following JSON.

```json
{
  "node": {
    "mem": 4000
  }
}
```

# Heap Size

It is extremely important to carefully define the Java heap size. Heap size is important to prevent swapping, which can seriously degrade ZooKeeper performance. Heap size should always be less than the memory allocated to a task. For more information, consult the [ZooKeeper Administrator's Guide](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_zkMulitServerSetup).

Change this value by modifying the following JSON.

```json
{
  "node": {
    "heap": 3000
  }
}
```

<a name="ports"></a>
# Ports

You can customize the ports exposed by the service via the service configuration. You only need to customize ports if you require multiple instances to share a single machine. However, ZooKeeper best practice dictates that nodes in the cluster reside on different machines in the event of single server failure.

You may specify the value each of these ports, and that port will be allocated for ZooKeeper's purpose. However, the port values across all machines in the ZooKeeper cluster remain the same. Crucial ports include:

## Client Port

You can customize the port that Apache ZooKeeper listens on for client connections.

Change this value by modifying the following JSON.

```json
{
  "zookeeper": {
    "client_port": 1140
  }
}
```

<!--
- _In the DC/OS CLI options.json_: _`client_port`_: string (default: _`1140`_).
- _DC/OS web interface_: The client port cannot be changed after the cluster has started.
-->

## Follower Port

You can customize the port that followers listen on to connect to their leader.

Change this value by modifying the following JSON.

```json
{
  "zookeeper": {
    "follower_port": 1240
  }
}
```

<!--
- _In the DC/OS CLI options.json_: _`follower_port`_: string (default: _`1240`_).
- _DC/OS web interface_: The follower port cannot be changed after the cluster has started.
-->

### Leader Election Port
You can customize the port that Apache ZooKeeper uses for leader election.

Change this value by modifying the following JSON.

```json
{
  "zookeeper": {
    "leader_election_port": 1340
  }
}
```

<!--
- _In the DC/OS CLI options.json_: _`leader_election_port`_: string (default: _`1340`_).
- _DC/OS web interface_: The leader election port cannot be changed after the cluster has started.
-->

<a name="storage-volumes"></a>
### Storage Volumes

The service supports two volume types:
- `ROOT` volumes are effectively an isolated directory on the root volume, sharing IO/spindles with the rest of the host system.
- `MOUNT` volumes are a dedicated device or partition on a separate volume, with dedicated IO/spindles.

Using `MOUNT` volumes requires [additional configuration on each DC/OS agent system](/1.10/storage/mount-disk-resources/), so the service currently uses `ROOT` volumes by default. To ensure reliable and consistent performance in a production environment, you should configure `MOUNT` volumes on the machines that will run the service in your cluster.

ZooKeeper requires two directories: the `dataDir`, used for storing data, and the `dataLogDir`, used for storing logs. Both have designated configurable volumes.

To configure the `dataDir` disk type, modify the following JSON.

```json
{
  "node": {
    "data_disk_type": "ROOT"
  }
}
```

<!--
- _In the DC/OS CLI options.json_: _`data_disk_type`_: string (default: _`ROOT`_)
- _DC/OS web interface_: _`ZOOKEEPER_DISK_TYPE`_: string
-->

To configure the `dataLogDir` disk type, modify the following JSON.

```json
{
  "node": {
    "log_disk_type": "ROOT"
  }
}
```

<!-- 
- _In the DC/OS CLI options.json_: _`log_disk_type`_: string (default: _`ROOT`_)
- _DC/OS web interface_: _`ZOOKEEPER_LOG_TYPE`_: string
-->
<a name="placement-constraints"></a>
# Placement Constraints

<!-- stopped here -->

Placement constraints allow you to customize where the service is deployed in the DC/OS cluster. Placement constraints support all [Marathon operators](http://mesosphere.github.io/marathon/docs/constraints.html).

By default, DC/OS Apache ZooKeeper has a placement strategy of `[["hostname", "UNIQUE"]]`. This is to minimize risk from single node failure.

A common task is to specify a list of whitelisted systems to deploy to. To achieve this, use the following syntax for the placement constraint:

```
[["hostname", "LIKE", "10.0.0.159|10.0.1.202|10.0.3.3"]]
```

You must include spare capacity in this list, so that if one of the whitelisted systems goes down, there is still enough room to repair your service without that system.

For an example of updating placement constraints, see [Managing](#managing) below.

<a name="overlay-networks"></a>
### Overlay Networks

The ZooKeeper service can be run on the DC/OS overlay network, affording each node its own IP address (IP-per-container). For details about virtual networks on DC/OS see the [documentation](/1.9/networking/virtual-networks/#virtual-network-service-dns). For the ZooKeeper service, using the overlay network means that nodes no longer use reserved port resources on the Mesos agents. This means that nodes that share machines with other applications may need to use the same ports that ZooKeeper does. That means, however, that we cannot guarantee that the ports on the agents containing the reserved resources for ZooKeeper will be available, therefore we do not allow a service to change from the overlay network to the host network. Once the service is deployed on the overlay network it must remain on the overlay network. The only way to move your data to ZooKeeper on the host network is through a migration.
