---
layout: layout.pug
navigationTitle:  Release Notes for 1.11.0
title: Release Notes for 1.11.0
menuWeight: 0
excerpt:
---

These are the release notes for DC/OS 1.11.0.

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/1.11.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

To download DC/OS Enterprise, contact: [Mesosphere Support](https://support.mesosphere.com).

DC/OS 1.11 includes many new capabilities with a focus on:
- Managing clusters across multiple clouds
- Production Kubernetes-as-a-service 
- Enhanced data security
- Updated data services

Provide any feedback on the new features and services at: [support.mesosphere.com](https://support.mesosphere.com).

# Contents
- [New Features and Capabilities](#new-features)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed](#fixed-issues)

<a name="new-features"></a>
## New Features and Capabilities

### Apache Mesos 1.5, Marathon 1.6, and Kubernetes 1.9 Integrated.
- DC/OS 1.11.0 is is based on Mesos 1.5. View the [Mesos changelog](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG).
- DC/OS 1.11.0 is integrated with the latest 1.6 release of Marathon. For more information about Marathon 1.6, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).
- DC/OS 1.11.0 supports the latest Kubernetes 1.9 Container Scheduler. For more information about Kubernetes 1.0 on DC/OS, consult the [Kubernetes on DC/OS changelog](https://docs.mesosphere.com/services/beta-kubernetes/0.4.0-1.9.0-beta).

### Platform
- Fault domain awareness. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- Linked clusters. A cluster link is a **unidirectional** relationship between a cluster and another cluster. You add and remove links from one cluster to another cluster using the DC/OS CLI. Once a link is set up you can easily switch between clusters using the CLI or UI. [View the documentation](/1.11/administering-clusters/multiple-clusters/cluster-links). [enterprise type="inline" size="small" /]
- Integrated Remote Regions. Enables “bursting” to take advantage of ephemeral cloud compute resources. [View the documentation](/1.11/deploying-services/fault-domain-awareness). [enterprise type="inline" size="small" /]
- [Multi-Region Management](/1.11/deploying-services/fault-domain-awareness). Enables a DC/OS Cluster to span multiple datacenters, clouds and remote branches while providing a unified management and control cluster.
- Decommission Node. Support for permanently decommissioning nodes enables easier maintenance and decommissioning “Spot” Cloud Instances after use allowing for immediate task rescheduling as opposed delayed task rescheduling.
- UCR
  - Support for Docker image garbage collection. [View the documentation](/1.11/deploying-services/containerizers).
  - Support for Docker image pull secrets.

### Networking
[enterprise]
- Edge-LB 1.0 RC candidate. [View the documentation](https://docs.mesosphere.com/services/edge-lb/1.0.0)
[/enterprise]
- IPv6 is now supported for Docker containers.
- Performance improvements to the DC/OS network stack. All networking components (minuteman, navstar, spartan) are aggregated into a single systemD unit called `dcos-net`. Please read the note on [networking software re-architecture](/1.11/networking/#a-note-on-software-re-architecture) to learn more about the re-factoring of the network stack.
- Configuration parameter `dns_forward_zones` now takes a list of objects instead of nested lists ([DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)). Please read the documentation for [dns_forward_zones](/1.11/installing/oss/custom/configuration/configuration-parameters/#dns-forward-zones) to understand its usage. 


[enterprise]
### Security
[/enterprise]
- Secrets Management Service
  - Binary Secret files are now supported
  - Hierarchical access control is now supported.

### Monitoring
- The DC/OS metrics component now produces metrics in [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) format. [View the documentation](/1.11/metrics).
- Unified Logging Endpoint to Collect Container (task) as well as System Component Logs.

### Storage
- DC/OS 1.11 introduces an implementation of the industry-standard Container Storage Interface (CSI) version 0.1, which enables developers (Mesosphere, community, and partners) to streamline the development of storage features within DC/OS by providing a common API between the Container Orchestrator (DC/OS) and the storage devices. [View the documentation](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/). [enterprise type="inline" size="small" /]
- Pods now support persistent volumes. [View the documentation](/1.11/deploying-services/pods).

**Note:** Because these storage features are beta in 1.11, they must be explicitly enabled. Beta features are not recommended for production usage, but are a good indication of the direction the project is headed.

### Updated DC/OS Data Services
- TLS encryption for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS is now supported.
- Fault domain awareness for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic and DC/OS HDFS. Use fault domain awareness to make your services highly available and to allow for increased capacity when needed.
- New API endpoint to pause a node for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. Use this endpoint to relaunch a node in an idle command state for debugging purposes.
- New beta DC/OS Kafka ZooKeeper service. [View the documentation](/services/beta-kafka-zookeeper).
- You can now select a DC/OS data service version from a dropdown menu in the DC/OS UI.
- Improved scalability for all DC/OS data services.
- Non-essential tasks now supported for DC/OS Kafka, DC/OS Cassandra, DC/OS Elastic, and DC/OS HDFS. If non-essential tasks fail, the entire node will not fail.

## <a name="known-issues"></a>Known Issues and Limitations
- DCOS-9751	- Marathon fails to authenticate with Mesos master during disabled -> permissive upgrade.
- DCOS-18368 - The GUI installer has been retired in 1.11 and will no longer continue to function. It will be decommissioned in 1.12. For alternative installation methods see: [installation documentation](https://docs.mesosphere.com/1.11/installing).
- DCOS-19047 - `dcos-secrets` service is unavailable during upgrade from 1.10.x to 1.11. 
- DCOS_OSS-2132	- `dcos-log` does not handle the journald files rotation properly.
- INFINITY-3116	- Deleting failed mnist Tensorflow package never completes.

## <a name="fixed-issues"></a>Improvements and Major Issues Fixed in 1.11.0
- COPS-2201 - `dcos-diagnostics` no longer fails after running gen_resolvconf.py.
- DCOS-13066 - Rename the 3DT service to DC/OS Diagnostics.
- DCOS-13325 - Added domain awareness to DC/OS installers.
- DCOS-14129	- Build DC/OS cluster linker service.
- DCOS-16234 - Add new version (v2) of logging API.
- DCOS_18165	- Support DC/OS on non-root LVM volumes.
- DCOS-18790	- Build new services for licensing and auditing DC/OS clusters.
- DCOS-18981 - Add a CLI command to mark an agent as gone.
- DCOS-19201 - Add binary data support to dcos security CLI.
- DCOS-19478 - Add commands to link and unlink clusters to mainline CLI.
- DCOS-19738 - Add CLI extensions for licensing.
- DCOS-19837 - Consolidate fault-domain scripts for all cloud providers into one script.
- DCOS-19896 - Add `--linked` flag to `dcos cluster list`.
- DCOS-20351 - Add the `dcos-license` subcommand to `dcos-enterprise-cli`. [enterprise type="inline" size="small" /]
- DCOS-21130 - Make list of services visible in grid view of nodes. 
- DCOS_OSS-671 - Improve filenames in the diagnostics bundle.
- DCOS_OSS-1275	- Add support for custom check executables during on-premises installation.
- DCOS_OSS-1321	- Search paths are configurable when executing check commands using `dcos-diagnostics check`.
- DCOS_OSS-1340	- Spartan "autoip" DNS resolves to host IP for UCR in bridge network.
- DCOS_OSS-1449	- Remove support for `--appId` from CLI.
- DCOS_OSS-1489	- Add support for cgroup blkio statistics in `dcos-metrics`.
- DCOS_OSS-2003 - Modify DC/OS overlay networking to work with systemd networkd.
- DCOS_OSS-2045	- Add Prometheus plugin and producer to `dcos-metrics`.

## <a name="fixed-issues"></a>Improvements and Major Issues Fixed in 1.11.0 Release Candidate 4
- COPS-2201 - Fix `dcos-diagnostics` crashing after running gen_resolvconf.py.
- COPS-2465 - License reporting is inconsistent. [enterprise type="inline" size="small" /]
- DCOS-19500 - Fix cosmos/service/update failure when Marathon is deploying.
- DCOS-20064 - Verify Azure and AWS advanced templates work with the licensing parameter. [enterprise type="inline" size="small" /]
- DCOS-20343 - Fix UI loading screen.
- DCOS-20396 - Test that bootstrap regenerates cert when old cert does not match new CSR.
- DCOS-20485 - Adjust implementation to address performance issues.
- DCOS-20492 - Cluster sometimes comes up without license when using AWS CloudFormation templates. [enterprise type="inline" size="small" /]
- DCOS-20515 - Make licensing version-aware to prevent upgrade failures. [enterprise type="inline" size="small" /]
- DCOS-20569 - Include only public attributes of license on diagnostics bundle. [enterprise type="inline" size="small" /]
- DCOS-20628 - `dcos-vault`: fix deadlock in go-zookeeper library.
- DCOS-20676 - `csidevices`: fix lsblk parsing of empty string bool values.
- DCOS-20679 - Make licensing handle a cluster license renewal for same major version during a config upgrade. [enterprise type="inline" size="small" /]
- DCOS-20772 - Limit znode creation.
- DCOS-21000 - Release Marathon plugin with resource full auth bug fix.
- DCOS-21045 - Update `dcos-cluster-linker` to not allow a self-link. [enterprise type="inline" size="small" /]
- DCOS-21095 - Turn IPv6 overlay off in IPv4 environment.
- DCOS_OSS-1587 - Support DC/OS install on non-root LVM volume.
- DCOS_OSS-2070 - Service is not accessible via l4lb VIP from local agent using UCR bridge mode.
- DCOS_OSS-2105 - UI can show stale task state due to dropped events (Related MESOS-8469 - Fix the problem with Mesos master dropping events in the operator API stream.)
- METRONOME-100 - Metronome restart causes duplication of jobruns.
- METRONOME-190 - Add authorized launch queue.
- METRONOME-191 - Implement start deadline timeout.
- METRONOME-194 - Support FORBID concurrency policy.
- Updated marathon to 1.6.322 (https://github.com/dcos/dcos/pull/2473 | https://github.com/mesosphere/dcos-enterprise/pull/2278)
- Updated Mesos to 1.5.x 9840ae1 (https://github.com/dcos/dcos/pull/2472 | https://github.com/mesosphere/dcos-enterprise/pull/2263)

## <a name="fixed-issues"></a>Improvements and Major Issues Fixed in 1.11.0 Release Candidate 1
- DCOS-16368 -  DC/OS Enterprise Secret Store no longer accepts secrets with uppercase letters in their paths. Secret paths with uppercase letters conflicted with use of the IAM API. [enterprise type="inline" size="small" /]
- DCOS-19573 - Add support for changes to unique constraints in the UI.
- DCOS-19837 - Consolidate fault-domain scripts for all cloud providers into one script to support clusters with multiple cloud providers.
- DCOS-19896 - Add `--linked` flag to `dcos cluster list` so users can see which clusters can be unlinked. [enterprise type="inline" size="small" /]
- DCOS-19955 - Enhance API and CLI experience for linking clusters. [enterprise type="inline" size="small" /]
- DCOS_OSS-1658 - Add `--verbose` flag to upgrade script that prints all status and error messages to the console to enable upgrade debugging.
