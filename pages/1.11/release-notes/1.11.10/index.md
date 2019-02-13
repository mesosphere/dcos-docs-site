---
layout: layout.pug
navigationTitle: Release Notes for 1.11.10
title: Release Notes for 1.11.10
menuWeight: 4
excerpt: Release notes for DC/OS 1.11.10
---

DC/OS Version 1.11.10 was released on February 12, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.10/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.11.10/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

DC/OS 1.11.10 includes the following components:
- Apache Mesos 1.5.3 [change log](https://github.com/apache/mesos/blob/5f6225bd6e039c633b7758f02d2b5fbabc8e0169/CHANGELOG).
- Marathon 1.6.567 [change log](https://github.com/mesosphere/marathon/tree/2d8b3e438).
- Metronome 0.4.5 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.5).

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues Fixed in DC/OS 1.11.10

This release of DC/OS 1.11.10 addresses a security vulnerablity for container runtimes as identified by the RunC community and registered in the [Common Vulnerabilities and Exposures (CVR)](https://cve.mitre.org/) database.

For information about other issues fixed or known issues for the most recent release of DC/OS 1.11 prior to this security fix, see the [release notes 1.11.9](https://docs.mesosphere.com/1.11/release-notes/1.11.9/).

## Mesos 
- DCOS-48052 - An update to the containerizer launch binary prevents a malicious user from exploiting the `init` helper function used by container runtimes--including DockerD, containerD, and UCR. Without this change, a malicious user could gain access to a container's root-level permissions and use those permissions to execute potentially malicious code on the host.

    This issue has been reported by the RunC community (CVE-2019-5736) and affects the Docker Engine and Mesosphere Kubernetes Engine (MKE) container runtime components. The issue has also been reported by the Apache Mesos community for the Mesosphere Universal Container Runtime (UCR). All existing versions of DC/OS, Mesosphere Kuberentes Engine, and Docker Engine are affected by this vulnerability. However, this vulnerability does not affect DC/OS clusters or UCR containers if the cluster runs using the `strict` security mode and uses the default `nobody` user account to launch UCR containers.

    For additional information about this vulnerability and its effect on DC/OS, see [Container runtime vulnerability](https://support.mesosphere.com/s/article/Known-Issue-Container-Runtime-Vulnerability-MSPH-2019-0003) and the [Docker Engine release notes](https://docs.docker.com/engine/release-notes/).


# About DC/OS 1.11

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds. [enterprise type="inline" size="small" /]
- Production Kubernetes-as-a-service.
- Enhanced data security. [enterprise type="inline" size="small" /]
- Updated data services.

Provide feedback on the new features and services at [support.mesosphere.com](https://support.mesosphere.com).

## New Features and Capabilities in DC/OS 1.11

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
