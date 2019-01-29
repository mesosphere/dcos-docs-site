---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.0 Release Candidate 1
title: Release Notes for 1.11.0 RC 1
menuWeight: 50
excerpt: Release notes for DC/OS 1.11.0 release candidate 1
---

These are the release notes for DC/OS 1.11.0 Release Candidate 1.

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid; border-right: thin solid;">

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/1.11.0-rc1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

To download DC/OS Enterprise, contact: [Mesosphere Support](https://support.mesosphere.com/hc/en-us/articles/213198586).

<h3>This release candidate is for testing only and not to be used in production. </h3>


DC/OS 1.11.0 Release Candidate 1 has a number of limitations that will be resolved at GA time.
<ul>
<li>DC/OS 1.11 requires CLI version 0.6.x.
  <ul>
  <li><a href="/1.11/cli/uninstall/">Uninstall the existing CLI</a>.</li>
  <li>Install version 0.6.x using the <strong>Install CLI</strong> instructions in the dropdown in the upper left hand corner of the 1.11 DC/OS GUI.</li>
  </ul>
<strong>Note:</strong> CLI version 0.6.x is not compatible with DC/OS 1.10</li>
</ul>
Please try out the new features and updated data services. Provide any feedback through our support channel: <a href="https://support.mesosphere.com/">support.mesosphere.com</a>.
</td> </tr> </table>

<a name="new-features"></a>
# New features and capabilities

## Apache Mesos 1.5, Marathon 1.6, and Kubernetes 1.9 Integrated.
- DC/OS 1.11.0 is is based on Mesos 1.5. View the [Mesos changelog](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG).
- DC/OS 1.11.0 is integrated with the latest 1.6 release of Marathon. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
- DC/OS 1.11.0 supports latest Kubernetes 1.9 Container Scheduler. For more information about Kubernetes 1.0 on DC/OS, [view the documentation](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3).

## Platform
- Fault domain awareness. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- Linked clusters. A cluster link is a _**unidirectional**_ relationship between a cluster and another cluster. You add and remove links from one cluster to another cluster using DC/OS CLI. Once a link is set up you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links/). [enterprise type="inline" size="small" /]
- Integrated Remote Regions. Enables “Bursting” to take advantage of ephemeral cloud compute resources. [View the documentation](/1.11/deploying-services/fault-domain-awareness/). [enterprise type="inline" size="small" /]
- [Multi-Region Management](/1.11/deploying-services/fault-domain-awareness/). Enables a DC/OS Cluster to span multiple datacenters, clouds and remote branches while providing a unified management and control cluster.
- Decommission Node. Support for permanently decommissioning nodes enables easier maintenance and decommissioning “Spot” Cloud Instances after use allowing for immediate task rescheduling as opposed delayed task rescheduling.
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers/).
  - Support for Docker image pull secrets.

## Networking
[enterprise]
- Edge-LB 1.0 RC candidate. [View the documentation](https://docs.mesosphere.com/services/edge-lb/1.0/)
[/enterprise]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack. All networking components (minuteman, navstar, spartan) are aggregated into a single systemD unit called `dcos-net`. Please read the note on [networking software re-architecture](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.


[enterprise]
## Security
[/enterprise]
- Secrets Management Service
  - Binary Secret files are now supported
  - Hierarchical access control is now supported.

## Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics/).
- Unified Logging Endpoint to Collect Container (task) as well as System Component Logs.

## Storage
- DC/OS 1.11 introduces an implementation of the industry-standard Container Storage Interface (CSI) version 0.1, which enables developers (Mesosphere, community, and partners) to streamline the development of storage features within DC/OS by providing a common API between the Container Orchestrator (DC/OS) and the storage devices. [enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods/).

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

## Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported.
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed.
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New beta DC/OS Kafka ZooKeeper service. [View the documentation](/services/beta-kafka-zookeeper/).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.

# <a name="known-issues"></a>Known Issues and Limitations
- Upgrades from 1.10 to 1.11 are _not supported_ in 1.11.0 Release Candidate 1.
- DCOS-19047 - The `dcos-secrets` service is unavailable during upgrade from 1.10.x to 1.11.0. [enterprise type="inline" size="small" /]


# <a name="fixed-issues"></a>Improvements and Major Issues Fixed in 1.11.0 Release Candidate 1
- DCOS-19573 - Add support for changes to unique constraints in the UI.
- DCOS-19837 - Consolidate fault-domain scripts for all cloud providers into one script to support clusters with multiple cloud providers.
- DCOS-19896 - Add `--linked` flag to `dcos cluster list` so users can see which clusters can be unlinked. [enterprise type="inline" size="small" /]
- DCOS-19955 - Enhance API and CLI experience for linking clusters. [enterprise type="inline" size="small" /]
- DCOS_OSS-1658 - Add `--verbose` flag to upgrade script that prints all status and error messages to the console to enable upgrade debugging.
- DCOS_OSS-1733 - The configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists.
- DCOS_OSS-2130 - `systemd-networkd` must be enabled for DC/OS networking to work with CoreOS.

**Note:** The Kubernetes package dependencies are documented [here](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install).
