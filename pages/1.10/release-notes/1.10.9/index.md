---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.9
title: Release Notes for 1.10.9
menuWeight: 5
excerpt:
---

DC/OS 1.10.9 was released on November 6, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.10.9/dcos_generate_config.sh"]Download DC/OS Open Source[/button]
[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

# Notable Changes in DC/OS 1.10.9
DC/OS 1.10.9 includes the following:
- Apache Mesos 1.4.3 [change log](https://github.com/apache/mesos/blob/3071ff7/CHANGELOG).
- Marathon 1.5.12 [change log](https://github.com/mesosphere/marathon/releases/tag/v1.5.12).
- Metronome 0.4.4 [change log](https://github.com/dcos/metronome/releases/tag/v0.4.4).

- DCOS-40881/DCOS-41396/DCOS-41495/DCOS-41502 - Bump dcos-ui v1.10+v1.10.9-rc3. 

# Issues Fixed in DC/OS 1.10.9

## CLI
- DCOS-3200 - `dcos task --completed` command no longer fails in instances when accessing information for a task completed on an agent that is no longer registered with the master.
- DCOS-41601/DCOS_OSS-3921 - Use the total amount of space available on mounted disks to create /var/lib/dcos/mesos-resources to ensure successful Mesos agent restarts in instances where disk has been used.

## Data Services
- DCOS_OSS-3938 - Add a check that terminates bootstrap if an unexpected IP address is returned in Exhibitor startup.

## GUI
- DCOS-14757 - Remove an unexpected error message about persistent volumes that may appear when creating a local volume.
- DCOS-15289 - Ensure that the removal of volumes on multi-container applications via the UI also removes the same fields in the JSON editor.
- DCOS-21723 - Ensure correct display of the allocated resources for running frameworks at all times by retrieving consumption data directly at framework level rather than summing ongoing tasks.
- DCOS-37461/DCOS-37464/DCOS-37466/DCOS-37465 - Improve UI performance.
- DCOS-37585 - Fix Marathon health checks by caching right task data.
- DCOS-40525 - Fix the environment variables reducer to support empty values.
- DCOS-40881 - Fix form control icons overflow issue in Firefox.
- DCOS-42035 - Add an error message when environment variables are input without keys.
- DCOS-17436/DCOS-42366 - Set total resource counts to display in the pods table.
- DCOS_OSS-1551/DCOS_OSS-4034 - Add support for virtual IP addresses when configuring hosts.
- DCOS_OSS-526 - Update error messages to include additional details if a machine is unable to access a repository or container.

## Marathon
- COPS-3593/DCOS_OSS-4193 - Resolve [MSPH-2018-0004](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004)(Mesosphere Customer Advisory) where Marathon fails to launch if the first DC/OS master is down with the introduction of ping zk-1 in DC/OS 1.11.5.

## Mesos
- COPS-3371 - Remove `check-*` directories created by health checks for Kafka inside /run/mesos/containers after the health check is completed.
- COPS-3780/DCOS_OSS-4086 - Improve allocate error messages for Mesos.
- DCOS-21349 - Update agent endpoints to ensure Mesos flags and state are always retrieved in a DC/OS diagnostics bundle.
- DCOS_OSS-3861 - Add additional data (timestamp for `dmesg`, `timedatectl`, distro version, systemd unit status, pods endpoint) into DC/OS diagnostics bundle.
- DCOS_OSS-3978 - Add `/quota`, `/containers`, `/proc/[cmdline|cpuinfo|meminfo]`, `ps aux wwww` to DC/OS diagnostics bundle.

## Metrics
- DCOS-37454 - Fix inconsistent output reported by prometheus endpoint (/metrics) in the metrics store. 
- DCOS-38083 - Improve the behavior of statsd timers on `dcos-metrics`.

## Networking
- COPS-3520/DCOS-39999 - Fix DC/OS OSS build failure that occurred due to segmentation violation.
- COPS-3701 - Fix file descriptors leak associated with TCP connection on DC/OS nodes.  
- DCOS-39707 - Fix clustering issues with `etcd`.
- DCOS-39841 - Fix the erros of `dcos-cni` package that lead to the failure to build DC/OS locally.
- DCOS_OSS-3697 - Ensure connectivity between Docker bridge and DC/OS overlay via VIP on the same host.
- DCOS_OSS-3855 - Verify properties of existing vtep interfaces for mismatches before creating a new interface.

## Platform
- DCOS-40373 - Fix instances where `dcos-history-service` would leak authorization tokens in its header.

## Security
- DCOS-40245 - Set the `adminrouter_auth_cache_enabled` configuration to true by default, in order to prevent 503 Adminrouter errors when scheduling Marathon jobs.
- DCOS_OSS-3793 - Add activity for the Adminrouter (nginx) program to the journald logging facility so that the logged activity is available in the same location as other DC/OS logs.
- DCOS_OSS-3933 - Upgraded Java from version `8u151` to version `8u181`.
- DCOS-42813/DCOS-42814 - Upgrade CockroachDB from 1.1.9 to 1.1.9.

# About DC/OS 1.10

DC/OS 1.10.0 includes many new capabilities for operators and expands the collection of Data & Developer Services with a focus on:

- Core DC/OS service continuity - System resilience, IAM scalability & simplified upgrades.
- Robust security - Custom CA certificate & file-based secrets support. [enterprise type="inline" size="small" /]
- Enterprise-ready networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Kubernetes is now available on DC/OS.
- Data services enhancements across the board.
  - Rolling configuration update and upgrade support via the CLI. [enterprise type="inline" size="small" /]
  - Ability to deploy Data Services into folders to enable multi team deployments. [enterprise type="inline" size="small" /]
  - Ability to deploy to CNI-Based virtual networks.

You can try out the new features and updated data services. Provide feedback through our support channel: <a href="https://support.mesosphere.com/">support.mesosphere.com</a>.

## New Features and Capabilities

### Networking
- Configurable Spartan upstreams for domains (dnames).
  You can now configure Spartan to delegate a particular domain (e.g. "\*.foo.company.com") to a particular upstream.

- Increased CNI network support.
  DC/OS now supports any type of CNI network. [View the documentation](/1.10/networking/virtual-networks/cni-plugins/).

- Edge-LB load balancer. [enterprise type="inline" size="small" /]

  Edge-LB load balances Mesos tasks. Not supported in strict security mode. [View the documentation](/services/edge-lb/0.1/).

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

- Kubernetes on DC/OS is beta with DC/OS 1.10.0. Install from the DC/OS Service Catalog or use the [quickstart](https://github.com/mesosphere/dcos-kubernetes-quickstart).

### Updated DC/OS Data Services

- Rolling Configuration Update and Upgrades support via the CLI. [enterprise type="inline" size="small" /]
- Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are compatible with DC/OS 1.10.0.

- Cassandra. [Documentation](/services/cassandra/). [Release Notes](/services/cassandra/v2.0.0-3.0.14/release-notes/).

- Elastic. [Documentation](/services/elastic/). [Release Notes](/services/elastic/2.0.1-5.5.1/release-notes/).

- HDFS. [Documentation](/services/hdfs/). [Release Notes](/services/hdfs/v2.0.0-2.6.0-cdh5.11.0/release-notes/).

- Kafka. [Documentation](/services/kafka/). [Release Notes](/services/kafka/v2.0.0-0.11.0/release-notes/).

- Apache Spark. [Documentation](/services/spark/). [Release Notes](https://github.com/mesosphere/spark-build/releases/tag/1.1.1-2.2.0).

### Platform
- Node and cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/1.10/installing/production/deploying-dcos/node-cluster-health-check/).
- Enhanced upgrades with [backup and restore](/1.10/administering-clusters/backup-and-restore/), and pre/post flight checks. [enterprise type="inline" size="small" /]
- Universal Container Runtime (UCR).
  Adds port mapping support for containers running on the CNI network. Port mapping support allows UCR to have a default bridge network, similar to Docker's default bridge network. This gives UCR feature parity with Docker Engine enabling use of Mesos Runtime as the default container runtime.
- Scale and performance limits.

### CLI

- DC/OS 1.10.0 requires DC/OS CLI 0.5.x.
- DC/OS CLI 0.5.x adds [multi-cluster support](/1.10/cli/multi-cluster-cli/) with [`dcos cluster`](/1.10/cli/command-reference/dcos-cluster/) commands.


 Multi-cluster support has a number of consequences:

   - DC/OS CLI 0.4.x and 0.5.x use a different structure for the location of configuration files. DC/OS CLI 0.4.x has a single configuration file, which by default is stored in `~/.dcos/dcos.toml`. DC/OS CLI 0.5.x has a configuration file for each connected cluster, which by default are stored in `~/.dcos/clusters/<cluster_id>/dcos.toml`.
   - DC/OS CLI 0.5.x introduces the `dcos cluster setup` command to configure a connection to a cluster and log into the cluster.
   - **Note:**
     -  Updating to the DC/OS CLI 0.5.x and running any CLI command triggers conversion from the old to the new configuration structure.
     - _After_ you call `dcos cluster setup`, (or after conversion has occurred), if you attempt to update the cluster configuration using a `dcos config set` command, the command prints a warning message saying the command is deprecated and cluster configuration state may now be corrupted.
  - If you have the `DCOS_CONFIG` environment variable configured:
    - After conversion to the new configuration structure, `DCOS_CONFIG` is no longer honored.
    - _Before_ you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command prints a warning message saying the command is deprecated and recommends using `dcos cluster setup`.
  - CLI modules are cluster-specific and stored in `~/.dcos/clusters/<cluster_id>/subcommands`. Therefore you must install a CLI module for each cluster. For example, if you connect to cluster 1, and install the Spark module, then connect to cluster 2 which is also running Spark, Spark CLI commands are not available until you install the module for that cluster.

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

- Marathon-LB 1.11.0 or greater is required for DC/OS 1.10.0.

  Before upgrading to DC/OS 1.10.0, uninstall your existing Marathon-LB package and reinstall the updated version.

- REX-Ray configuration change.

  DC/OS 1.10.0 upgrades REX-Ray from v0.3.3 to v0.9.0 and the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the [`rexray_config`](/1.10/installing/oss/custom/configuration/configuration-parameters/#rexray-config) parameter of your `config.yaml` file, either update the configuration to the new format or remove `rexray_config` and set the parameter to `rexray_config_preset: aws`, which configures the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS.
  **Note:** The `rexray_config_preset: aws` option is only relevant to DC/OS clusters running on AWS.

- New flow to change the `dcos_url` and log in.

  The new command to set up your cluster URL is `dcos cluster setup <dcos_url>`. For details, see [CLI](#cli).

- Hard CFS CPU limits enabled by default.

  DC/OS 1.10 enforces hard CPU limits with CFS isolation for both the Docker and Universal Container Runtimes. This will give more predictable performance across all tasks but might lead to a slowdown for tasks (and thereby also deployments) who have previously have consumed more CPU cycles than allocated. See [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134) for more details.

## Known Issues
- Upgrade: During upgrade to DC/OS 1.10, there is a brief moment when the DNS resolution does not work. If a health check runs at that moment, it will fail and services will be reported as unhealthy.
- CORE-1125 - Docker image pull config is re-used.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- INFINITY-1809 - [Data Svc] DC/OS Service Update / Config Update / Maintenance. [enterprise type="inline" size="small" /]
- MARATHON-7736 - Marathon Client Java library does NOT work with Marathon 1.5.
