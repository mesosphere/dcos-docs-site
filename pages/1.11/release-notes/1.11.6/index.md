---
layout: layout.pug
navigationTitle: Release Notes for 1.11.6
title: Release Notes for 1.11.6
menuWeight: 10
excerpt: Release notes for DC/OS 1.11.6
---

DC/OS 1.11.6 was released on September 25, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.6/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]


DC/OS 1.11.6 includes the following components:
- Apache Mesos 1.5.x [change log](https://github.com/apache/mesos/blob/5a7ad47e8fc1a14101e47a29eb8e7e2a20d959c5/CHANGELOG).
- Marathon 1.6.549 [change log](https://github.com/mesosphere/marathon/tree/aabf74302).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.4).

# Notable Changes in DC/OS 1.11.6
- DCOS-22310/DCOS-40495/DCOS-41282 - Update DC/OS UI for [1.11+v1.23.0](https://github.com/dcos/dcos-ui/blob/1.11+v1.23.0/CHANGELOG.md). [oss type="inline" size="small" /]
- DCOS_OSS-4106/DCOS_OSS-4109 - Bump ZooKeeper to [3.4.13](https://zookeeper.apache.org/doc/r3.4.13/releasenotes.html). 
- Update DC/OS UI for [1.11+v1.23.0+f17c3335](https://github.com/mesosphere/dcos-ui-plugins-private/compare/1.11+v1.20.0+1c67f4b5...1.11+v1.23.0+f17c3335). [enterprise type="inline" size="small" /]

# Customer Advisory
- [Removing the patch for Marathon failing to start if the first DC/OS is not available](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004). The patch for Marathon failing to start under certain DNS failure conditions is not required after upgrading to DC/OS 1.11.6 with Marathon version 1.6.541 (or later). 

# Issues Fixed in DC/OS 1.11.6

## CLI 
- DCOS_OSS-3958/DCOS_OSS-3978 - Add information about `/containers`, `/quota`, `/proc`, and `ps aux www`to diagnostics bundle.

## Data Services
- COPS-3371/DCOS-38328 - Remove health check directories for Kafka 2.0.4-1.0.0.

## GUI
- DCOS-40779 - Fix movement of form control icons in the search bar. 

## Marathon
- DCOS-41198 - Replace `poll_marathon_for_app_deployment()` method with `wait_for_deployments_complete()` method in dcos-test-utils.
- DCOS_OSS-4193 - Fix for [Marathon not starting if the first DC/OS Master is down](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004).
- MARATHON-8095 - Fix  PATCH call against inactive HA node.
- MARATHON-8381 - Add new exit codes for Marathon. 
- MARATHON-8428 - Fix SSL readiness check with self-signed cert. Bump [Marathon on 1.11](https://github.com/mesosphere/marathon/tree/aabf74302).

## Mesos
- COPS-3527/DCOS_OSS-3921 - Check cache when creating Mesos resources using `make_disk_resources.py`.
- COPS-3574/DCOS-19598/DCOS-40317/DCOS-41375 - Bump Mesos to nightly [1.5.x dd68c0b](https://github.com/mesosphere/mesos/blob/dd68c0b/CHANGELOG).
- DCOS-24595/DCOS_OSS-3991 - Add Mesos patches for per-framework metrics.
- DCOS-40162 - Fix container launch failures that occurred due to Mesos-bridge running out of IPs.

## Networking
- COPS-3279/COPS-3576/DCOS-37703/DCOS-37703/DCOS-39703 - Fix erroneous values in service addresses stats and enable metrics forwarding.
- COPS-3472/DCOS-38932 - Enable access to Marathon app via overlap network. 
- COPS-3540/COPS-3517/COPS-3774/DCOS-39203/DCOS-39517/DCOS-41358 - Fix delay in overlay configuration.
- COPS-3585/COPS-3701/DCOS-38600/DCOS-42215 - Fix deadlock issue when SSL sockets simultaneously send/receive data. 
- COPS-3605/DCOS_OSS-3707 - Bump mesos-module to include the fix for CoreOS 1800.7.0.
- DCOS_OSS-3697 - Fix connectivity issue between bridge and overlay networks.
- DCOS-39707 - Fix clustering issues with `etcd`.
- DCOS-40702 - Fix networking changes to support CoreOS v1800.7.0.

## Platform
 - DCOS-40245 - Admin Router: Change the `adminrouter_auth_cache_enabled` configuration option default to `true`. [enterprise type="inline" size="small" /]
 - DCOS_OSS-4107 - Bump ZooKeeper to [3.4.13](https://zookeeper.apache.org/doc/r3.4.13/releasenotes.html).
 
 
[enterprise]
## Security
[/enterprise]
- DCOS-40374/DCOS-40391/DCOS-42192 - Add a new method called `ensure_permissions` that modifies service account permissions to match desired state.

# Security Updates
- DCOS_OSS-4105 - Update OpenSSL to version 1.0.2p.

**Note:** New Docker version is supported on CoreOS 1800.7.0. See [compatibility matrix](https://docs.mesosphere.com/version-policy/) for further information.

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
  -  Support for Docker image pull secrets. [View the documentation](/1.11/installing/ent/custom/configuration/configuration-parameters/#cluster-docker-credentials). An example for Docker credentials is [here](/1.11/installing/ent/custom/configuration/examples/#docker-credentials). [enterprise type="inline" size="small" /]

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


