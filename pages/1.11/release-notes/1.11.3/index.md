---
layout: layout.pug
navigationTitle: Release Notes for 1.11.3
title: Release Notes for 1.11.3
menuWeight: 25
excerpt: Release notes for DC/OS 1.11.3
---

DC/OS 1.11.3 was released on June 26, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.3 includes the following:

- Apache Mesos 1.5.2-197c910 [change log](https://github.com/apache/mesos/blob/197c910/CHANGELOG).
- Marathon 1.6.496 [change log](https://github.com/dcos/dcos/blob/1.11.3/packages/marathon/buildinfo.json).
- Metronome 0.4.2 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.2).


# Issues Fixed in DC/OS 1.11.3

- COPS-3158 - The check in custom installer for ftype=1 on Mesos and Docker work directories is added only when using XFS.
- DCOS-11714 - DC/OS IAM: Added support for anonymous bind via LDAP. [enterprise type="inline" size="small" /]
- DCOS-22458 - Improved stability of dcos-checks-poststart-service-unhealthy check. [enterprise type="inline" size="small" /]
- DCOS-25602 - DC/OS IAM: Reduced excessive logging which was accidentally introduced in 1.11.1 release. [enterprise type="inline" size="small" /]
- DCOS-34435 - DC/OS Cosmos: Increased the limit of max-payload size at /v2/apps Marathon end point.
- DCOS-34536 - Fixed DC/OS upgrade issue with ipv6 address configuration.
- DCOS-38015 - Enhanced Mesos TLS cipher suites support with secure cipher suites. [enterprise type="inline" size="small" /]

# Notable Changes in DC/OS 1.11.3

- DCOS-19427 - CockroachDB: Set cluster version to 1.1. [enterprise type="inline" size="small" /]
- DCOS_OSS-2417 and DCOS_OSS-3548 - Support for CoreOS 1688.5.3. 
- Updated DC/OS UI Enterprise for 1.11+1.13.0+7e0cb54f [Open Source change log](https://github.com/dcos/dcos-ui/blob/1.11%2Bv1.13.0/CHANGELOG.md) and [EE Plugins](https://github.com/mesosphere/dcos-ui-plugins-private/compare/v1.11.1...1.11+1.13.0+7e0cb54f). [enterprise type="inline" size="small" /]
- Updated DC/OS UI for [1.11+v1.14.0](https://github.com/dcos/dcos-ui/blob/1.11+v1.14.0/CHANGELOG.md).


**Note:** 
- New Docker version is supported on CoreOS 1688.5.3. See [compatibility matrix](https://docs.mesosphere.com/version-policy/) for further information.
- The Kubernetes package dependencies are documented [here](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install).


# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service
- Enhanced data security [enterprise type="inline" size="small" /]
- Updated data services

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


