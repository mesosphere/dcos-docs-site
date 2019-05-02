---
layout: layout.pug
navigationTitle:  High Availability
title: High Availability
menuWeight: 6
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


This page discusses the high availability (HA) features in DC/OS and best practices for building HA applications on DC/OS.

# Leader/Follower Architecture

A common pattern in HA systems is the leader/follower concept. This is also sometimes referred to as: master/slave, primary/replica, or some combination thereof. This architecture is used when you have one authoritative process, with N standby processes. In some systems, the standby processes might also be capable of serving requests or performing other operations. For example, when running a database like MySQL with a master and replica, the replica is able to serve read-only requests, but it cannot accept writes (only the master will accept writes).

In DC/OS, a number of components follow the leader/follower pattern. We'll discuss some of them here and how they work.

#### Mesos

Mesos can be run in high availability mode, which requires running 3 or 5 masters. When run in HA mode, one master is elected as the leader, while the other masters are followers. Each master has a replicated log which contains some state about the cluster. The leading master is elected by using ZooKeeper to perform leader election. For more detail on this, see the [Mesos HA documentation](https://mesos.apache.org/documentation/latest/high-availability/).

#### Marathon

Marathon can be run in HA mode, which allows running multiple Marathon instances (at least 2 for HA), with one elected leader. Marathon uses ZooKeeper for leader election. The followers do not accept writes or API requests, instead the followers proxy all API requests to the leading Marathon instance.

#### ZooKeeper

ZooKeeper is used by numerous services in DC/OS to provide consistency. ZooKeeper can be used as a distributed locking service, a state store, and a messaging system. ZooKeeper uses [Paxos-like](https://en.wikipedia.org/wiki/Paxos_(computer_science&#41;) log replication and a leader/follower architecture to maintain consistency across multiple ZooKeeper instances. For a more detailed explanation of how ZooKeeper works, check out the [ZooKeeper internals document](https://zookeeper.apache.org/doc/r3.4.8/zookeeperInternals.html).

# Fault Domain Isolation
Fault domain isolation is an important part of building HA systems. To correctly handle failure scenarios, systems must be distributed across fault domains to survive outages. There are different types of fault domains, a few examples of which are:

 * Physical domains: this includes machine, rack, datacenter, region, and availability zone.
 * Network domains: machines within the same network may be subject to network partitions. For example, a shared network switch may fail or have invalid configuration.

With DC/OS, you can distribute masters across racks for HA. Agents can be distributed across regions, and it's recommended that you tag agents with attributes to describe their location. Synchronous services like ZooKeeper should also remain within the same region to reduce network latency. For more information, see the Configuring High Availability [documentation](/1.10/installing/production/advanced-configuration/configuring-zones-regions/).

For applications which require HA, they should also be distributed across fault domains. With Marathon, this can be accomplished by using the [`UNIQUE`  and `GROUP_BY` constraints operator](https://mesosphere.github.io/marathon/docs/constraints.html).

# Separation of Concerns

HA services should be decoupled, with responsibilities divided amongst services. For example, web services should be decoupled from databases and shared caches.

# Eliminating Single Points of Failure

Single points of failure come in many forms. For example, a service like ZooKeeper can become a single point of failure when every service in your system shares one ZooKeeper cluster. You can reduce risks by running multiple ZooKeeper clusters for separate services. There's an Exhibitor [Universe package](https://github.com/mesosphere/exhibitor-dcos) that makes this easy.

Other common single points of failure include:

- Single database instances (like a MySQL)
- One-off services
- Non-HA load balancers

# Fast Failure Detection

Fast failure detection comes in many forms. Services like ZooKeeper can be used to provide failure detection, such as detecting network partitions or host failures. Service health checks can also be used to detect certain types of failures. As a matter of best practice, services *should* expose health check endpoints, which can be used by services like Marathon.

# Fast Failover

When failures do occur, failover [should be as fast as possible](https://en.wikipedia.org/wiki/Fail-fast). Fast failover can be achieved by:

 * Using an HA load balancer like [Marathon-LB](/services/marathon-lb/1.12/), or the internal [Layer 4 load balancer](/1.10/networking/load-balancing-vips/).
 * Building apps in accordance with the [12-factor app](http://12factor.net/) manifesto.
 * Following REST best-practices when building services: in particular, avoiding storing client state on the server between requests.

A number of DC/OS services follow the fail-fast pattern in the event of errors. Specifically, both Mesos and Marathon will shut down in the case of unrecoverable conditions such as losing leadership.
