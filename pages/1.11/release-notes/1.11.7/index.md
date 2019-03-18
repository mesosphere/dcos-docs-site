---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.7
title: Release Notes for 1.11.7
menuWeight: 15
excerpt: Release notes for DC/OS 1.11.7
---

DC/OS 1.11.7 was released on November 1, 2018. 

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.7/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]


DC/OS 1.11.7 includes the following components:
- Apache Mesos 1.5.x [change log](https://github.com/apache/mesos/blob/2ead30d/CHANGELOG).
- Marathon 1.6.564 [change log](https://github.com/mesosphere/marathon/tree/3fa693b32).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.4).


# Issues Fixed in DC/OS 1.11.7

## GUI
- DCOS-20222 - Add an error message when environment variables are input without keys. 
- DCOS-42365 - Set total resource counts to display in the pods table.
- DCOS_OSS-1961 - Secure pod container fields to prevent instances of unprompted swallowing when pod is edited via JSON Editor. 

## Marathon
- DCOS_OSS-4193 - Resolve [MSPH-2018-0004](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004)(Mesosphere Customer Advisory) where Marathon fails to launch if the first DC/OS master is down with the introduction of ping zk-1 in DC/OS 1.11.5.

## Mesos
- COPS-3172/DCOS-40120/DCOS-42667 - Fix instances where parent containers may get stuck in `DESTROYING` state when there is a simultaneous health check running to create nested containers.

## Metrics
- DCOS-39103 - Consolidate DC/OS metrics agent service error messages in instances when the Docker daemon becomes unresponsive.
- DCOS_OSS-3918 - Downrate logs to debug in occurrences of NaN data point values to reduce log size and free disk space. 

## Platform
- DCOS_OSS-4127 - Add additional data (timestamp for `dmesg`, `timedatectl`, distro version, systemd unit status, pods endpoint) into DC/OS diagnostics bundle.

[enterprise]
## Security
[/enterprise]
- DCOS-42156 - Add root permissions to `dcos_marathon` in order to launch MoM.
- DCOS-42814 - Upgrade CockroachDB from 1.1.8 to 1.1.9.

# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).

## New Features and Capabilities

### Platform
- Multi-region management - Enables a DC/OS cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between one cluster and another. You can add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Decommission nodes - Support for permanently decommissioning nodes makes it easier to manage `spot` cloud instances, allowing for immediate task rescheduling. [View the documentation](/1.11/hybrid-cloud/features/decommission-nodes/)
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers/).
  - Support for Docker image pull secrets. [View the documentation](/1.11/installing/ent/custom/configuration/configuration-parameters/#cluster-docker-credentials). An example for Docker credentials is [here](/1.11/installing/ent/custom/configuration/examples/#docker-credentials). [enterprise type="inline" size="small" /]

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

<p class="message--note"><strong>NOTE: </strong>Because these storage features are beta in 1.11, they must be explicitly enabled in the config.yaml file when installing DC/OS. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.</p>

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/services/kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.


