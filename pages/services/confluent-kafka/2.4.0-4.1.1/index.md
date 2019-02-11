---
layout: layout.pug
navigationTitle: Confluent Kafka 2.4.0-4.1.1
excerpt: DC/OS Confluent Kafka is an automated service that makes it easy to deploy and manage Confluent Kafka on Mesosphere DC/OS.
title: Confluent Kafka 2.4.0-4.1.1
menuWeight: 0
model: /services/confluent-kafka/data.yml
render: mustache
featureMaturity:
enterprise: false
---


DC/OS {{ model.techName }} is an automated service that makes it easy to deploy and manage {{ model.techName }} on Mesosphere DC/OS, eliminating nearly all of the complexity traditionally associated with managing a {{ model.techShortName }} cluster. {{ model.techName }} is a distributed high-throughput publish-subscribe messaging system with strong ordering guarantees. {{ model.techShortName }} clusters are highly available, fault tolerant, and very durable. DC/OS {{ model.techName }} gives you direct access to the {{ model.techName }} API so that existing producers and consumers can interoperate. You can configure and install DC/OS {{ model.techName }} in moments. Multiple {{ model.techName }} clusters can be installed on DC/OS and managed independently, so you can offer {{ model.techName }} as a managed service to your organization.

## Benefits

DC/OS {{ model.techName }} offers the following benefits of a semi-managed service:

*   Easy installation
*   Multiple {{ model.techName }} clusters
*   Elastic scaling of brokers
*   Replication and graceful shutdown for high availability
*   {{ model.techName }} cluster and broker monitoring

## Features

DC/OS {{ model.techName }} provides the following features:

*   Single-command installation for rapid provisioning
*   Multiple clusters for multiple tenancy with DC/OS
*   High availability runtime configuration and software updates
*   Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
*   Integration with syslog-compatible logging services for diagnostics and troubleshooting
*   Integration with statsd-compatible metrics services for capacity and performance monitoring

# Related Services

*   [DC/OS Spark](/services/spark/)
