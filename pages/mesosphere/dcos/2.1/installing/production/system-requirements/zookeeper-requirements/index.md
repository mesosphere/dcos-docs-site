---
layout: layout.pug
title: ZooKeeper resources
navigationTitle: ZooKeeper resources
menuWeight: 10
excerpt: Requirements and recommendations for ZooKeeper in a DC/OS cluster
---
ZooKeeper is a centralized coordination service that stores, maintains, and synchronizes information for distributed systems. ZooKeeper and its management service maintain state information and record details of node activity in a data directory. As changes are made to the cluster, those changes are recorded in the ZooKeeper transaction log. When the transaction log grows too large, ZooKeeper creates a snapshot of the current state of cluster nodes.

# Why planning ZooKeeper resources is important
As a fundamental component of the DC/OS platform architecture, ZooKeeper performs several critical tasks for the DC/OS cluster. For example, ZooKeeper identifies which master node is used as the leader and coordinates the leader selection so that this information is available to the other master nodes, agents, and schedulers.

Because ZooKeeper status, operation, and performance can directly affect the stability, resiliency, and performance of the DC/OS cluster, it is important to optimize your ZooKeeper configuration to handle the intended cluster workload effectively and efficiently. For example, issues with ZooKeeper write performance often lead to latency-related problems and degraded cluster performance.

# Transaction logs and snapshots
ZooKeeper maintains state information for Marathon-orchestrated services and persists data in its transaction logs and snapshots. For a DC/OS cluster, both the ZooKeeper snapshots and transaction log are stored in the `/var/lib/dcos/exhibitor` directory and managed by the Exhibitor service. Using a dedicated log device for DC/OS exhibitor (`dcos-exhibitor`) log files helps to avoid resource contention and latency issues. For more information about basic system resource requirements and disk partitioning, see [System requirements](/mesosphere/dcos/2.0/installing/system-requirements).

# Identifying potential problems
One key way you can identify issues that are related to ZooKeeper is by searching DC/OS exhibitor (`dcos-exhibitor`) log files for messages related to synchronization (`fsync`) operations. If there are disk latency issues when writing to the transaction log, ZooKeeper may log messages similar to the following:

`WARN SyncThread:14  fsync-ing the write ahead log in SyncThread:14 took 14818ms which will adversely effect operation latency. See the ZooKeeper troubleshooting guide`

# Recommendations for a healthy DC/OS cluster
Because ZooKeeper keeps track of state, it is sensitive to timeouts caused by network latency. If you experience issues with network bandwidth being overloaded or with client sessions that are terminated because network connections are too slow, these issues will also make your DC/OS cluster less reliable.

To ensure you have a healthy DC/OS cluster, you should use the following guidelines to deploy and manage ZooKeeper.

## Monitor memory and swap
You should verify that Zookeeper has enough heap memory. Insufficient memory allocation can affect ZooKeeper performance particularly during garbage collection. Specific memory requirements, however, vary depending on the number of nodes, clients, and schedulers you have deployed for the cluster, and the overall cluster workload you need to run. 

In most cases, you should also configure your ZooKeeper installation to not allow memory swapping. For ZooKeeper operations to function correctly in a timely way, you should avoid allowing swap space to be used. The maximum heap size you allocate for ZooKeeper should not be larger than the real memory available for to ZooKeeper to use.

One simple way you can monitor the read and write performance of a disk device is by running the following commands to measure server throughput and server latency:
<p>
<code>dd if=/dev/zero of=/tmp/test1.img bs=1024 count=1</code><br>
<code>dd if=/dev/zero of=/tmp/test2.img bs=1024 count=1000</code>

## Isolate master nodes from agent nodes

Isolate master nodes from agent nodes to prevent memory and CPU contention, especially when workloads are started on the agents.

The most common ZooKeeper issues occur when ZooKeeper transaction log files are stored on the same solid state drive (SSD) as other components where ZooKeeper write performance becomes a bottleneck that slows down or delays processing of other worker threads.
    
ZooKeeper should not share resources with any other processes or services. ZooKeeper writes new transactions to the log before performing updates or sending a response to the client. Dedicating disk space for the ZooKeeper transaction log directory prevents I/O processing by other applications from overloading the disk.
    
You should be sure ZooKeeper directories are configured to use fast disks that can complete synchronization (`fsync`) operations successfully in a timely fashion.

## Provision ZooKeeper directories for master nodes
You should put the `/var/lib/dcos` directory for each master node on a separate dedicated disk to reduce latency issues. Using a dedicated partition might not be sufficient. Putting the log on a busy or shared device will adversely affect performance. 
    
## Review system and network configuration
In addition to the ZooKeeper-specific recommendations, you should monitor system and network metrics and perform any additional administrative actions that help to reduce I/O contention from other processes and nodes.
