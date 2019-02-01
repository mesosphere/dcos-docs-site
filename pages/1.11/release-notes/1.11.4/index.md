---
layout: layout.pug
navigationTitle: Release Notes for 1.11.4
title: Release Notes for 1.11.4
menuWeight: 30
excerpt: Release notes for DC/OS 1.11.4
---

DC/OS 1.11.4 was released on July 26, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.4 includes the following:

- Apache Mesos 1.5.2-2440c73 [change log](https://github.com/apache/mesos/blob/2440c73/CHANGELOG).
- Marathon 1.6.535 [change log](https://github.com/mesosphere/marathon/releases/tag/v1.6.535).
- Metronome 0.4.2 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.2).


# Issues Fixed in DC/OS 1.11.4

- COPS-1840/DCOS_OSS-3793 - Change Admin Router (nginx) log to access logs with the daemon facility.
- COPS-3073/DCOS-21993 - Improve DC/OS Mesos authorization for logging and performance.
- COPS-3132/DCOS-21723 - DC/OS UI: Increase disk space for Cassandra service.
- COPS-3402/DCOS_OSS-3750 - Move data directories to a tmpfs location and recycle allocated IP addresses upon agent reboot.  
- COPS-3445/DCOS-39092/DCOS_OSS-2418 - Prevent Mesos agents from garbage-collecting persistent volumes.
- DCOS-20053 - Fix Admin Router time-out issue.
- DCOS-22458 - Tune health check time-outs. [enterprise type="inline" size="small" /]
- DCOS-27982/DCOS-38599 - Fix mixed workload scaling issue.
- DCOS-34596 - DC/OS IAM: Fix a regression, where a SAML identity provider metadata document containing multiple certificates stopped working after an upgrade. [enterprise type="inline" size="small" /]
- DCOS-37451 - Filter task labels used for book-keeping from appearing in metrics.
- DCOS-37452 - Increase the Mesos agent response time-out for dcos-metrics.
- DCOS-37588 - Fix Vault/ZK lock release issue that occurred due to temporary connection loss.
- DCOS-38083 - Improve the behavior of statsd timers on dcos-metrics.
- DCOS-38248 - Fix Admin Router behavior on scale testing cluster. The Admin Router failed to update state cache due to worker_connections exhaustion.
- DCOS-38258/DCOS_OSS-3307 - Increase the time-out for package download in Admin Router server.
- DCOS-38323 - Increase the time-out for Lua HTTP client from 10 to 60 sec to accomodate longer response time from upstream DC/OS components (e.g., Mesos and Marathon).
- DCOS-38603 - Improve Mesos allocator performance.
- DCOS_OSS-2360 - DC/OS Metrics: Sanitize metric names for better compatibility with Prometheus.
- DCOS_OSS-3304 - Add task labels as tags on container metrics.
- DCOS_OSS-3602 - Fix instability issue: L4LB is unstable during deployment of new VIPS.
- DCOS_OSS-3613 - Improve diagnostics bundle to include debugging information for network issues. 
- DCOS_OSS-3804 - Fix logging of dcos-checks-poststart results to the journal. 


# Notable Changes in DC/OS 1.11.4

- DCOS-37833 - Increase the limit on the number of connections (worker_connections) for Admin Router to 10K.
- DCOS_OSS-3597- Update REX-Ray version to [0.11.2](https://github.com/rexray/rexray/releases/tag/v0.11.2).
- Update DC/OS UI for [1.11+v1.15.0+3231764b](https://github.com/mesosphere/dcos-ui-plugins-private/compare/1.11+v1.14.0+7e0cb54f...1.11+v1.15.0+3231764b). [enterprise type="inline" size="small" /]
- Update DC/OS UI for [1.11+v1.15.0](https://github.com/dcos/dcos-ui/blob/1.11+v1.15.0/CHANGELOG.md). [oss type="inline" size="small" /]

**Note:** The Kubernetes package dependencies are documented [here](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install).


# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).


## New Features and Capabilities

### Platform
- Multi-region management - Enables a DC/OS Cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between one cluster and another. You add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Decommission node - Support for permanently decommissioning nodes makes it easier to manage “spot” cloud instances, allowing for immediate task rescheduling. [View the documentation](/1.11/hybrid-cloud/features/decommission-nodes/)
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers/).
 -  Support for Docker image pull secrets. [View the documentation](/1.11/deploying-services/containerizers/). An example for Docker credentials is [here](/1.11/installing/production/deploying-dcos/configuration/examples/#docker-credentials). [enterprise type="inline" size="small" /]

### Networking
- Edge-LB 1.0. [View the documentation](https://docs.mesosphere.com/services/edge-lb/1.0/). [enterprise type="inline" size="small" /]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack - All networking components (minuteman, navstar, spartan) are aggregated into a single systemd unit called `dcos-net`.  Read this [note](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). [View the documentation](/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) to understand its usage.

[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Secrets can now be binary files in addition to environment variables.
  - Hierarchical access control is now supported.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics/).
- Unified logging API provides simple access to container (task) and system component logs. [View the documentation](/1.11/monitoring/logging/logging-api/).

### Storage
- DC/OS Storage Service 0.1 (beta) - DSS users will be able to dynamically create volumes based upon profiles or policies to fine-tune their applications storage requirements. This feature leverages the industry-standard Container Storage Interface (CSI) to streamline the development of storage features in DC/OS by Mesosphere and our community and partner ecosystems. [View the documentation](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /] [enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled in the config.yaml file when installing DC/OS. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.


