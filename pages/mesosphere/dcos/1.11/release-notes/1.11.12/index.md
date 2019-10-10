---
layout: layout.pug
navigationTitle: Release Notes for 1.11.12
title: Release Notes for 1.11.12
menuWeight: 5
excerpt: Release notes for DC/OS 1.11.12
---

DC/OS version 1.11.12 was released on October 10, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.11/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.11.11/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

DC/OS 1.11.11 includes the following components:
- Apache Mesos 1.5.4 [change log](https://github.com/apache/mesos/blob/6a8b61b59498dcea64d9380a233d517ce65dc2ef/CHANGELOG).
- Marathon 1.6.585 [change log](https://github.com/mesosphere/marathon/blob/3e0898228572e5c758c4ae17838fc5a9b0459e92/changelog.md).
- Metronome 0.6.18 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.5).

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 



# Issues Fixed in DC/OS 1.11.12
<!-- The issues that have been fixed in DC/OS 1.11.12 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference. -->

- Updated Signal service to [release 1.6.0](https://github.com/dcos/dcos-signal/releases/tag/1.6.0)

- Updated to [Mesos 1.5.x](https://github.com/apache/mesos/blob/14904009a193636bb715115419bfa2f235beb33f/CHANGELOG)

- Updated to [Metronome 0.6.33](https://github.com/dcos/metronome/tree/b8a73dd)

- Updated DC/OS UI to [1.11+v1.26.8](https://github.com/dcos/dcos-ui/releases/tag/1.11+v1.26.8).

# Fixed and improved issues

- Fix preflight Docker version check failing for docker 1.19. (DCOS-56831)

- [Metronome] Querying run detail with `embed=history`, `successfulFinishedRuns` and `failedFinishedRuns` contains new field tasks which is an array of `taskId`s of that finished run. This will allow users to query task IDs even for finished job runs.

- [Metronome] Fixes Metronome where it did not use the revive operation.

- [Metronome] Fixes daylight saving issues.

- DC/OS Net: Fix support for big sets in the ipset manager. (COPS-5229)

- Remove nogroup creation. (COPS-5220)

# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).

## New Features and Capabilities in DC/OS 1.11

### Platform
- Multi-region management - Enables a DC/OS cluster to span multiple datacenters, clouds, and remote branches while providing a unified management and control cluster. [View the documentation](/mesosphere/dcos/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters - A cluster link is a unidirectional relationship between one cluster and another. You can add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up, you can easily switch between clusters using the CLI or UI. [View the documentation](/mesosphere/dcos/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Fault domain awareness - Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/mesosphere/dcos/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Decommission nodes - Support for permanently decommissioning nodes makes it easier to manage `spot` cloud instances, allowing for immediate task rescheduling. [View the documentation](/mesosphere/dcos/1.11/hybrid-cloud/features/decommission-nodes/)
- UCR
  - Support for Docker image garbage collection. [View the documentation](/mesosphere/dcos/1.11/deploying-services/containerizers/).
  - Support for Docker image pull secrets. [View the documentation](/mesosphere/dcos/1.11/installing/production/advanced-configuration/configuration-reference/#cluster-docker-credentials). An example for Docker credentials is [here](/mesosphere/dcos/1.11/installing/production/deploying-dcos/configuration/examples/#docker-credentials). [enterprise type="inline" size="small" /]

### Networking
- Edge-LB 1.0. [View the documentation](/mesosphere/dcos/services/edge-lb/1.0/). [enterprise type="inline" size="small" /]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack - All networking components (minuteman, navstar, spartan) are aggregated into a single systemd unit called `dcos-net`.  Read this [note](/mesosphere/dcos/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). [View the documentation](/mesosphere/dcos/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) to understand its usage.

[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Secrets can now be binary files in addition to environment variables.
  - Hierarchical access control is now supported.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/mesosphere/dcos/1.11/metrics/).
- Unified logging API provides simple access to container (task) and system component logs. [View the documentation](/mesosphere/dcos/1.11/monitoring/logging/logging-api/).

### Storage
- DC/OS Storage Service 0.1 (beta) - DSS users will be able to dynamically create volumes based upon profiles or policies to fine-tune their applications storage requirements. This feature leverages the industry-standard Container Storage Interface (CSI) to streamline the development of storage features in DC/OS by Mesosphere and our community and partner ecosystems. [View the documentation](/mesosphere/dcos/services/storage/latest/).[enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/mesosphere/dcos/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

<p class="message--note"><strong>NOTE: </strong>Because these storage features are beta in 1.11, they must be explicitly enabled in the config.yaml file when installing DC/OS. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.</p>

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported. [enterprise type="inline" size="small" /]
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [enterprise type="inline" size="small" /]
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New DC/OS Kafka ZooKeeper service. [View the documentation](/mesosphere/dcos/services/kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.
