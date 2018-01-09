---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.0 Beta 3
title: Release Notes for 1.11.0 Beta 3
menuWeight: 0
excerpt:
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;">

<h3>This beta release is for testing only and not to be used in production. It will only support new installations.</h3>
<h3>DC/OS 1.11.0 Beta 3 has a number of limitations that will be resolved at GA time:</h3>

<ul>
<li>Upgrades from 1.10 are not supported.</li>
<li>DC/OS 1.11 requires CLI version 0.6.x.
  <ul>
  <li><a href="/1.11/cli/uninstall/">Uninstall the existing CLI</a>.</li>
  <li>Install version 0.6.x using the <strong>Install CLI</strong> instructions in the dropdown in the upper left hand corner of the 1.11 DC/OS GUI.</li>
  </ul>
<strong>Note:</strong> CLI version 0.6.x is not compatible with DC/OS 1.10</li>
</ul>

<a name="new-features"></a>
# New features and capabilities

## Apache Mesos 1.5 and Marathon 1.6 Integrated.
- DC/OS 1.11 is is based on Mesos 1.5. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.11 is integrated with the latest release of Marathon, version 1.6. Resulting breaking changes and new features are documented below. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Networking
- IPv6 is now supported for Docker containers.
- Edge-LB 2.0. [enterprise type="inline" size="small" /]
  - Strict security mode is now supported.

[enterprise]
## Security
[/enterprise]

[enterprise]
## Storage
- DC/OS Storage Service now in beta. DC/OS 1.11 introduces a single, highly-available, control plane end point to manage and consume storage services and features within DC/OS.
- A Container Storage Interface (CSI) that enables you to connect to locally managed and 3rd party storage features via a common pluggable model.
- Volume profiles. You can now create a volume profile with your desired storage parameters, then apply it during volume creation. This simplifies and expedites volume creation.
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods).
[/enterprise]

## Metrics
- Metrics - The DC/OS metrics component now produces metrics in Prometheus format. [View the documentation](/1.11/metrics).

## Platform
- Fault domain awareness. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- Linked clusters. A cluster link is a _**unidirectional**_ relationship between a cluster and another cluster. You add and remove links from one cluster to another cluster using DC/OS CLI. Once a link is set up you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links). [enterprise type="inline" size="small" /]
- UCR - Added support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers).

## Updated DC/OS data services
- TLS auth for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported.
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed.
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpointd to relaunch a node in an idle command state for debugging purposes.
- New beta DC/OS Kafka ZooKeeper service. [View the documentation](/services/beta-zookeeper/index.md).
- You can now select a DC/OS data service version from a dropdown menu in the DC/UI.
- Improved scalability for all DC/OS data services.
- Non-essential tasks now supported for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. If non-essential tasks fail, the entire node will not fail.

# Breaking changes

- Upgrades from 1.10 to 1.11 are _not supported_ in 1.11 Beta 3.

# <a name="known-issues"></a>Known Issues and Limitations


# <a name="fixed-issues"></a>Major Issues Fixed in 1.11 Beta 3

- DCOS-16368 -  DC/OS Enterprise Secret Store no longer accepts secrets with uppercase letters in their paths. Secret paths with uppercase letters conflicted with use of the IAM API. [enterprise type="inline" size="small" /]
- DCOS-19573 - Bugix: Changes to unique constraints now supported in the UI.
- DCOS-19837 - Consolidate fault-domain scripts for all cloud providers into one script to support clusters with multiple cloud providers.
- DCOS-19896 - `--linked` flag added to `dcos cluster list` so users can see which clusters can be unlinked. [enterprise type="inline" size="small" /]
- DCOS-19955 - Enhanced cluster linking API and CLI experience. [enterprise type="inline" size="small" /]
- DCOS_OSS-1658 - `--verbose` flag added to upgrade script that prints all status and error messages to the console to enable upgrade debugging.
