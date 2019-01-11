---
layout: layout.pug
navigationTitle: Release Notes for 1.11.2
title: Release Notes for 1.11.2
menuWeight: 30
excerpt: Release notes for DC/OS 1.11.2
---

DC/OS 1.11.2 was released on May 18, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.2 includes the following:

- Apache Mesos 1.5.1-aedbcfd [change log](https://github.com/apache/mesos/blob/aedbcfd/CHANGELOG).
- Marathon 1.6.392 [change log](https://github.com/dcos/dcos/pull/2678).
- Metronome 0.4.2 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.2).


# Issues Fixed in DC/OS 1.11.2

- COPS-3195 - Mesos: Fixed an issue where the authentication token refresh would not be performed. [enterprise type="inline" size="small" /]
- DCOS-14199 - Consolidated the Exhibitor bootstrapping shortcut by atomically reading and writing the ZooKeeper PID file.
- DCOS-20514 - Added licensing information to the diagnostics bundle. [enterprise type="inline" size="small" /]
- DCOS-20568 - Fixed diagnostics bundle creation bug regarding insufficient service account permissions. [enterprise type="inline" size="small" /]
- DCOS-21596 - If a local user account matches an LDAP username that exists within an LDAP group, the local user account is now automatically added to the LDAP group. [enterprise type="inline" size="small" /]
- DCOS-21611 - The IP detect script and fault domain detect script can be changed with a config upgrade. 
- DCOS-22128 - Fixed an issue in the Service view of DC/OS UI, when cluster has pods with not every container mounting a volume [enterprise type="inline" size="small" /]
- DCOS-22041 - Admin Router: Fixed a race condition in the permission data cache. [enterprise type="inline" size="small" /]
- DCOS-22133 - DC/OS IAM: Fixed a rare case where the database bootstrap transaction would not insert some data. [enterprise type="inline" size="small" /]
- DCOS_OSS-2317 - Consolidated pkgpanda's package download method.
- DCOS_OSS-2335 - Increased the Mesos executor re-registration timeout to consolidate an agent failover scenario.
- DCOS_OSS-2360 - DC/OS Metrics: metric names are sanitized for better compatibility with Prometheus.
- DCOS_OSS-2378 - DC/OS Net: Improved stability of distribution protocol over TLS. 
- DC/OS UI: Incorporated [multiple](https://github.com/dcos/dcos/pull/2799) fixes and improvements. 


# Notable Changes in DC/OS 1.11.2

- MARATHON-8090 - Reverted the Marathon configuration change for GPU resources which was introduced in 1.11.1 release.
- QUALITY-2006 - RHEL 7.4 with Docker EE 17.06.2 is supported.
- QUALITY-2007 - RHEL 7.4 with Docker 17.12.1-ce is supported. 
- QUALITY-2057 - CentOS 7.4 with Docker EE 17.06.2 is supported.

# Security Enhancements in DC/OS 1.11.2

- DCOS-21465 - Updated python3-saml for [CVE-2017-11427](https://www.kb.cert.org/vuls/id/475445). [enterprise type="inline" size="small" /] 
- DCOS-21958 - Admin Router on master nodes no longer supports the older TLS 1.1 protocol and 3DES encryption algorithm by default. [enterprise type="inline" size="small" /] 


**Note:** 
- New Docker versions are supported on RHEL 7.4. See [compatibility matrix](https://docs.mesosphere.com/version-policy/) for further information.
- The Kubernetes package dependencies are documented [here](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install).


# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities, with a focus on:
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


