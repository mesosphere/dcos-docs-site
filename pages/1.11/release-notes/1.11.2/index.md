---
layout: layout.pug
navigationTitle: Release Notes for 1.11.2
title: Release Notes for 1.11.2
menuWeight: 0
excerpt: Release notes for DC/OS 1.11.2
---

These are the release notes for DC/OS 1.11.2.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

# <a name="issues-fixed"></a>Issues Fixed in DC/OS 1.11.2

- DCOS-14199 - Fixed an issue that prevented DC/OS from recovering when available disk space was low.
- DCOS-22128 - Supported pods with volumes but no volume mounts. [enterprise type="inline" size="small" /]
- DCOS_OSS-2378/SOAK-88 - DC/OS Net: Improved stability of distribution protocol over TLS. [enterprise type="inline" size="small" /]
- SOAK-92 - 



# <a name="notable-changes"></a>Notable Changes in DC/OS 1.11.2

- DCOS-22326 - Disabled the insecure 3DES bulk encryption algorithm and TLS 1.1 protocol by default for Master Admin Router.
- DCOS-21557/DCOS_OSS-2367 - Upgraded curl to version 7.59, which fixed several curl security vulnerabilities from previous version.
- QUALITY-2006 - RHEL 7.4 with Docker EE 17.06.2 is supported.
- QUALITY-2057 - CentOS 7.4 with Docker EE 17.06.2 is supported. 
- DCOS-29080, DCOS-29122, DCOS-29168, DCOS-29188, DCOS-29216, DCOS-29265, DCOS-29282, DCOS-29299, DCOS-29384, DCOS-29455, DCOS-29520, DCOS-29532, DCOS-29544, DCOS-29567, DCOS-29601, DCOS-29616, DCOS-29634, and DCOS-29703 - Implemented remote region support for data engineering services.

- DCOS-29216, DCOS-29384, DCOS-29384, DCOS-29455, DCOS-29520, DCOS-29532, DCOS-29567, DCOS-29080 - Implemented remote region support for data engineering services.
- DCOS-29634 - Implement region validation and config-sniffing in SDK.
- DCOS-29122 - Upgraded multi-region SDK package to Universe services.
- DCOS-29168 - 
- QUALITY-2006 - RHEL 7.4 with Docker EE 17.06.2 is supported.
- QUALITY-2007 - RHEL 7.4 with Docker 17.12.1-ce is supported. 
- QUALITY-2057 - CentOS 7.4 with Docker EE 17.06.2 is supported.
- QUALITY-2060 - Certified DC/OS 1.11.2 with CoreOS 1688.5.3.
**Note:** Previous 1.11 point releases are not supported for CoreOS 1688.5.3.

**Note:** Implemented region awareness support for SDK based services.

# <a name="known-issue"></a>Known Issue in DC/OS 1.11.2

- DCOS-20568 - Fixed dcos-diagnostics master service account permission issue.



# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities, with a focus on:
- Managing clusters across multiple clouds [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service
- Enhanced data security [enterprise type="inline" size="small" /]
- Updated data services

Provide feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).

<a name="new-features"></a>
## New Features and Capabilities

### Platform
- Multi-region management - Enables a DC/OS Cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between a cluster and another cluster. You add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- Decommission node - Support for permanently decommissioning nodes makes it easier to manage “spot” cloud instances, allowing for immediate task rescheduling.
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers).
  - Support for Docker image pull secrets. [enterprise type="inline" size="small" /]

### Networking
- Edge-LB 1.0. [View the documentation](https://docs.mesosphere.com/services/edge-lb/1.0/) [enterprise type="inline" size="small" /]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack - All networking components (minuteman, navstar, spartan) are aggregated into a single systemd unit called `dcos-net`.  Read this [note](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). [View the documentation](/1.11/installing/oss/custom/configuration/configuration-parameters/#dns-forward-zones) to understand its usage.

[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Binary Secret files are supported now.
  - Hierarchical access control is supported now.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics).
- Unified logging API provides simple access to container (task) and system component logs. [View the documentation](/1.11/monitoring/logging/logging-api/logging-v2/).

### Storage
- DC/OS Storage Service 0.1 (beta) - DSS users will be able to dynamically create volumes based upon profiles or policies to fine-tune their applications storage requirements. This feature leverages the industry-standard Container Storage Interface (CSI) to streamline the development of storage features in DC/OS by Mesosphere and our community and partner ecosystems. [View the documentation](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /][enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods).[beta type="inline" size="small" /]

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.

## <a name="known-issues"></a>Known Issues
- DCOS-9751	- Marathon fails to authenticate with Mesos master during disabled -> permissive upgrade.
- DCOS-18368 - The GUI installer has been retired in 1.11 and will no longer continue to function. It will be decommissioned in 1.12. For details of alternative installation methods, [view the documentation](https://docs.mesosphere.com/1.11/installing).
- DCOS-19047 - `dcos-secrets` service is unavailable during upgrade from 1.10.x to 1.11. [enterprise type="inline" size="small" /]
- INFINITY-3116	- Deleting failed mnist Tensorflow package never completes.
