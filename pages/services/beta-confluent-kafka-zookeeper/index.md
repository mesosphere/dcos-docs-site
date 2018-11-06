---
layout: layout.pug
navigationTitle: Beta Confluent Kafka Zookeeper
title: Beta Confluent Kafka Zookeeper
menuWeight: -1
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


DC/OS Beta Confluent Apache Kafka ZooKeeper is an automated service that makes it easy to deploy and manage Apache ZooKeeper on [DC/OS](https://mesosphere.com/product/) for the purposes of running the DC/OS
Apache Kafka and DC/OS Confluent Kafka Services. ZooKeeper is a centralized service for maintaining configuration and naming information, as well as providing distributed synchronization and group services.

For more information on Apache ZooKeeper, see the [ZooKeeper documentation](http://zookeeper.apache.org/). In particular, the [ZooKeeper Admin Guide](https://zookeeper.apache.org/doc/trunk/zookeeperAdmin.html).

## Features

- Single command installation for rapid provisioning.
- CLI for easy management.
- Cluster size of 3 or 5 nodes for fault tolerance in production.
- Multiple ZooKeeper clusters sharing a single DC/OS cluster for multi-tenancy.
- Rolling software and configuration updates for runtime maintenance.
