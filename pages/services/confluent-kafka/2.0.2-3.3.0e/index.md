---
layout: layout.pug
navigationTitle:  Confluent Kafka 2.0.2-3.3.0e
title: Confluent Kafka 2.0.2-3.3.0e
menuWeight: -1
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


DC/OS Confluent Apache Kafka is an automated service that makes it easy to deploy and manage Apache Kafka on [DC/OS](https://mesosphere.com/product/). Apache Kafka is a distributed high-throughput publish-subscribe messaging system with strong ordering guarantees. Kafka clusters are highly available, fault tolerant, and very durable. For more information on Confluent Kafka, see its [documentation](http://docs.confluent.io/current/) or its white paper, [Deploying Confluent Platform on Mesosphere Datacenter OS](https://www.confluent.io/whitepaper/deploying-confluent-platform-with-mesosphere/).

The service comes with a reasonable initial configuration for evaluation use. You can customize the service configuration at initial install, and later update once the service is already running through a configuration rollout process. If you just want to try out the service, you can use the default configuration and be up and running within moments.

Interoperating clients and services can take advantage of DC/OS service discovery features to directly access Confluent Kafka via advertised endpoints, regardless of where the instance is located within a DC/OS Cluster.

You can install multiple Kafka instances on DC/OS and manage them independently. This allows different teams within an organization to have isolated instances of the service.

**Note:** The service is currently in Beta development. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.

## Features

- Multiple instances sharing the same physical systems (requires custom port configuration).
- Vertical (resource) and horizontal (increase broker count) scaling.
- Easy redeployment to new systems upon scheduled or unscheduled outages.
- Consistent DNS addresses regardless of where brokers are located in the cluster.
- Node placement can be customized via Placement Constraints.
