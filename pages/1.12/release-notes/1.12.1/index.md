---
layout: layout.pug
navigationTitle: Release Notes for 1.12.1
title: Release Notes for 1.12.1
menuWeight: 5
excerpt: Release notes for DC/OS 1.12.1
---

DC/OS Version 1.12.1 was released on January 3, 2019.

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.1 includes the following components:
- Apache Mesos 1.7.x [change log](https://github.com/apache/mesos/blob/b97f0ba29d40a279dec00ffe51512e3b5a146049/CHANGELOG).
- Marathon is 1.7.x [change log](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md).
- Metronome is 0.5.71 [change log](https://github.com/dcos/metronome/blob/22945457c7cb10cb14d575ceeb137edd8158ba3c/changelog.md).

<p class="message--note"><strong>NOTE: </strong>DC/OS 1.12.1 release supports new CoreOS and Docker versions as listed in the <a href="../../../version-policy">compatibility matrix</a>.</p>

# Release Summary

DC/OS is a distributed operating system that enables you to manage resources, application deployment, data services, networking, and security in an on-premise, cloud, or hybrid cluster environment. 

# Issues Fixed in DC/OS 1.12.1
The issues that have been fixed in DC/OS 1.12.1 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## Admin Router
- COPS-4286, DCOS-46277 - This release fixes an issue in the `dcos-adminrouter` component that prevented it from starting properly for some virtual machine configurations.

    For example, if you previously used a server name that exceeded the  maximum size allowed, the `dcos-adminrouter` component might be unable to start the server. With this release, the `packages/adminrouter/extra/src/nginx.master.conf` file has been updated to support a server name hash bucket size of 64 characters.

## Docker Integration
- COPS-4012, DCOS_OSS-4415 - The permissions assigned by default to the container sandbox path have changed from 0755 to 0750 to provide better security and access control. This change, however, can prevent read operations for tasks in Docker container images. If a Docker image specifies a user that is not identical to the user specified by task user identifier (UID) or the framework user UID, the user does not have sufficient permissions to run the tasks.

    To work around this issue, you can update containers to use the Universal Container Runtime (UCR), remove the user and rebuild the Docker image and remove or modify the application user to run under the root account by setting a parameter key-value pair:

    ```
    "parameters": [
        {
        "key": "user",
        "value": "root"
        }
    ]
    ```

- COPS-4044, DCOS_OSS-4469 - This release changes the logging settings for the `dcos-docker-gc` unit so that any log messages it creates are preserved in the `systemd` journal logging facility on the host system.
- COPS-4087 -  For applications that use Docker containers with a virtual IP address, backend port mapping resolves access to the application by using the `host_IP:port_number` instead of the `container_ip:port_number`.

## GUI
- COPS-3968, DCOS-43897 -  Service labels and environment variable are rendered properly in the DC/OS UI when using Firefox as your web browser.

## Marathon
- COPS-3554 - This release introduces a watcher loop process to monitor and, if necessary, re-register the Marathon leader after reelection.

- COPS-3593, DCOS_OSS-4193 - In previous releases, you might have services that are managed by Marathon unable to restart if the container crashes or under certain DNS failure conditions. For example, restarting services might fail if the first ZooKeeper node or first DC/OS master is unreachable. 

    Because this problem affects high availability for Marathon, a workaround (ping zk-1) was introduced for DC/OS 1.11.5 and 1.11.6 to address the issue. In this release, the underlying issue is resolved and you can safely remove the workaround if you have it deployed. For background information about the issue and the steps to remove the workaround, see [Removing the patch for Marathon failing to start if the first DC/OS is not available](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004).

- COPS-3907, DCOS-44502, DCOS-46093 - You can add and edit environment variables for Marathon-LB and Marathon app definitions by using configuration files or by modifying settings in the DC/OS web-based UI.

- MARATHON-8413 - Versioning information for apps and pods in Java9 includes a timestamp in nanoseconds if the `Instant.now()` function is called. Previously, nanoseconds were not included in the version information format that was retrieved for applications and pods.

## Mesos
- COPS-3868, DCOS_OSS-4607 - A new heartbeat operation periodically validates successful communication between the agent and task executor. The heartbeat helps prevent any network intermediaries from interfering with agent-to-executor communication when the agent-to-executor connection sits idle for an extended period of time.

- DCOS-34558, DCOS-43597, DCOS-43598, DCOS-45951 - The Mesos agent attempts to refresh its authentication token when authentication credentials are invalid. If authentication fails, the agent responds with an HTTP 401 status code error. If the authentication token is invalid--for example, because the token has expired--the agent automatically attempts to obtain a new authentication token by re-invoking the service account login procedure. If the renewal fails or no valid authentication token is available, the agent might stop operations until a valid authentication token is available.

- DCOS-42690 - You can specify an optional new `profile` parameter when creating disks. The `profile` parameter enables the framework to specify the volume characteristics it expects during the `CREATE_DISK` operation. The Storage Local Resource Provider (SLRP) validates the volume with the corresponding CSI plugin using the `ValidateVolumeCapabilities` RPC call to see if the `profile` is applicable to the volume.

- DCOS-43044 - Normally, frameworks are expected to record the agent identifier and the resource provider identifier before accepting an offer. To help ensure frameworks record the agent identifier and resource provider identifier before accepting an offer (OfferOperation), the agent identifier and resource provider have been added to the `OperationStatus` message received by the scheduler. The framework can then issue a proper acknowledgement for the update, even if there's no access to previously-checkpointed information.

- DCOS-43544 - Logic changes enable nested containers to run under the same user account as the user associated with their parent container by default. For nested containers in a pod, the default executor’s user--that is, the user running the top-level container--has been the framework user. In a scenario where the framework user is a normal user but the nested container user is `root`, the change in this release enables the second-level nested containers to run as the same user–for example, the `root` user–as the parent top-level container instead of as the framework user by default.

- DCOS-43593 - This release fixes an issue that could cause Mesos master endpoints—such as reserveResources or createVolume—to fail during authorization. For example, before implementing this fix, the authorization requests for an endpoint might fail or be incomplete if there’s extreme load on the IAM service. The change in this release ensures that authorization requests for an endpint are complete before continuing.

- DCOS-43670, DCOS-44827 - The `cgroups` event listener code is used to poll events for a container. An update to this code ensures that the listener closes the file descriptor after read operations are complete. The fix prevents a race condition that can leave the container in an ISOLATING or PROVISIONING state.

- DCOS-46006 - This release provides an optional `vendor` field in `Resource.DiskInfo.Source`. This field enables frameworks to leverage a volume identifier to correlate any persistent volumes lost during recovery. Because a volume identifier is only unique within a container storage interface (CSI) plugin instance (type+name), the `vendor` field ensures that the framework also gets identity information about the CSI plugin instance.

## Metrics
- COPS-3279, COPS-3576, DCOS-37703, DCOS-37703, DCOS-39703 - This release corrects service endpoint values and service address-based statistics that are returned when the `statsd` metrics input plugin is enabled.

- DCOS_OSS-4181 - The Telegraf metrics plugin caches information about executor containers separate from the metrics for tasks. The metrics for executor containers are retrieved using the associated task's parent container identifier. After this update, you can collect metrics for both executor containers and tasks and retrieve results from cached information without generating repeated requests or errors for information that could not be retrieved from the cache.

- DCOS_OSS-4521 - A change to the metrics configuration file (`dcos-config.yaml`) ensures that overlay network metrics are enabled by default when DC/OS files are installed.

- DCOS_OSS-4544 - A new configuration setting for Telegraf metrics plugins enables you to specify unique `User-Agent` values. By using this setting for a Telegraf metrics plugin, you can define the `User-Agent` headers included in all outgoing requests for that metrics plugin. For example, you can specify the user-agent for collecting container metrics as `telegraf-dcos-containers`.

    ```
    ## HTTP User-Agent
    # user_agent = "telegraf"
    ```

- DCOS-42214 - You can customize telegraf metrics by adding or modifying configuration files in the the `/var/lib/dcos/telegraf/telegraf.d/` directory. The files in this directory are automatically loaded by Telegraf input and output plugins when you start the Telegraf process.

- DCOS-43591 - You can add labels to the metrics configuration file to define a "whitelist" for grouping metrics according to the metadata you specify. For example, by adding the `DCOS_SERVICE_NAME` label, you can group the metrics for a specific scheduler.

- DCOS-44041, DCOS-45416 - The DC/OS dcumentation includes more detailed information about the Telegraf plugin architecture, the input plugins available, and the metrics collected by the plugins.

## Networking
- COPS-3585 - In previous releases, a deadlock or race condition might prevent one or more nodes in a cluster from generating a routing table that forwards network traffic through Marathon load balancing properly. Problems with routing tables and network connectivitity can lead to the following issues:
    - Incomplete network overlay configuration on certain nodes.
    - Incomplete VIP/IPVS/L4LB configuration on certain nodes.
    - DNS records that are missing on certain nodes.

    You can restart the `systemd` process on the nodes affected to restore proper network connectivity. This fix is related to the mitigation of a networking issue caused by a secure socket layer (SSL) deadlock in the Erlang library (DC/OS 1.12).

- COPS-3924, DCOS_OSS-1954 - The distributed layer-4 load-balancer (`dcos-l4lb`) network component waits to route traffic until an application scale-up operation is complete or the application health check has passed. The `dcos-l4lb` process does not prevent traffic from being routed if you are scaling down the number of application instances. Network traffic is only suspended if the status of the application is determined to be unhealthy or unknown.

- COPS-4034, DCOS_OSS-4398 - This release prevents `dcos-net` from continously restarting `systemd-networkd` on a bare-metal server with bond interfaces.

- COPS-4078, DCOS_OSS-4395 - You can use a single port to discover UDP and TCP ports on a host network. Previously, if UDP and TCP discovery used the same port number, the `dcos-net` networking process would merge UDP and TCP traffic from the two protocols to a single port. With this release, you can use a single port for TCP-based and UDP-based connections associated with the tasks running on the host network.

- COPS-4099, DCOS-45161 - This release fixes an issue in the DNS forwarder that caused the `dcos-net` process to log errors or application crash messages if more than two DNS upstream servers are set up.

- COPS-4124, DCOS-46132 - A new agent option `--network_cni_root_dir_persist` allows the container node root directory to store network information in a persistent location. This option enables you to specify a container `work_dir` root directory that persists network-related information. By persisting this information, the container network interface (CNI) isolator code can perform proper cleanup operations after rebooting. If rebooting a node does not delete old containers and IP/MAC addresses from `etcd` (which over time can cause pool exhaustion), you should use the `--network_cni_root_dir_persist` option. 

- DCOS-45196 - You can set the `push_ops_timeout` configuration option through the `config.yaml` file.

[enterprise]
## Security
[/enterprise]
- DCOS-21998, DCOS-44367 - You can install DC/OS cluster nodes with custom RSA-based CA certificates that are signed using an Elastic Cloud (EC) based private key. Previously, a custom CA certificate signed using a trusted EC-based private key would generate a transport security layer (TLS) security alert.

## Upgrade
- Upgrading from 1.12.0 to 1.12.1 requires you to first follow the storage upgrade instructions provided in [Manually upgrade the DSS package to 0.5.x from 0.4.x](https://github.com/mesosphere/dcos-storage/blob/master/docs/upgrades/index.md). You must upgrade DC/OS storage before you upgrade cluster nodes to 1.12.1 to prevent Mesos agents from crashing after the upgrade.

# Known Issues and Limitations
This section covers any known issues or limitations that don’t necessarily affect all customers, but might require changes to your environment to address specific scenarios. The issues are grouped by feature, functional area, or component. Where applicable, issue descriptions include one or more issue tracking identifiers.

### Marathon Plugin Dependency
If you have custom Marathon plugins or have added any Marathon-dependent customization to your cluster, you might need to update the plugins or customized components after you upgrade to this release. For example, if you have a plugin with a dependency on Scala Logging version 3.1.0, which was compiled with Scala 2.11, you need to upgrade the Scala Logging package to version 3.7.2 compiled with Scala 2.12 to maintain compatibility with the logging library used in the Marathon package included in this release of DC/OS.

### Service Account Permissions for Metics Collection
Metrics in DC/OS, version 1.12 and newer, are based on Telegraf. Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database. The  Telegraf program runs under the service accounts `dcos_telegraf_master` and `dcos_telegraf_agent`. These two service account must be granted `dcos::superuser permissions`.

# About DC/OS 1.12 

DC/OS 1.12 includes many new features and capabilities. The key features and enhancements focus on:
- Mesosphere Kubernetes engine
- Mesosphere Jupyter service
- Observability and metrics
- Private package registry
- Installation and upgrade improvements
- LDAP and networking enhancements

## New Features and Capabilities
This section provides an overview of new features and capabilities introduced in DC/OS 1.12.

### Mesosphere Kubernetes Engine
- High Density Multi-Kubernetes (HDMK) allows operators to take advantage of intelligent resource pooling when running multiple Kubernetes clusters on DC/OS. Compared with other Kubernetes distributions that run a single Kubernetes node per virtual machine, Mesosphere HDMK uses its intelligent resource pooling to pack multiple Kubernetes nodes onto the same server for bare metal, virtual machine, and public cloud instances, driving significant cost savings and resource efficiencies. [Learn more about Kubernetes on DC/OS](/services/kubernetes/2.0.0-1.12.1/).

### Mesosphere Jupyter Service (MJS)
- Delivered secure, [cloud-native Jupyter](https://docs.mesosphere.com/services/beta-jupyter/) Notebooks-as-a-Service to empower data scientists to perform analytics and distributed machine learning on elastic GPU-pools with access to big and fast data services.
- Secured connectivity to data lakes and data sets on S3 and (Kerberized) HDFS.
- GPU-enabled Spark and distributed TensorFlow.
- OpenID connect authentication and authorization with support for Windows Integrated Authentication (WIA) and Active Directory Federation Services (ADFS).

### Observability and Metrics
- Introduced a flexible and configurable metrics pipeline with multiple output formats.
- Enhanced support for application metric types including histograms, counters, timers, and gauges.
- Support for sample rates and multi-metrics packets. 
- Mesos framework metrics are now [available](http://mesos.apache.org/documentation/latest/monitoring/#frameworks).
- No longer require modifications when collecting metrics via Prometheus endpoint in 1.11.

[enterprise]
### Private Package Registry
[/enterprise]
- Enabled [on-premise package distribution and management](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/).
- Enabled air-gapped Virtual Private Cloud package management.
- Simplifies package artifact management.
- Package-specific controls for adding/removing/updating packages within a cluster.
- Package management CLI.

### Installation and Upgrade
- Fully support installing and operating a cluster on SELinux hardened OS with SE Linux in targeted-enforcing mode for all hardened non-DC/OS components.
- Introducing a unified Terraform-based open source tool for provisioning, deploying, installing, upgrading, and decommissioning DC/OS on AWS, GCP, and Azure.
- Intuitive, streamlined installation with a quick start process - Spin up a DC/OS cluster with a few easy steps in 10-15 minutes. 
- Officially recommended as a Mesosphere supported installation method with best practices built-in (i.e sequential masters & parallel agents in upgrade).
- Restructured [Mesosphere installation documentation](https://docs.mesosphere.com/1.12/installing/evaluation/) to organize Mesosphere supported installation methods and Community supported installation methods.
- Expanded DC/OS upgrade paths enable Mesosphere to skip specific [upgrade paths](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths) within a supported patch version of DC/OS (i.e upgrade from 1.11.1 => 1.11.5 in one move) and to skip upgrade paths between supported major to major versions of DC/OS (for example, enabling you to upgrade from 1.11.7 to 1.12.1 in one move).

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
