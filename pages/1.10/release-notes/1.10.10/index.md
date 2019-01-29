---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.10
title: Release Notes for 1.10.10
menuWeight: 4
excerpt:
---


DC/OS 1.10.10 was released on Jaunary 29, 2019.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.10.10/dcos_generate_config.sh"]Download DC/OS Open Source[/button]
[button color="light" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.10.10/dcos_generate_config.ee.sh"]Download DC/OS Enterprise[/button]

# Updated Components in DC/OS 1.10.10
DC/OS 1.10.10 includes the following:
- Apache Mesos 1.4.3 [change log](https://github.com/apache/mesos/blob/e929d413328e10f6d358899500d5aaedd9d9bc51/CHANGELOG).
- Marathon 1.5.12 [change log](https://github.com/mesosphere/marathon/releases/tag/v1.5.12).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.4).

# Issues Fixed in DC/OS 1.10.10
The issues that have been fixed in DC/OS 1.10.10 are grouped by feature, functional area, or component. Most change descriptions include one or more issue tracking identifiers for reference.

## Command-Line Interface (CLI)
- DCOS-38213 - Downloading the Mesosphere CLI package requires a network connection to `downloads.mesosphere.com`. Because this connection can be slow, especially from remote or widely-distributed network locations, the session scope for the CLI fixture helps to ensure the CLI package only has to be downloaded once.

- DCOS-44238 - You can download the latest version of the `core-cli` for a cluster without specifying a patch version or using automatic installation.

## Docker Integration
- COPS-4044, DCOS_OSS-4469 - This release changes the logging settings for the `dcos-docker-gc` unit so that any log messages it creates are preserved in the `systemd` journal logging facility on the host system.

## Mesos
- COPS-4320, DCOS-46814 - After an agent host is rebooted, the forked child process id and `libprocess` process id for the executor in the agent's meta directory are obsolete and should not be read. This change to the process identifiers read during agent recovery prevents the container from waiting for a process if those process ids are reused after a reboot. 

  Previously, if you rebooted an agent, the agent would wait for the exit status of its container process id (`pid`) before terminating the executor. If a new process with the same `pid` is spawned after the reboot, the agent recovery might stall waiting for the wrong child process id, blocking the executor termination and updates to its tasks.

- DCOS-43670, DCOS-44827 - The `cgroups` event listener code is used to poll events for a container. An update to this code ensures that the listener closes the file descriptor after read operations are complete. The fix prevents a race condition that can leave the container in an ISOLATING or PROVISIONING state.
  
- DCOS-46388 - The master node completes the processing of all authorization results for a `LAUNCH_GROUP` before performing other operations. This change prevents subsequent operations from failing if any authorization request is denied.

- DCOS-46753 - This release improves how failed or discontinued launch operations are handled to ensure container input and output operations are resolved correctly and all file descriptors are closed properly. 

  Previously, if the containerizer launch failed or was discarded after the I/O switchboard server started but before the container process completed execution, the file descriptor used to signal a redirect to the I/O switchboard could fail, preventing the containerizer from completing its clean-up operations. You might see this issue if you have frequent health or readiness checks for containers launching on an agent with heavy processing load.

## Networking
- COPS-4124, DCOS-46132, DCOS_OSS-4667 - A new agent option `--network_cni_root_dir_persist` allows the container node root directory to store network information in a persistent location. This option enables you to specify a container `work_dir` root directory that persists network-related information. By persisting this information, the container network interface (CNI) isolator code can perform proper cleanup operations after rebooting. 

  If rebooting a node does not delete old containers and IP/MAC addresses from `etcd` (which over time can cause pool exhaustion), you should set the `--network_cni_root_dir_persist` agent option in the `config.yaml` file to `true`. You should note that changing this flag requires rebooting the agent node or shutting down all container processes running on the node. Because a reboot or shutdown of containers is required, the default value for the `--network_cni_root_dir_persist` agent option is `false`. Before changing this option, you should plan for agent maintenance to minimize any service interruption. If you set this option and reboot a node, you should also unset the `CNI_NETNS` environment variable after rebooting using the CNI plugin `DEL` command so that the plugin cleans up as many resources as possible (for example, by releasing IPAM allocations) and returns a successful response.

[enterprise type="block" size="large"]
## Security
[/ enterprise]

- DCOS_OSS-4418 - This release includes an upgrade to the Python requests library used in DC/OS to address moderate security vulnerability reports (CVE-2018-18074). The release upgrades the request library from 2.20.1 to 2.21.0.

# About DC/OS 1.10

DC/OS 1.10 includes many new capabilities for operators and expands the collection of Data and Developer Services with a focus on:

- Core DC/OS service continuity - System resilience, IAM scalability and simplified upgrades.
- Robust security - Custom CA certificate and file-based secrets support. [enterprise type="inline" size="small" /]
- Enterprise-ready networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Kubernetes is now available on DC/OS.
- Data services enhancements across the board.
  - Rolling configuration update and upgrade support via the CLI. [enterprise type="inline" size="small" /]
  - Ability to deploy Data Services into folders to enable multi team deployments. [enterprise type="inline" size="small" /]
  - Ability to deploy to CNI-Based virtual networks.

You can try out the new features and updated data services. Provide feedback through our support channel: <a href="https://support.mesosphere.com/">support.mesosphere.com</a>.

## New Features and Capabilities

### Networking
- You can configure Spartan to delegate a particular domain (for example, `\*.foo.company.com`) to a particular upstream.

- DC/OS supports any type of container network interface (CNI) network plugin. [View the documentation](/1.10/networking/virtual-networks/cni-plugins/).

- You can use Edge-LB load balancer to balance Mesos tasks. The Edge-LB load balancer does not support strict security mode. [View the documentation](/services/edge-lb/0.1/).[enterprise type="inline" size="small" /]

[enterprise type="block" size="large"]
### Security
[/ enterprise]

- Custom CA certificate support.
  Installation time [configuration options](/1.10/security/ent/tls-ssl/ca-custom/) have been added that allow you to configure DC/OS Enterprise to use a custom CA certificate and corresponding private key, which DC/OS then uses for issuing all component certificates. The custom CA certificate can be an intermediate CA certificate so that that all certificates used within the DC/OS cluster derive from your organization’s X.509 certification hierarchy.

- Enhanced secrets management with file-based secrets.
  You can now make a secret available to your service in the sandbox of the task. [View the documentation](/1.10/security/ent/secrets/use-secrets/).

- Vastly improved IAM scalability and performance characteristics.
  The new system removes hard limits on the number of users, groups, and permissions that can be stored, and shows stable read and write performance as the dataset grows.

- Docker `pullConfig` parameter.
  Use this parameter in your service definition to authenticate to a private Docker registry. [View the documentation](/1.10/deploying-services/private-docker-registry/#referencing-private-docker-registry-credentials-in-the-secrets-store-enterprise).

 - Enterprise CLI permissions management commands.
   It is now possible to manage permissions to protect resources using the [DC/OS Enterprise CLI](/1.10/security/ent/perms-management/).

### Kubernetes on DC/OS

- Kubernetes on DC/OS is beta with DC/OS 1.10. You can install the package from the DC/OS Service Catalog or by using the DC/OS Kubernetes [quickstart](https://github.com/mesosphere/dcos-kubernetes-quickstart).

### Updated DC/OS Data Services

- Rolling Configuration Update and Upgrades support via the CLI. [enterprise type="inline" size="small" /]
- Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are compatible with DC/OS 1.10.

- [Cassandra](/services/cassandra/)
- [Elastic](/services/elastic/)
- [HDFS](/services/hdfs/)
- [Kafka](/services/kafka/)
- [Apache Spark](/services/spark/)

For more information, see the documenation or release notes for the specific data services package in which you are interested.

### Platform
- Node and cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/1.10/installing/oss/custom/node-cluster-health-check/).
- Enhanced upgrades with [backup and restore](/1.10/administering-clusters/backup-and-restore/), and pre/post flight checks. [enterprise type="inline" size="small" /]
- Universal Container Runtime (UCR).
  Adds port mapping support for containers running on the CNI network. Port mapping support allows UCR to have a default bridge network, similar to Docker's default bridge network. This gives UCR feature parity with Docker Engine enabling use of Mesos Runtime as the default container runtime.
- Scale and performance limits.

### CLI

- DC/OS 1.10 requires DC/OS CLI 0.5.x.
- DC/OS CLI 0.5.x adds [multi-cluster support](/1.10/cli/multi-cluster-cli/) with [`dcos cluster`](/1.10/cli/command-reference/dcos-cluster) commands. Multi-cluster support has a number of consequences:

   - DC/OS CLI 0.4.x has a single configuration file, stored by default in `~/.dcos/dcos.toml`. DC/OS CLI 0.5.x has a configuration file for **each connected cluster**. Each cluster configuration file is stored by default in `~/.dcos/clusters/<cluster_id>/dcos.toml`.
   - DC/OS CLI 0.5.x introduces the `dcos cluster setup` command to configure a connection to a cluster and log into the cluster.
    -  Updating to the DC/OS CLI 0.5.x and running any CLI command triggers conversion from the old to the new configuration structure.
    
    If you attempt to update the cluster configuration using a `dcos config set` command after using `dcos cluster setup` or converting to DC/OS CLI 0.5.x, the command prints a warning message saying the command is deprecated and that cluster configuration state might now be corrupted.
  
    If you have the `DCOS_CONFIG` environment variable configured:
    - _After_ conversion to the new configuration structure, `DCOS_CONFIG` is no longer honored.
    - _Before_ you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command prints a warning message saying the command is deprecated and recommends using `dcos cluster setup`.
  
  CLI modules are cluster-specific and stored in `~/.dcos/clusters/<cluster_id>/subcommands`. Therefore you must install a CLI module for each cluster. For example, if you connect to cluster 1, and install the Spark module, then connect to cluster 2 which is also running Spark, Spark CLI commands are not available until you install the module for that cluster.

### GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.
- The "Security" tab has been removed. The "Secrets" tab that used to be under "Security" is now a top-level tab. [enterprise type="inline" size="small" /]
- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.
- The "System Overview" tab has been renamed to "Overview".


## Breaking Changes

- Marathon Networking API Changes in 1.5.

  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md).

- TLS 1.0 is no longer enabled by default in Admin Router. [enterprise type="inline" size="small" /]

  TLS 1.0 no longer meets common minimum security requirements. To use TLS 1.0, set `adminrouter_tls_1_0_enabled` to `true` in your `config.yaml` at install time. The default is `false`.

- Moved file location for the DC/OS CA bundle in the sandbox of Mesos tasks from `$MESOS_SANDBOX/.ssl/ca.crt` to `$MESOS_SANDBOX/.ssl/ca-bundle.crt` and declared the new file path to be stable.

- Marathon-LB 1.11.0 or greater is required for DC/OS 1.10.

  Before upgrading to DC/OS 1.10, uninstall your existing Marathon-LB package and reinstall the updated version.

- REX-Ray configuration change.

  DC/OS 1.10 upgrades REX-Ray from v0.3.3 to v0.9.0 and the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the [`rexray_config`](/1.10/installing/oss/custom/configuration/configuration-parameters/#rexray-config) parameter of your `config.yaml` file, either update the configuration to the new format or remove `rexray_config` and set the parameter to `rexray_config_preset: aws`, which configures the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS.
  **Note:** The `rexray_config_preset: aws` option is only relevant to DC/OS clusters running on AWS.

- New flow to change the `dcos_url` and log in.

  The new command to set up your cluster URL is `dcos cluster setup <dcos_url>`. For details, see [CLI](#cli).

- Hard CFS CPU limits enabled by default.

  DC/OS 1.10 enforces hard CPU limits with CFS isolation for both the Docker and Universal Container Runtimes. This will give more predictable performance across all tasks but might lead to a slowdown for tasks (and thereby also deployments) who have previously have consumed more CPU cycles than allocated. See [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134) for more details.

<!-- ## Known Issues
- Upgrade: During upgrade to DC/OS 1.10, there is a brief moment when the DNS resolution does not work. If a health check runs at that moment, it will fail and services will be reported as unhealthy.
- CORE-1125 - Docker image pull config is re-used.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- INFINITY-1809 - [Data Svc] DC/OS Service Update / Config Update / Maintenance. [enterprise type="inline" size="small" /]
- MARATHON-7736 - Marathon Client Java library does NOT work with Marathon 1.5. -->
