---
layout: layout.pug
navigationTitle: Confluent Kafka 2.2.0-4.0.0e
excerpt:
title: Confluent Kafka 2.2.0-4.0.0e
menuWeight: -1
model: /services/confluent-kafka/data.yml
render: mustache
featureMaturity:
enterprise: false
---

<!-- Imported from https://github.com/mesosphere/dcos-commons.git:sdk-0.40 -->

DC/OS Confluent Kafka is an automated service that makes it easy to deploy and manage Confluent Kafka on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing a Kafka cluster. Confluent Kafka is a distributed high-throughput publish-subscribe messaging system with strong ordering guarantees. Kafka clusters are highly available, fault tolerant, and very durable. DC/OS Confluent Kafka gives you direct access to the Confluent Kafka API so that existing producers and consumers can interoperate. You can configure and install DC/OS Confluent Kafka in moments. Multiple Confluent Kafka clusters can be installed on DC/OS and managed independently, so you can offer Confluent Kafka as a managed service to your organization.

## Benefits

DC/OS Confluent Kafka offers the following benefits of a semi-managed service:

*   Easy installation
*   Multiple Confluent Kafka clusters
*   Elastic scaling of brokers
*   Replication and graceful shutdown for high availability
*   Confluent Kafka cluster and broker monitoring

## Features

DC/OS Confluent Kafka provides the following features:

*   Single-command installation for rapid provisioning
*   Multiple clusters for multiple tenancy with DC/OS
*   High availability runtime configuration and software updates
*   Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
*   Integration with syslog-compatible logging services for diagnostics and troubleshooting
*   Integration with statsd-compatible metrics services for capacity and performance monitoring

# Related Services

*   [DC/OS Spark](/services/spark/)
