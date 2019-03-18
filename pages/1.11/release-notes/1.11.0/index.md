---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.0
title: Release Notes for 1.11.0
menuWeight: 50
excerpt: Release notes for DC/OS 1.11.0
---

DC/OS 1.11.0 was released on March 8, 2018. 

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]


DC/OS 1.11 includes many new capabilities, with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).

# Contents
- [New Features and Capabilities](#new-features)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed](#fixed-issues)

<a name="new-features"></a>
## New Features and Capabilities

### Apache Mesos 1.5, Marathon 1.6, and Kubernetes 1.9 Integrated.
- DC/OS 1.11.0 is is based on Mesos 1.5. View the [Mesos changelog](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG).
- DC/OS 1.11.0 is integrated with the latest 1.6 release of Marathon. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
- DC/OS 1.11.0 supports the latest Kubernetes 1.9 Container Scheduler. For more information about Kubernetes 1.0 on DC/OS, [view the documentation](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3).

### Platform
- Multi-region management - Enables a DC/OS Cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between a cluster and another cluster. You add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Decommission node - Support for permanently decommissioning nodes makes it easier to manage “spot” cloud instances, allowing for immediate task rescheduling.
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers/).
  - Support for Docker image pull secrets.

### Networking
- Edge-LB 1.0. [View the documentation](https://docs.mesosphere.com/services/edge-lb/1.0/) [enterprise type="inline" size="small" /]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack - All networking components (minuteman, navstar, spartan) are aggregated into a single systemd unit called `dcos-net`. Please read this [note](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). [View the documentation](/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) to understand its usage.

[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Binary Secret files are now supported
  - Hierarchical access control is now supported.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics/).
- Unified logging API that provides simple access to container (task) as well as system component logs. [View the documentation](/1.11/monitoring/logging/logging-api/).

### Storage
- DC/OS Storage Service 0.1 (beta) - DSS users will be able to dynamically create volumes based upon profiles or policies to fine-tune their applications' storage requirements. This feature leverages the industry-standard Container Storage Interface (CSI) to streamline the development of storage features in DC/OS by Mesosphere and our community and partner ecosystems. [View the documentation](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /][enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported.
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed.
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.

## <a name="known-issues"></a>Known Issues and Limitations
- DCOS-9751	- Marathon fails to authenticate with Mesos master during disabled -> permissive upgrade.
- DCOS-18368 - The GUI installer has been retired in 1.11 and will no longer continue to function. It will be decommissioned in 1.12. For details of alternative installation methods, [view the documentation](https://docs.mesosphere.com/1.11/installing).
- DCOS-19047 - `dcos-secrets` service is unavailable during upgrade from 1.10.x to 1.11.
- DCOS_OSS-2132	- `dcos-log` does not handle the journald files rotation properly.
- INFINITY-3116	- Deleting failed mnist Tensorflow package never completes.

## <a name="fixed-issues"></a>Improvements and Major Issues Fixed Since 1.11.0 Release Candidate 4
- COPS-2201 - `dcos-diagnostics` no longer fails after running gen_resolvconf.py.
- DCOS-13066 - Rename the 3DT service to DC/OS Diagnostics.
- DCOS-19008 - The `exhibitor_address` configuration option can now be an IPv4 address without causing certificate verification errors.
- DCOS-19896 - Add `--linked` flag to `dcos cluster list`.
- DCOS-20351 - Add the `dcos-license` subcommand to `dcos-enterprise-cli`. [enterprise type="inline" size="small" /]
- DCOS-21130 - Make list of services visible in grid view of nodes.
- DCOS_OSS-671 - Improve filenames in the diagnostics bundle.
- DCOS_OSS-1275 - Add support for custom check executables during on-premises installation.
- DCOS_OSS-1321 - Search paths are configurable when executing check commands using `dcos-diagnostics check`.
- DCOS_OSS-1340 - Spartan "autoip" DNS resolves to host IP for UCR in bridge network.
- DCOS_OSS-1449 - Remove support for `--appId` from CLI.
- DCOS_OSS-1489 - Add support for cgroup blkio statistics in `dcos-metrics`.
- DCOS_OSS-2003 - Modify DC/OS overlay networking to work with systemd networkd.

**Note:** The Kubernetes package dependencies are documented [here](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install).
