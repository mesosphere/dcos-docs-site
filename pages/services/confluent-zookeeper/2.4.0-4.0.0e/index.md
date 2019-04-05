---
layout: layout.pug
navigationTitle: Confluent ZooKeeper 2.4.0-4.0.0e
title: Confluent ZooKeeper 2.4.0-4.0.0e
menuWeight: 1
excerpt:

model: /services/confluent-zookeeper/data.yml
render: mustache
---

<!-- Imported from git@github.com:mesosphere/dcos-zookeeper.git:update-docs -->

DC/OS {{ model.techName }} is an automated service that makes it easy to deploy and manage {{ model.techName }} on [DC/OS](https://mesosphere.com/product/) for the purposes of running the DC/OS
Apache Kafka and DC/OS Confluent Kafka Services. ZooKeeper is a centralized service for maintaining configuration and naming information, as well as providing distributed synchronization and group services.

For more information on {{ model.techName }}, see the [ZooKeeper documentation](http://zookeeper.apache.org/). In particular, the [ZooKeeper Admin Guide](https://zookeeper.apache.org/doc/r3.4.10/zookeeperAdmin.html).

## Features

- Single command installation for rapid provisioning.
- CLI for easy management.
- Cluster size of 3 or 5 nodes for fault tolerance in production.
- Multiple ZooKeeper clusters sharing a single DC/OS cluster for multi-tenancy.
- Rolling software and configuration updates for runtime maintenance.
