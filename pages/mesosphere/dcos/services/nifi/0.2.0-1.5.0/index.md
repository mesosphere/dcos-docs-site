---
layout: layout.pug
navigationTitle: NiFi 0.2.0-1.5.0
title: NiFi 0.2.0-1.5.0
menuWeight: 2
excerpt: Overview of DC/OS Apache NiFi 0.2.0-1.5.0
featureMaturity:
community: true
---

Apache NiFi is a dataflow system based on the concepts of flow-based programming. It supports powerful and scalable directed graphs of data routing, transformation and system mediation logic. NiFi has a web-based user interface for design, control, feedback, and monitoring of dataflows. It is highly configurable along several dimensions of quality of service, such as loss-tolerant versus guaranteed delivery, low latency versus high throughput and priority-based queuing. NiFi provides fine-grained data provenance for all data received, forked, joined cloned, modified, sent and ultimately dropped upon reaching its configured end-state.

DC/OS NiFi Service is an automated service that makes it easy to deploy and manage Apache NiFi on Mesosphere [DC/OS](https://mesosphere.com/product/), eliminating nearly all complexities, that are traditionally associated with managing a cluster of NiFi nodes.

<p class="message--warning"><strong>WARNING: </strong>This is a Community service. Community services are not tested for production environments. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.</p>

## Benefits
DC/OS NiFi  offers the following benefits of a semi-managed service:

1. Easy installation
2. Multiple NiFi clusters
3. Elastic scaling of nodes
4. Replication and graceful shutdown for high availability
5. NiFi cluster and node monitoring



DC/OS NiFi  provides the following features:

1. Single-command installation for rapid provisioning
2. Multiple clusters for multiple tenancy with DC/OS
3. High availability runtime configuration and software updates
3. Storage volumes for enhanced data durability, known as Mesos Dynamic Reservations and Persistent Volumes
5. Integration with syslog-compatible logging services for diagnostics and troubleshooting
6. Integration with statsd-compatible metrics services for capacity and performance monitoring



# DC/OS NiFi Service Documentation
