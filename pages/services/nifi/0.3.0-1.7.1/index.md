---
layout: layout.pug
navigationTitle: NiFi 0.3.0-1.7.1
title: NiFi 0.3.0-1.7.1
menuWeight: 50
excerpt: Overview of DC/OS Apache NiFi 0.3.0-1.7.1
featureMaturity:
enterprise: false
model: ../data.yml
render: mustache
---

Apache {{ model.techShortName }} is a dataflow system based on the concepts of flow-based programming. It supports powerful and scalable directed graphs of data routing, transformation and system mediation logic. Apache {{ model.techShortName }} has a web-based user interface for design, control, feedback, and monitoring of dataflows. It is highly configurable along several dimensions of quality of service, such as loss-tolerant versus guaranteed delivery, low latency versus high throughput and priority-based queuing. Apache {{ model.techShortName }} provides fine-grained data provenance for all data received, forked, joined cloned, modified, sent and ultimately dropped upon reaching its configured end-state.

DC/OS {{model.techName }} Service is an automated service that makes it easy to deploy and manage {{ model.techShortName }} on Mesosphere [DC/OS](https://mesosphere.com/product/), eliminating nearly all complexities, that are traditionally associated with managing a cluster of DC/OS {{model.techName }} nodes.

## Benefits
DC/OS {{model.techName }}  offers the following benefits of a semi-managed service:

1. Easy installation
2. Multiple DC/OS {{model.techName }} clusters
3. Elastic scaling of Nodes
4. Replication and graceful shutdown for high availability
5. DC/OS {{model.techName }} cluster and Node monitoring



DC/OS {{model.techName }}  provides the following features:

1. Single-command installation for rapid provisioning
2. Multiple clusters for multiple tenancy with DC/OS
3. High availability runtime configuration and software updates
3. Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
5. Integration with syslog-compatible logging services for diagnostics and troubleshooting
6. Integration with statsd-compatible metrics services for capacity and performance monitoring
