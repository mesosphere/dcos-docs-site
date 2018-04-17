---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.1
title: Release Notes for 1.11.1
menuWeight: 0
excerpt:
---

These are the release notes for DC/OS 1.11.1.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]


DC/OS 1.11 includes many new capabilities, with a focus on:
- Managing clusters across multiple clouds
- Production Kubernetes-as-a-service
- Enhanced data security
- Updated data services

Provide feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).

# Contents
- [New Features and Capabilities](#new-features)
- [Issues Fixed](#issues-fixed)
- [Notable Changes](#notable-changes)

<a name="new-features"></a>
## New Features and Capabilities

### Apache Mesos 1.5, Marathon 1.6, and Kubernetes 1.9 Integrated.
- DC/OS 1.11.0 is based on Mesos 1.5. View the [Mesos changelog](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG).
- DC/OS 1.11.0 is integrated with the latest 1.6 release of Marathon. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
- DC/OS 1.11.0 supports the latest Kubernetes 1.9 Container Scheduler. For more information about Kubernetes 1.0 on DC/OS, [view the documentation](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3).

### Platform
- Multi-region management - Enables a DC/OS Cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between a cluster and another cluster. You add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- Decommission node - Support for permanently decommissioning nodes makes it easier to manage “spot” cloud instances, allowing for immediate task rescheduling.
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers).
  - Support for Docker image pull secrets.

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
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported.
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed.
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.

## <a name="issues-fixed"></a>Improvements and Issues Fixed in DC/OS 1.11.1 Release

- INFINITY-3331 - Fixed cleaning up other framework's volumes.
- DCOS_OSS-2292 - Fixed crashes on empty lines for DC/OS CLI.
- DCOS_OSS-2255 - Fixed dcos-installer-ui package failure to build.
- DCOS_OSS-2247 - Fixed fatal error on checks that exceeded timeout on dcos-diagnostic service.
- DCOS_OSS-2223 - Added encoders to support package registry. Fixed comsos to initialize empty objects for optional json elements from json schema.
- DCOS_OSS-2210 - Ensured that cache timestamps are well-formed.
- DCOS_OSS-2184 - Removed an invalid dns record for marathon.mesos.
- DCOS_OSS-2087 - Improved readability on user facing messages during service uninstallation.
- DCOS_OSS-1759 - Updated package-manager.yaml to fix the schema error in packaage management API.
- DCOS-21305 - Added a feature on DC/OS to support the minimal requested version when installing universe packages(cannot install a package which requires 1.11 on 1.10).
- DCOS-21337 - Added linearBackoff retry to the Mesos stream.
- DCOS-21266 - Fixed file navigation in the UI.
- DCOS-21128 - Fixed uninstalling failing service breaks the services tab.
- DCOS-20680 - Phrased the license violation message on banners.
- DCOS-19648 - Added placement constraint validator to make sure the operator/ field combo is unique.
- INFINITY-3358 - Implemented UI with region picker.

## <a name="notable-changes"></a>Notable Changes in DC/OS 1.11.1 Release
- DCOS_OSS-2229 - Bumped dcos-net. Performance improvements and bug fixes in [lashup](https://github.com/dcos/lashup).
- DCOS_OSS-2162 - Bumped mesos modules enabling file based ZK configuration.
- DCOS_OSS-2130 - Support for CoreOS 1632.2.1.
- DCOS_OSS-1878 - Prevented dcos-checks from ignoring the value of  --detect-ip flag when looking for the location of IP detect script.
- DCOS-21938 - Bumped Mesos SHA to the latest 1.5.x version.[changelog](https://github.com/apache/mesos/blob/b0a33cb782db57d054f68335c8126ecae078b238/CHANGELOG).
- DCOS-21703 - Added integration tests for DC/OS Enterprise Exhibitor checks.
- DCOS-21359 - Prevented an uninstalled service to break the UI when the "remove" modal was open.
- DCOS-21000 - Supported Marathon Security Plugin for 1.11.
- DCOS-19157 - Fixed SAML integration tests for 1.11.
- DCOS-19073 - Bumped Mesos modules enabling file based ZK configuration.
- CORE-1447 - Bumped version of dcos-ee-mesos-modules which included an update to the retry logic of the Mesos authorizer to better handle failed login attempts with the DC/OS IAM service.
- DCOS-21683 - Bumped CockroachDB to v1.1.7 version.
