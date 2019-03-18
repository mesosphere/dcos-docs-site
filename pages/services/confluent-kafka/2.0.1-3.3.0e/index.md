---
layout: layout.pug
navigationTitle:  Confluent Kafka 2.0.1-3.3.0e
title: Confluent Kafka 2.0.1-3.3.0e
menuWeight: -1
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->

**Warning:** There are two timing issues in the deployment of this version of the service that are exacerbated when brokers are allocated more than 1 CPU each. Specifically:

1. The brokers may fail to start due to the broker VIP taking slightly too long to be created relative to how fast the brokers start.
1. The brokers may be stuck in the STARTING state due to the readiness check in this version being too time sensitive when the brokers start quickly.

Additional CPU beyond 1 per broker increases the likelihood of hitting these issues, as more CPU causes the Brokers to start faster.

**Action:** The 2.0.1.1-3.3.0e version of the package does NOT experience this issue and should be used instead.

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
