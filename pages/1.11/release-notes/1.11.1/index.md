---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.1
title: Release Notes for 1.11.1
menuWeight: 0
excerpt:
---

These are the release notes for DC/OS 1.11.1.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

# <a name="issues-fixed"></a>Improvements and Issues Fixed in DC/OS 1.11.1 

- INFINITY-3331 - Fixed cleaning up other framework's volumes.
- DCOS_OSS-2292 - Fixed a situation where dcos task --follow task might crash.
- DCOS_OSS-2247 - Fixed bug in dcos-checks to treat command timeout as a failed check.
- DCOS_OSS-2210 - Fixed an edge case as of which the history service would crash-loop.
- DCOS_OSS-2087 - Cosmos: Improved readability on user facing messages during service uninstallation.
- DCOS_OSS-1759 - Cosmos: Updated package-manager.yaml to fix the schema error in package management API.
- DCOS-21305 - Introduced 'minimal DC/OS version' when installing universe packages (e.g., cannot install a package which requires DC/OS 1.11 on DC/OS 1.10).
- DCOS-21337 - DC/OS UI: Improved error handling when consuming the Mesos event streaming HTTP API.
- DCOS-21266 - DC/OS UI: Fixed file navigation when browsing task sandbox.
- DCOS-21128 - DC/OS UI: Fixed a scenario in which the services tab crashed after uninstalling a service.
- DCOS-19648 - Added a placement constraint validator to the service creation view.
- INFINITY-3358 - DC/OS UI: Implemented a region picker for region awareness.
- DCOS_OSS-2229 - Bumped dcos-net. Performance improvements and bug fixes in [lashup](https://github.com/dcos/lashup).
- DCOS-21683 - Fixed a rare IAM database deadlock as of which the cluster installation might fail.
- CORE-1447 - Fixed a bug in which, under certain conditions, mesos would never refresh its token.
- DCOS-21359 - Prevented an uninstalled service to break the UI when the "remove" modal was open.
- DCOS_OSS-1878 - Prevented dcos-checks from ignoring the value of  --detect-ip flag when looking for the location of IP detect script.
- DCOS_OSS-2162 - Modified mesos modules to accept ZK configuration stored in files.

# <a name="notable-changes"></a>Notable Changes in DC/OS 1.11.1 
- DCOS_OSS-2130 - Support for CoreOS 1632.2.1.
- DCOS-21938 - Bumped Mesos SHA to the latest 1.5.x version.[changelog](https://github.com/apache/mesos/blob/b0a33cb782db57d054f68335c8126ecae078b238/CHANGELOG).
- DCOS-21703 - Added integration tests for DC/OS Enterprise Exhibitor checks.
- DCOS-21000 - Fixed Marathon's authorization logic to support the 'full' action. [enterprise type="inline" size="small" /]
- DCOS-19073 - Stores ZK configuration in files thus preventing their contents to appear in logs.


# Intergrated Technologies 
Apache Mesos 1.5, Marathon 1.6, and Kubernetes 1.9 Integrated.
- DC/OS 1.11.0 is based on Mesos 1.5. View the [Mesos changelog](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG).
- DC/OS 1.11.0 is integrated with the latest 1.6 release of Marathon. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
- DC/OS 1.11.0 supports the latest Kubernetes 1.9 Container Scheduler. For more information about Kubernetes 1.0 on DC/OS, [view the documentation](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3).

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
- Performance improvements to the DC/OS network stack - All networking components (minuteman, navstar, spartan) are aggregated into a single systemd unit called `dcos-net`. Please read this [note](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). [View the documentation](/1.11/installing/oss/custom/configuration/configuration-parameters/#dns-forward-zones) to understand its usage.

[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Binary Secret files are now supported
  - Hierarchical access control is now supported.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics).
- Unified logging API that provides simple access to container (task) as well as system component logs. [View the documentation](/1.11/monitoring/logging/logging-api/logging-v2/).

### Storage
- DC/OS Storage Service 0.1 (beta) - DSS users will be able to dynamically create volumes based upon profiles or policies to fine-tune their applications' storage requirements. This feature leverages the industry-standard Container Storage Interface (CSI) to streamline the development of storage features in DC/OS by Mesosphere and our community and partner ecosystems. [View the documentation](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /][enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods).[beta type="inline" size="small" /]

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.


## <a name="known-issues"></a>Known Issues and Limitations
- DCOS-9751	- Marathon fails to authenticate with Mesos master during disabled -> permissive upgrade.
- DCOS-18368 - The GUI installer has been retired in 1.11 and will no longer continue to function. It will be decommissioned in 1.12. For details of alternative installation methods, [view the documentation](https://docs.mesosphere.com/1.11/installing).
- DCOS-19047 - `dcos-secrets` service is unavailable during upgrade from 1.10.x to 1.11. 
- DCOS_OSS-2132	- `dcos-log` does not handle the journald files rotation properly.
- INFINITY-3116	- Deleting failed mnist Tensorflow package never completes.
