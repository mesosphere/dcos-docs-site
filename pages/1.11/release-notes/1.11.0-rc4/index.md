---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.0 Release Candidate 4
title: Release Notes for 1.11.0 RC 4
menuWeight: 55
excerpt: Release notes DC/OS 1.11.0 Release Candidate 4
---

These are the release notes for DC/OS 1.11.0 Release Candidate 4.

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;">

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/1.11.0-rc4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

To download DC/OS Enterprise, contact: [Mesosphere Support](https://support.mesosphere.com).

<h3>This release candidate is for testing only and not to be used in production. </h3>


DC/OS 1.11 Release Candidate 4 has a number of limitations that will be resolved at GA time.
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
- DC/OS 1.11 introduces an implementation of the industry-standard Container Storage Interface (CSI) version 0.1, which enables developers (Mesosphere, community, and partners) to streamline the development of storage features within DC/OS by providing a common API between the Container Orchestrator (DC/OS) and the storage devices. [View the documentation](/services/beta-storage/0.1.0-beta). [enterprise type="inline" size="small" /]
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
- Upgrades from 1.10.5 to 1.11.0-rc4 are supported, but not recommended.
- Upgrades from 1.11.0-rc1 to 1.11.0-rc4 are _not supported_ in 1.11 Release Candidate 4.

# <a name="fixed-issues"></a>Improvements and Major Issues Fixed Since 1.11.0 Release Candidate 1
- COPS-2201 - Fix `dcos-diagnostics` crashing after running gen_resolvconf.py.
- COPS-2465 - License status is now consistent in a multi-master environment. [enterprise type="inline" size="small" /]
- DCOS-16510 - The version of HashiCorp Vault used by the `dcos-secrets`service has been updated from v0.5.2 to v0.8.3.
- DCOS-19050 -  If the Vault instance used by `dcos-secrets` seals itself, the service will now be able to unseal it automatically.
- DCOS-19500 - Fix cosmos/service/update failure when Marathon is deploying.
- DCOS-20064 - Support license parameters in Azure and AWS templates. [enterprise type="inline" size="small" /]
- DCOS-20396 - Test that bootstrap regenerates cert when old cert does not match new CSR.
- DCOS-20492 - Cluster sometimes comes up without license when using AWS CloudFormation templates. [enterprise type="inline" size="small" /]
- DCOS-20515 - Make licensing version-aware to prevent upgrade failures. [enterprise type="inline" size="small" /]
- DCOS-20569 - Include only public attributes of license on diagnostics bundle. [enterprise type="inline" size="small" /]
- DCOS-20628 - `dcos-vault`: fix deadlock in go-zookeeper library.
- DCOS-20676 - `csidevices`: fix lsblk parsing of empty string bool values.
- DCOS-20679 - Make licensing handle a cluster license renewal for same major version during a config upgrade. [enterprise type="inline" size="small" /]
- DCOS-20772 - Update znode creation scheme for storing license audit data.
- DCOS-21000 - Release Marathon plugin with resource full auth bug fix.
- DCOS-21045 - Update `dcos-cluster-linker` to not allow a self-link. [enterprise type="inline" size="small" /]
- DCOS-21095 - Turn IPv6 overlay off in IPv4 environment.
- DCOS_OSS-1587 - Support DC/OS install on non-root LVM volume.
- DCOS_OSS-2070 - Service is not accessible via l4lb VIP from local agent using UCR bridge mode.
- DCOS_OSS-2105 - UI can show stale task state due to dropped events (Related MESOS-8469 - Fix the problem with Mesos master dropping events in the operator API stream.)
- METRONOME-100 - Fix for Metronome restart causing duplication of jobs.
- METRONOME-190 - Add authorized launch queue.
- METRONOME-191 - Implement start deadline timeout.
- METRONOME-194 - Support FORBID concurrency policy.
- Updated marathon to 1.6.322 (https://github.com/dcos/dcos/pull/2473 | https://github.com/mesosphere/dcos-enterprise/pull/2278)
- Updated Mesos to 1.5.x 9840ae1 (https://github.com/dcos/dcos/pull/2472 | https://github.com/mesosphere/dcos-enterprise/pull/2263)

**Note:** The Kubernetes package dependencies are documented [here](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install).
