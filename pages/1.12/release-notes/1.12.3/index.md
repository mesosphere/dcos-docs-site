---
layout: layout.pug
navigationTitle: Release Notes for 1.12.3
title: Release Notes for 1.12.3
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.3
---

DC/OS Version 1.12.3 was released on March 14, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.3 includes the following components:
- Apache Mesos 1.7.x [change log](https://github.com/apache/mesos/blob/4f21147a9334ef9ed84dcf11742ce448062f3ec/CHANGELOG).
- Marathon 1.7.203 [change log](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md).
- Metronome 0.5.71 [change log](https://github.com/dcos/metronome/blob/391637cc19cd6136e8733ff8b684aed31b2cf672/changelog.md).

<!-- <p class="message--note"><strong>NOTE: </strong>DC/OS 1.12.1 release supports new CoreOS and Docker versions as listed in the <a href="../../../version-policy">compatibility matrix</a>.</p> -->

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues Fixed in DC/OS 1.12.3
The issues that have been fixed in DC/OS 1.12.3 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## Command-Line Interface (CLI)
- DCOS-42928 - This release includes `docker ps` output in `dcos-diagnostic` bundle.

## GUI
- DCOS-45863 - Currently, the `Settings/LDAP Directory/Add Directory/Authentication` dialog has a mandatory `lookup-dn` and an optional `lookup-password`. This release provides a possibility to select between `Anonymous Bind` and `LDAP Credentials` that translates to the following:
    - If `Anonymous Bind` is selected, the `JSON` sent to Bouncer `/ldap/config` API has no `lookup-dn` or `lookup-password` field.
    - If `LDAP Credentials` is selected, use the current behavior. The `JSON` sent to Bouncer `/ldap/config` API has `lookup-dn` and `lookup-password` field. The `lookup-password` field may be an empty string.

## Installation
 - COPS-4282, DCOS_OSS-4613 - If you run the `dcos_generate_config` command with the `-validate` option, the command validates the configuration settings in your `config.yaml` file. In some cases, this option issued warning messages that validation failed for parameters that are no longer used. For example, some SSH parameters, such as `ssh_key_path` and `ssh_user`, have been deprecated. Previously, if you ran `dcos_generate_config` with the `-validate` option to check your configuration settings and these parameters were not specified, the command reported that the validation of configuration parameters had failed. With this release, the `--validate` option does not return validation failure messages for parameters that are no longer required for installation.

- DCOS-15890 - The Preflight check on advance installer shows misleading information. This release improves an error message in case Docker is not running at the start of installation.

## Marathon
- COPS-3554 - The watcher loop process monitors and re-registers (if necessary) the Marathon leader after re-election.

- COPS-3593, DCOS_OSS-4193 - In previous releases, you might have services that are managed by Marathon unable to restart if the container crashes or under certain DNS failure conditions. For example, restarting services might fail if the first ZooKeeper node or first DC/OS master is unreachable. Because this problem affects high availability for Marathon, a workaround (ping zk-1) was introduced for DC/OS 1.11.5 and 1.11.6 to address the issue. In this release, the underlying issue is resolved and you can safely remove the workaround if you have it deployed. For background information about the issue and the steps to remove the workaround, see [removing the patch for Marathon failing to start if the first DC/OS is not available](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004).

## Mesos
- DCOS-46554 - This change forces Mesos master to have port resources in every offer unless the offer contains disks. This helps to reduce the number of offers with no ports which are not useful for most frameworks.

## Metrics
- DCOS-47991, DCOS_OSS-4760 - In the MWST 1.13, there are gaps in various Mesos Grafana dashboards. Further investigation revealed that metrics were occasionally missing the `framework_name=<framework_name>` tag but with an additional `role_name=<framework_name>` tag. This exercise revealed a bug in the Mesos input plugin in Telegraf that may be causing this issue. The solution is to fix the hashing function to avoid potentially mapping fields to wrong tags.

- DCOS_OSS-4624 - Currently, you cannot view the disk usage of a Mesos persistent volume (only Mesos sandbox is shown) for instance and the disk space used by Prometheus. This release adds the missing container metrics such as `DiskStatistics`, `Perf`, `NetTrafficControlStatistics` and `NetSNMPStatistics` from `mesos-go` and also adds all available `blkio stats`.

## Networking
- COPS-3279, COPS-3576, DCOS-37703, DCOS-37703, DCOS-39703 - Service endpoint values and service address-based statistics return the correct number of successful and failure connections when you enable the `statsd` metrics input plugin and view backend activity.

[enterprise]
## Security
[/enterprise]
- DCOS-46381, DCOS-47348 - The Marathon app definition format has changed from [1.4 to 1.5](https://github.com/mesosphere/marathon/blob/master/docs/docs/upgrade/network-api-migration.md#example-definitions). Current Admin Router code supports only v1.4 app definition. The Admin Router is not able to expose apps requiring `ip-per-container` feature at `/service/` endpoint. This release adds a routing logic for Marathon v1.5 app definition. 

- DCOS-47687 - The ZooKeeper snapshot and log files contain sensitive data and are readable by any user on a master node, so it is important to control permissions for ZooKeeper data directories. This fix ensures that `/var/lib/dcos/exhibitor/zookeeper` is owned by `dcos_exhibitor` and only has owner permissions.

# Known Issues and Limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers.

## Mesos
- COPS-4104 - This release fixes an issue that caused container and agent recovery to fail under the following circumstances:
   - The checkpointed Docker volumes file for a container does not exist. 
   - The checkpointed Docker volumes file for a container exists but is empty. 
 
 Prior to this fix, the missing or empty file could prevent the agent from restarting and returning to normal operation. With this release, recovery from an empty or missing docker/volume file is handled by the containerizer or by the `docker/volume` isolator's `recover` method.

## Networking
- COPS-3585 - In previous releases, a deadlock or race condition might prevent one or more nodes in a cluster from generating a routing table that forwards network traffic through Marathon load balancing properly. Problems with routing tables and network connectivity can lead to the following issues:
  - Incomplete network overlay configuration on certain nodes.
  - Incomplete VIP/IPVS/L4LB configuration on certain nodes.
  - DNS records that are missing on certain nodes.
You can restart the `systemd` process on the nodes affected to restore proper network connectivity. This fix is related to the mitigation of a networking issue caused by a secure socket layer (SSL) deadlock in the Erlang library (DC/OS 1.12).

# About DC/OS 1.12 
DC/OS 1.12 includes many new features and capabilities. The key features and enhancements focus on:
- [Mesosphere Kubernetes engine](#kubernetes)
- [Mesosphere Jupyter service](#jupyter)
- [Observability and metrics](#observe-metrics)
- [Private package registry](#private-reg)
- [Installation and upgrade improvements](#install)
- [LDAP and networking enhancements](#ldap-net)

<a name="kubernetes"></a>

### Mesosphere Kubernetes Engine
- High Density Multi-Kubernetes (HDMK) allows operators to take advantage of intelligent resource pooling when running multiple Kubernetes clusters on DC/OS. Compared with other Kubernetes distributions that run a single Kubernetes node per virtual machine, Mesosphere HDMK uses its intelligent resource pooling to pack multiple Kubernetes nodes onto the same server for bare metal, virtual machine, and public cloud instances, driving significant cost savings and resource efficiencies. [Learn more about Kubernetes on DC/OS](/services/kubernetes/2.0.0-1.12.1/).

<a name="jupyter"></a>

### Mesosphere Jupyter Service (MJS)
- Delivered secure, [cloud-native Jupyter](https://docs.mesosphere.com/services/beta-jupyter/) Notebooks-as-a-Service to empower data scientists to perform analytics and distributed machine learning on elastic GPU-pools with access to big and fast data services.
- Secured connectivity to data lakes and data sets on S3 and (Kerberized) HDFS.
- GPU-enabled Spark and distributed TensorFlow.
- OpenID connect authentication and authorization with support for Windows Integrated Authentication (WIA) and Active Directory Federation Services (ADFS).

<a name="observe-metrics"></a>

### Observability and Metrics
- Introduced a flexible and configurable metrics pipeline with multiple output formats.
- Enhanced support for application metric types including histograms, counters, timers, and gauges.
- Support for sample rates and multi-metrics packets. 
- Mesos framework metrics are now [available](http://mesos.apache.org/documentation/latest/monitoring/#frameworks).
- No longer require modifications when collecting metrics via Prometheus endpoint in 1.11.

<a name="private-reg"></a>

[enterprise]
### Private Package Registry
[/enterprise]
- Enabled [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/).
- Enabled air-gapped Virtual Private Cloud package management.
- Simplifies package artifact management.
- Package-specific controls for adding/removing/updating packages within a cluster.
- Package management CLI.

<a name="install"></a>

### Installation and Upgrade
- Fully support installing and operating a cluster on SELinux hardened OS with SE Linux in targeted-enforcing mode for all hardened non-DC/OS components.
- Introducing a unified Terraform-based open source tool for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on AWS, GCP, and Azure.
- Intuitive, streamlined installation with a quick start process - Spin up a DC/OS cluster with a few easy steps in 10-15 minutes. 
- Officially recommended as a Mesosphere supported installation method with best practices built-in (i.e sequential masters & parallel agents in upgrade).
- Restructured [Mesosphere installation documentation](https://docs.mesosphere.com/1.12/installing/evaluation/) to organize Mesosphere supported installation methods and Community supported installation methods.
- Expanded DC/OS upgrade paths enable Mesosphere to skip specific [upgrade paths](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths) within a supported patch version of DC/OS (i.e upgrade from 1.11.1 => 1.11.5 in one move) and to skip upgrade paths between supported major to major versions of DC/OS (for example, enabling you to upgrade from 1.11.7 to 1.12.1 in one move).
- If you have installed the optional DC/OS Storage Service package, then upgrading from 1.12.0 to 1.12.1 requires you to first follow the storage upgrade instructions provided in [Manually upgrade the DSS package to 0.5.x from 0.4.x](/services/beta-storage/0.5.2-beta/upgrades/). You must upgrade DC/OS storage **before** you upgrade cluster nodes to 1.12.1 to prevent Mesos agents from crashing after the upgrade.

<a name="ldap-net"></a>

[enterprise]
### LDAP and Networking Enhancements
[/enterprise]
- Anonymous LDAP bind complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.
= Dynamic LDAP synchronization automatically synchronize [LDAP user account groups](https://docs.mesosphere.com/1.12/security/ent/users-groups/) without manual synchronization of [LDAP directory](https://docs.mesosphere.com/1.12/security/ent/ldap/) with accounts imported into DC/OS.
- Networking component enhancements with 150+ bug fixes with limited logging for visibility.
- Improved DNS convergence time (sub-sec) performance.
- Configurable MTU for Overlay networks.
- Reusable IP addresses for new agents in the cluster.
- Mitigation of networking stuck-state due to SSL deadlock in Erlang library.
- TLS 1.2 support.
- Support for per container network Metrics.
- Leverage persistent connections in Edge-LB for L7 load-balancing. [enterprise type="inline" size="small" /]
- Improved logging in Edge-LB. [enterprise type="inline" size="small" /]
