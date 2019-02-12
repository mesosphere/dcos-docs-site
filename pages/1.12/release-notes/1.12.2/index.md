---
layout: layout.pug
navigationTitle: Release Notes for 1.12.2
title: Release Notes for 1.12.2
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.2
---

DC/OS Version 1.12.2 was released on February 11, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.2 includes the following components:
- Apache Mesos 1.7.x [change log](https://github.com/apache/mesos/blob/4f21147a9334ef9ed84dcf11742ce448062f3ec/CHANGELOG).
- Marathon is 1.7.x [change log](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md).
- Metronome is 0.5.71 [change log](https://github.com/dcos/metronome/blob/391637cc19cd6136e8733ff8b684aed31b2cf672/changelog.md).

<!-- <p class="message--note"><strong>NOTE: </strong>DC/OS 1.12.1 release supports new CoreOS and Docker versions as listed in the <a href="../../../version-policy">compatibility matrix</a>.</p> -->

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues Fixed in DC/OS 1.12.2
The issues that have been fixed in DC/OS 1.12.2 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## Command-Line Interface (CLI)
- DCOS_OSS_3877, DCOS_OSS-4275 - The `dcos-diagnostics` command you use to create diagnostic bundles for logged information runs as the `root` user. Running the command to generate the diagnostic bundle using the root user account enables you to collect sensitive information that is only available to the superuser.

## Installation
- COPS-4263 - If you run the `dcos_generate_config` command with the `--validate` option, the command validates the configuration settings in your `config.yaml` file. In some cases, this option issued warning messages that validation failed for parameters that are no longer used. For example, some secure shell parameters, such and `ssh_key_path` and `ssh_user`, have been deprecated. Previously, if you ran `dcos_generate_config` with the `--validate` option to check your configuration settings and these parameters were not specified, the command reported that the 
validation of configuration parameters had failed. With this release, the `--validate` option does not return validation failure messages for parameters that are no longer required for installation.

## Job Scheduling (Metronome)
- DCOS_OSS-4717 - Diagnostic bundles include information about Metronome jobs.

## Marathon
- COPS-3554 - This release introduces a watcher loop process to monitor and, if necessary, re-register the Marathon leader after reelection.

- COPS-3593, DCOS_OSS-4193 - In previous releases, you might have services that are managed by Marathon unable to restart if the container crashes or under certain DNS failure conditions. For example, restarting services might fail if the first ZooKeeper node or first DC/OS master is unreachable. 

    Because this problem affects high availability for Marathon, a workaround (ping zk-1) was introduced for DC/OS 1.11.5 and 1.11.6 to address the issue. In this release, the underlying issue is resolved and you can safely remove the workaround if you have it deployed. For background information about the issue and the steps to remove the workaround, see [Removing the patch for Marathon failing to start if the first DC/OS is not available](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004).

## Mesos
- DCOS-46388 - The master node completes the processing of all authorization results for a `LAUNCH_GROUP` before performing other operations. This change prevents subsequent operations from failing if any authorization request is denied.

- DCOS-46753 - This release improves how failed or discontinued launch operations are handled to ensure container input and output operations are resolved correctly and all file descriptors are closed properly. 

  Previously, if the containerizer launch failed or was discarded after the I/O switchboard server started but before the container process completed execution, the file descriptor used to signal a redirect to the I/O switchboard could fail, preventing the containerizer from completing its clean-up operations. You might see this issue if you have frequent health or readiness checks for containers launching on an agent with heavy processing load.

- DCOS-46814 - After an agent host is rebooted, the forked child process id and `libprocess` process id for the executor in the agent’s meta directory are obsolete and should not be read. This change to the process identifiers that are read during agent recovery prevents the container from waiting for a process if those process ids are reused after a reboot.

    Previously, if you rebooted an agent, the agent would wait for the exit status of its container process id (`pid`) before terminating the executor. If a new process with the same `pid` is spawned after the reboot, the agent recovery might stall waiting for the wrong child process id, blocking the executor termination and updates to its tasks.

- DCOS-47699 - The permissions assigned by default to the container sandbox path have been reverted back to 0755 to allow access to files and tasks using a non-root user.

- DCOS-48052 - An update to the containerizer launch binary prevents a malicious user from exploiting the `init` helper function used by container runtimes--including DockerD, containerD, and UCR. Without this change, a malicious user could gain access to a container's root-level permissions and use those permissions to execute potentially malicious code on the host.

    This issue has been reported by the RunC community (CVE-2019-5736) and affects the Docker Engine and Mesosphere Kubernetes Engine (MKE) container runtime components. The issue has also been reported by the Apache Mesos community for the Mesosphere Universal Container Runtime (UCR). All existing versions of DC/OS, Mesosphere Kuberentes Engine, and Docker Engine are affected by this vulnerability. However, this vulnerability does not affect DC/OS clusters or UCR containers if the cluster runs using the `strict` security mode and uses the default `nobody` user account to launch UCR containers.

    For additional information about this vulnerability and its effect on DC/OS, see [Container runtime vulnerability](https://support.mesosphere.com/s/article/Known-Issue-Container-Runtime-Vulnerability-MSPH-2019-0003) and the [Docker Engine release notes](https://docs.docker.com/engine/release-notes/).

## Metrics
- COPS-3279, COPS-3576, DCOS-37703, DCOS-37703, DCOS-39703 - This release corrects service endpoint values and service address-based statistics that are returned when the `statsd` metrics input plugin is enabled.

- DCOS-47301, DCOS_OSS-4688 - This release include a new cluster configuration option `enable_mesos_input_plugin` that allows you to enable or disable the Mesos metrics input plugin for Telegraf. If enabled, this option eliminates the need to upload files to every node in the cluster for collecting metrics. 

    You can enable the input plugin by setting the `enable_mesos_input_plugin` option to `true` in the `config.yaml` file. The default value is `false`. This configuration setting is an advanced configuration option if you are using the [Mesosphere Universal Installer](/1.12/installing/evaluation/) or installing manually with a customized [configuration file](/1.12/installing/production/advanced-configuration/).

- DCOS_OSS-4679 - The metrics API for the `/containers` endpoint has been modified to include a timestamp that specifies when the metric returned was collected. The timestamp field is used to determine the age of the metric and to ensure cached metrics expire and are removed properly when the cache is refreshed. The timestamp prevents metrics from returning misleading 204 No Content HTTP responses.

## Networking
- COPS-3585 - In previous releases, a deadlock or race condition might prevent one or more nodes in a cluster from generating a routing table that forwards network traffic through Marathon load balancing properly. Problems with routing tables and network connectivity can lead to the following issues:
    - Incomplete network overlay configuration on certain nodes.
    - Incomplete VIP/IPVS/L4LB configuration on certain nodes.
    - DNS records that are missing on certain nodes.

    You can restart the `systemd` process on the nodes affected to restore proper network connectivity. This fix is related to the mitigation of a networking issue caused by a secure socket layer (SSL) deadlock in the Erlang library (DC/OS 1.12).

- COPS-3743, DCOS_OSS-2362, DCOS_OSS-4620 - The DC/OS networking component (`dcos-net`) supports setting a **cluster identity** option on a node for DC/OS cluster. By enabling this feature, you can prevent nodes from communicating across clusters when a node is moved from one cluster to another. This feature ensures that the nodes from a cluster have a unique identifier that prevents unauthorized “cross-talk” between clusters.

- COPS-4124, DCOS-46132, DCOS_OSS-4667 - A new agent option `--network_cni_root_dir_persist` allows the container node root directory to store network information in a persistent location. This option enables you to specify a container root under the `work_dir` directory that persists network-related information. By persisting this information, the container network interface (CNI) isolator code can perform proper cleanup operations after rebooting. If rebooting a node does not delete old containers and IP/MAC addresses from `etcd` (which over time can cause pool exhaustion), you should set the `--network_cni_root_dir_persist` agent option in the `config.yaml` file to `true`. 

    <p class="message--note"><strong>NOTE: </strong>Changing this flag requires rebooting the agent node or shutting down all container processes running on the node. Because a reboot or shutdown of containers is required, the default value for the `--network_cni_root_dir_persist` agent option is `false`. Before changing this option, you should plan for agent maintenance to minimize any service interruption. If you set this option and reboot a node, you should also unset the `CNI_NETNS` environment variable after rebooting using the CNI plugin DEL command so that the plugin cleans up as many resources as possible (for example, by releasing IPAM allocations) and returns a successful response.</p>

- COPS-4205 - This release adds a unique query parameter with a timestamp to prevent caching issues with HTTP response headers for some endpoints. This fix clears out-of-date information from the cache so that correct task information is displayed. The change addresses an intermittent issue in which DC/OS reports that no data was returned after a period of time when using a service such as Edge-LB or Kubernetes.

- DCOS-40878, DCOS_OSS-4164 - You can set a new configuration option to control the maximum number of active subscribers are allowed on a Master node event stream at any given time. The `--max_operator_event_stream_subscribers` option helps to prevent load balancers or proxy servers from keeping connections to the event stream endpoint open after a client disconnects. The default value for the `--max_operator_event_stream_subscribers` option is 1000 subscribers. If your network has clients that do not close connections immediately, you might want to lower the number of subscribers allowed. In addition, a new metric for operator event stream subscribers returns the total number of subscribers to the master node's operator event stream.

- DCOS_OSS-4514, DCOS_OSS-4666 - This release adds service address (`A` or `AAAA`) records for public and private nodes to DNS. You can use `public.thisnode.thisdcos.directory` to return the **public IP addresses** for a local agent or master node or `thisnode.thisdcos.directory` to return the **private IP addresses** for a local agent or master node. 

    For DNS lookup requests, service address `A` records convert domain names to corresponding IP addresses using IPv4 notation for a given host. Service address `AAAA` records return IP addresses using IPv6 address notation for given host.

# Known Issues and Limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers.

### Marathon Plugin Dependency
If you have custom Marathon plugins or have added any Marathon-dependent customization to your cluster, you might need to update the plugins or customized components after you upgrade to this release. For example, if you have a plugin with a dependency on Scala Logging version 3.1.0, which was compiled with Scala 2.11, you need to upgrade the Scala Logging package to version 3.7.2 compiled with Scala 2.12 to maintain compatibility with the logging library used in the Marathon package included in this release of DC/OS.

### Service Account Permissions for Metics Collection
Metrics in DC/OS, version 1.12 and newer, are based on Telegraf. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database. The  Telegraf program runs under the service accounts `dcos_telegraf_master` and `dcos_telegraf_agent`. These two service account must be granted `dcos::superuser permissions`.

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
