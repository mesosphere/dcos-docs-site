---
layout: layout.pug
navigationTitle: Release Notes for 1.12.4
title: Release Notes for 1.12.4
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.4
---

DC/OS Version 1.12.4 was released on June 21, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.4 includes the following components:
- Apache Mesos 1.7.3 [change log](https://github.com/apache/mesos/blob/5e234c8d8edc1bb73ba557f5774c609fa460c9e7/CHANGELOG).
- Marathon 1.7.203 [change log](https://github.com/mesosphere/marathon/blob/b26a8b310561934071c5f347ee5e184a3279cabd/changelog.md).
- Metronome 0.5.71 [change log](https://github.com/dcos/metronome/blob/cf8887dd836d3629e3f5ac071624e055bdffcec8/changelog.md ).

<!-- <p class="message--note"><strong>NOTE: </strong>DC/OS 1.12.1 release supports new CoreOS and Docker versions as listed in the <a href="../../../version-policy">compatibility matrix</a>.</p> -->

# Release summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues fixed in DC/OS 1.12.4
The issues that have been fixed in DC/OS 1.12.4 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## Command-line interface (CLI)
- 

## GUI
- 

## Installation
 - 

## Marathon
- COPS-3554 - This release introduces a watcher loop process to monitor and, if necessary, re-register the Marathon leader after reelection.<!--Also in previous RN, 1.12.4-->

- COPS-3593, DCOS_OSS-4193 - In previous releases, you might have services that are managed by Marathon unable to restart if the container crashes or under certain DNS failure conditions. For example, restarting services might fail if the first ZooKeeper node or first DC/OS master is unreachable.

    Because this problem affects high availability for Marathon, a workaround (ping zk-1) was introduced for DC/OS 1.11.5 and 1.11.6 to address the issue. In this release, the underlying issue is resolved and you can safely remove the workaround if you have it deployed. For background information about the issue and the steps to remove the workaround, see [Removing the patch for Marathon failing to start if the first DC/OS is not available](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004). <!--Also in previous RN, 1.12.4-->

## Mesos
- 


## Metrics
- COPS-3279, COPS-3576, DCOS-37703, DCOS-37703, DCOS-39703 - This release corrects service endpoint values and service address-based statistics that are returned when the `statsd` metrics input plugin is enabled.<!--Also in previous RN, 1.12.4-->


## Networking
- COPS-3585 - In previous releases, a deadlock or race condition might prevent one or more nodes in a cluster from generating a routing table that forwards network traffic through Marathon load balancing properly. Problems with routing tables and network connectivity can lead to the following issues:

    - Incomplete network overlay configuration on certain nodes.
    - Incomplete VIP/IPVS/L4LB configuration on certain nodes.
    - DNS records that are missing on certain nodes.

    You can restart the `systemd` process on the nodes affected to restore proper network connectivity. This fix is related to the mitigation of a networking issue caused by a secure socket layer (SSL) deadlock in the Erlang library.<!--Also in previous RN, 1.12.4-->

- COPS-4761, DCOS_OSS-5108 - This release fixes an issue where DNS clients deployed for the DC/OS Enterprise cluster are not able to resolve the `registry.component.thisdcos.directory` DNS name. [enterprise type="inline" size="small" /]

    The issue is caused by DNS clients that have a bug in the `glibc` library. The `glibc` bug requires canonical name (CNAME) records to be retrieved before address (A or AAAA) records.

    With this release, the DC/OS DNS server sorts DNS results to ensure that the CNAME records appear first to resolve this issue.

[enterprise]
## Security
[/enterprise]
- 

# Known issues and limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers.

# About DC/OS 1.12 
DC/OS 1.12 includes many new features and capabilities. The key features and enhancements focus on:
- [Mesosphere Kubernetes engine](#kubernetes)
- [Mesosphere Jupyter service](#jupyter)
- [Observability and metrics](#observe-metrics)
- [Private package registry](#private-reg)
- [Installation and upgrade improvements](#install)
- [LDAP and networking enhancements](#ldap-net)

<a name="kubernetes"></a>

### Mesosphere Kubernetes engine
- Introduced High Density Multi-Kubernetes (HDMK) that allows operators to take advantage of intelligent resource pooling when running multiple Kubernetes clusters on DC/OS. Compared with other Kubernetes distributions that run a single Kubernetes node per virtual machine, Mesosphere HDMK uses its intelligent resource pooling to pack multiple Kubernetes nodes onto the same server for bare metal, virtual machine, and public cloud instances, driving significant cost savings and resource efficiencies. [Learn more about Kubernetes on DC/OS](/services/kubernetes/2.0.0-1.12.1/).

<a name="jupyter"></a>

### Mesosphere Jupyter service (MJS)
- Delivered secure, [cloud-native Jupyter](https://docs.mesosphere.com/services/beta-jupyter/) Notebooks-as-a-Service to empower data scientists to perform analytics and distributed machine learning on elastic GPU-pools with access to big and fast data services.
- Secured connectivity to data lakes and data sets on S3 and (Kerberized) HDFS.
- Included GPU-enabled Spark and distributed TensorFlow.
- Provided OpenID connect authentication and authorization with support for Windows Integrated Authentication (WIA) and Active Directory Federation Services (ADFS).

<a name="observe-metrics"></a>

### Observability and metrics
- Introduced a flexible and configurable metrics pipeline with multiple output formats.
- Enhanced support for application metric types including histograms, counters, timers, and gauges.
- Provided support for sample rates and multi-metrics packets. 
- Introduced Mesos [framework metrics](http://mesos.apache.org/documentation/latest/monitoring/#frameworks).
- No longer require modifications when collecting metrics via Prometheus endpoint in 1.11.

<a name="private-reg"></a>

[enterprise]
### Private package registry
[/enterprise]
- Enabled [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/).
- Enabled air-gapped Virtual Private Cloud package management.
- Simplified package artifact management.
- Introduced package-specific controls for adding/removing/updating packages within a cluster.
- Introduced package management CLI.

<a name="install"></a>

### Installation and upgrade
- Provided full support for installing and operating a cluster on SELinux hardened OS with SE Linux in targeted-enforcing mode for all hardened non-DC/OS components.
- Introduced a unified Terraform-based open source tool for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on AWS, GCP, and Azure.
- Introduced an intuitive, streamlined installation with a quick start process - Spin up a DC/OS cluster with a few easy steps in 10-15 minutes. 
- Officially recommended as a Mesosphere supported installation method with best practices built-in (i.e sequential masters & parallel agents in upgrade).
- Restructured [Mesosphere installation documentation](https://docs.mesosphere.com/1.12/installing/evaluation/) to organize Mesosphere supported installation methods and Community supported installation methods.
- Expanded DC/OS upgrade paths enable Mesosphere to skip specific [upgrade paths](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths) within a supported patch version of DC/OS (i.e upgrade from 1.11.1 => 1.11.5 in one move) and to skip upgrade paths between supported major to major versions of DC/OS (for example, enabling you to upgrade from 1.11.7 to 1.12.1 in one move).
- If you have installed the optional DC/OS Storage Service package, then upgrading from 1.12.0 to 1.12.1 requires you to first follow the storage upgrade instructions provided in [Manually upgrade the DSS package to 0.5.x from 0.4.x](/services/beta-storage/0.5.2-beta/upgrades/). 

<p class="message--note"><strong>NOTE: </strong>You must upgrade DC/OS storage before you upgrade cluster nodes to 1.12.1 to prevent Mesos agents from crashing after the upgrade.</p>


<a name="ldap-net"></a>

[enterprise]
### LDAP and networking enhancements
[/enterprise]
- Introduced anonymous LDAP bind complies with standardized Enterprise LDAP integration pattern without a dedicated DC/OS integration LDAP user.
- Provided dynamic LDAP synchronization to synchronize [LDAP user account groups](https://docs.mesosphere.com/1.12/security/ent/users-groups/) automatically without manual synchronization of [LDAP directory](https://docs.mesosphere.com/1.12/security/ent/ldap/) with accounts imported into DC/OS.
- Enhanced networking component with 150+ bug fixes with limited logging for visibility.
- Improved DNS convergence time (sub-sec) performance.
- Configured MTU for Overlay networks.
- Provided reusable IP addresses for new agents in the cluster.
- Mitigation of networking stuck-state due to SSL deadlock in Erlang library.
- Provided TLS 1.2 support.
- Provided support for per container network Metrics.
- Leveraged persistent connections in Edge-LB for L7 load-balancing. [enterprise type="inline" size="small" /]
- Improved logging in Edge-LB. [enterprise type="inline" size="small" /]
