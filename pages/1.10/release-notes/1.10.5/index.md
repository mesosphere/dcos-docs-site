---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.5
title: Release Notes for 1.10.5
menuWeight: 25
excerpt:
---

DC/OS 1.10.5 was released on February 22, 2018.

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.10.5/dcos_generate_config.sh"]Download DC/OS Open Source[/button]


# Issues Fixed in DC/OS 1.10.5

- COPS-1963 - The agent admin router no longer exposes the default Nginx page.
- DCOS-13824 - Removed list of cluster packages from cloud config and turned it into a build artifact that is downloaded during node setup.
- DCOS-18784 - The DC/OS UI now shows the correct number of instances in a pod.
- DCOS-19008 - Master certificates now include exhibitor_address if exhibitor_address is an IP address. [enterprise type="inline" size="small"/]
- DCOS-20629 - Fixed a deadlock in the go-zookeeper library.
- DCOS-20683 - Fixed an error in encoding metrics to JSON when executing the DataDog plugin for DC/OS.
- DCOS-20158 - Updated marked npm package to address two security vulnerabilities: [CVE-2017-17461](https://nvd.nist.gov/vuln/detail/CVE-2017-17461) and [CVE-2017-1000427](https://nvd.nist.gov/vuln/detail/CVE-2017-1000427).
- DCOS-20184 - Users can now be authenticated if two non-leading master nodes are simultaneously partitioned from the network, via IP tables.
- DCOS-20352 - Fixed a configuration issue with CockroachDB related to the number of master nodes. [enterprise type="inline" size="small"/]
- DCOS-19694 - Fixed an issue for backwards-incompatibility with CockroachDB. [enterprise type="inline" size="small"/]
- DCOS_OSS-1919 - A master node in a DC/OS cluster with three master nodes now restarts after termination.
- DCOS_OSS-2003 - Modified DC/OS overlay networking to work with systemd networkd.
- DCOS_OSS-2095 - Fixed an issue with the scheduled_jobs API in Metronome 0.3.4.

# Notable Changes in DC/OS 1.10.5

- Updated to Marathon 1.5.6 ([changelog](https://github.com/mesosphere/marathon/releases/tag/v1.5.6)).
- Updated to Mesos 1.4.2-92d988c ([changelog](https://github.com/apache/mesos/blob/92d988c/CHANGELOG)).
- DCOS_OSS-2128 - Bumped Mesos package to 1.4.x version.

# Issues Fixed in DC/OS 1.10.4

- CORE-1375 - Docker executor does not hang due to lost messages.
- DOCS-2169 - Updated [ports list](https://docs.mesosphere.com/1.10/installing/ent/ports/) for DC/OS. [enterprise type="inline" size="small"/]
- DCOS-18777 - DC/OS CA certificate bundle now gets propagated to public slaves. [enterprise type="inline" size="small"/]
- DCOS-19327 - Diagnostics bundles no longer contain sensitive cluster configuration values related to Cloudformation templates.
- DCOS-19399 - Marathon now supports upgrading to JDK 1.8.0_152.
- DCOS_OSS-1828 - Prometheus plugin now authenticates on master nodes.
- DCOS_OSS-1898 - DC/OS CLI can now retrieve metrics for Dockerized tasks.
- DCOS_OSS-1942 - Prometheus plugin now has permissions to access file socket.

# Notable Changes in DC/OS 1.10.4

- Updated to Marathon 1.5.5 ([changelog](https://github.com/mesosphere/marathon/releases/tag/v1.5.5)).
- DC/OS Java Developer Kit updated to the latest version: JDK 8u152.
- DC/OS compatible with the newest Docker version: 17.05.0.

# Issues Fixed in DC/OS 1.10.3

- Fixed an issue related to a failure mode in DC/OS IAM (Identity and Access Manager), which can cause DC/OS master nodes not to come online for a period of time after failover or restart. [enterprise type="inline" size="small" /]

# Issues Fixed in DC/OS 1.10.2

- DCOS_OSS-1508 - The DC/OS CLI now ignores output when opening a browser window so that users do not see error information when prompted for the authentication token.
- DCOS_OSS-1795 - Removed sensitive config values from diagnostics bundles and build output.
- DCOS_OSS-1818 - DC/OS Metrics now sanitizes metrics names.
- DCOS_OSS-1825 - DC/OS layer 4 load balancer now periodically checks that the IPVS configuration matches the desired configuration and reapplies if the configuration is absent.
- DCOS-17192 - When using a custom CA certificate, the DC/OS bootstrap no longer stores the cluster private key in ZooKeeper as an operator is responsible for copying the private key to all master nodes. [enterprise type="inline" size="small" /]
- DCOS-19009 - The DC/OS CLI can now retrieve metrics for DC/OS data services.
- DCOS-19090 - Fixed undocumented privilege being required for setting up CLI access for a non-superuser. [enterprise type="inline" size="small" /]
- DCOS-19383 - UI: Secrets are no longer removed from an app when non-superusers edit a Marathon service that uses secrets. [enterprise type="inline" size="small" /]
- DCOS-19452 - The DC/OS OpenSSL library is now configured to not support TLS compression anymore (compression allows for the CRIME attack). [enterprise type="inline" size="small" /]

# Notable Changes in DC/OS 1.10.2

- Support for RHEL 7.4.
- Updated to Mesos 1.4.0 ([changelog](https://github.com/apache/mesos/blob/92d988c/CHANGELOG)).
- Updated to Marathon 1.5.2 ([changelog](https://github.com/mesosphere/marathon/releases/tag/v1.5.2)).
- DCOS-17947 - Updated configuration example for a cluster that uses [custom Docker credentials](/1.10/installing/ent/custom/configuration/examples/#docker-credentials). [enterprise type="inline" size="small"/]
- DCOS-19360 - Added clarifications to the [custom CA certificate installation documentation](/1.10/installing/ent/custom/configuration/configuration-parameters/#ca-certificate-path-enterprise). [enterprise type="inline" size="small"/]
- DOCS-1925 - Clarified how operators can [recover from a full agent disk](/1.10/administering-clusters/recovering-agent-disk-space/).
- DOCS-2153 - Updated [Metrics names](/1.10/metrics/reference/).

# Issues Fixed in DC/OS 1.10.1

- COPS-974 - Master node fails to start after configuration change. This was was due to tmp mountpoints being marked as noexec. Bug fixed.
- COPS-1293 - Timeout creating service account. The timeout was due to tmp mountpoints being marked as noexec. Bug fixed. [enterprise type="inline" size="small" /]
- DCOS-17600 - Fix security CLI secret creation following wrong secret schema. This fix clarifies which fields the secrets service stores. [enterprise type="inline" size="small" /]
- DCOS-18212 - In the UI, the name of the containerizer runtime in the service creation form has been changed from MESOS RUNTIME to UNIVERSAL CONTAINER RUNTIME (UCR).
- DCOS-18634 - DC/OS authenticator fails to cache Bouncer's public key, causing an increase in request rates against Bouncer's JWKS endpoint. Bug fixed. [enterprise type="inline" size="small" /]
- DCOS-18694 - Pod Endpoints protocol json parser adds 0 to json. Bug fixed.
- DCOS-18788 - The JSON editor duplicates and fails to properly parse app definition. Bug fixed.
- DCOS-19197 - DC/OS UI deletes environment variables with non-string values from Marathon app/pod definitions. Bug fixed.
- DCOS_OSS-1661 - Installer prints large traceback when checks fail during --postflight. A clearer error message is now provided.
- DOCS-2077 - DC/OS 1.10 Custom Installation documentation: clarified where the `/opt/mesosphere` directory must be.

# Notable Changes in DC/OS 1.10.1

- Support for Docker CE 17.03.0.
- Marathon 1.5.1.2 and Mesos 1.4.0-rc4 are integrated with DC/OS 1.10.1.
- DCOS-18055 - Improvements for deployment behavior in Catalog. You now have a "Review & Run" button that allows you to cancel, modify your configuration, or install with defaults.
- Support for Centos 7.4.

# Issues Fixed in DC/OS 1.10.0

- CASSANDRA-457 - Redirect deprecated `/v1/nodes/connect` to `/v1/connect`.
- CORE-849 - Support DC/OS commons services on public agents.
- DCOS-13988 - Filter/Search Design Update.
- DCOS-16029 - Addition of new `pullConfig` properties break validation.
- DCOS-10863 - Launch containers on `DockerContainerizer` if network mode is "NONE".
- DCOS_OSS-1340 - Spartan "autoip" DNS should resolve to host IP for UCR in bridge network. [enterprise type="inline" size="small" /]
- INFINITY-1143 - Update / Uninstall. DSE does not support rolling upgrade. [enterprise type="inline" size="small" /]
- MARATHON_EE-734 - Marathon needs to support a default "bridge" network for UCR.

# About DC/OS 1.10

DC/OS 1.10.0 includes many new capabilities for Operators and expands the collection of Data & Developer Services with a focus on:

- Core DC/OS service continuity - System resilience, IAM scalability & simplified upgrades.
- Robust security - Custom CA certificate & file-based secrets support. [enterprise type="inline" size="small" /]
- Enterprise-ready networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Kubernetes is now available on DC/OS.
- Data services enhancements across the board.
  - Rolling configuration update and upgrade support via the CLI. [enterprise type="inline" size="small" /]
  - Ability to deploy Data Services into folders to enable multi team deployments. [enterprise type="inline" size="small" /]
  - Ability to deploy to CNI-Based virtual networks.

Please try out the new features and updated data services. Provide any feedback through our support channel: <a href="https://support.mesosphere.com/">support.mesosphere.com</a>.

### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)

# <a name="new-features"></a>New Features and Capabilities

## Apache Mesos 1.4 and Marathon 1.5 Integrated.
- DC/OS 1.10.0 is based on Mesos 1.4.0, here using master branch (pre-release) SHA 013f7e21, with over 1200 commits since the previous Mesos version. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.10.0 is integrated with the latest release of Marathon, version 1.5. Resulting breaking changes and new features are documented below. For more information about Marathon 1.5, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Networking
- Configurable Spartan upstreams for domains (dnames).
  You can now configure Spartan to delegate a particular domain (e.g. "\*.foo.company.com") to a particular upstream.

- Increased CNI network support.
  DC/OS now supports any type of CNI network. [View the documentation](/1.10/networking/virtual-networks/cni-plugins/).

- Edge-LB load balancer. [enterprise type="inline" size="small" /]

  Edge-LB load balances Mesos tasks. Not supported in strict security mode. [View the documentation](/services/edge-lb/0.1/).

[enterprise type="block" size="large"]
## Security
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

## Kubernetes on DC/OS

- Kubernetes on DC/OS is beta with DC/OS 1.10.0. Install from the DC/OS Service Catalog or use the [quickstart](https://github.com/mesosphere/dcos-kubernetes-quickstart).

## Updated DC/OS Data Services

- Rolling Configuration Update and Upgrades support via the CLI. [enterprise type="inline" size="small" /]
- Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are compatible with DC/OS 1.10.0.

- Cassandra. [Documentation](/services/cassandra/). [Release Notes](/services/cassandra/v2.0.0-3.0.14/release-notes/).

- Elastic. [Documentation](/services/elastic/). [Release Notes](/services/elastic/2.0.1-5.5.1/release-notes/).

- HDFS. [Documentation](/services/hdfs/). [Release Notes](/services/hdfs/v2.0.0-2.6.0-cdh5.11.0/release-notes/).

- Kafka. [Documentation](/services/kafka/). [Release Notes](/services/kafka/v2.0.0-0.11.0/release-notes/).

- Apache Spark. [Documentation](/services/spark/). [Release Notes](https://github.com/mesosphere/spark-build/releases/tag/1.1.1-2.2.0).

## Platform
- Node and cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/1.10/installing/production/deploying-dcos/node-cluster-health-check/).
- Enhanced upgrades with [backup and restore](/1.10/administering-clusters/backup-and-restore/), and pre/post flight checks. [enterprise type="inline" size="small" /]
- Universal Container Runtime (UCR).
  Adds port mapping support for containers running on the CNI network. Port mapping support allows UCR to have a default bridge network, similar to Docker's default bridge network. This gives UCR feature parity with Docker Engine enabling use of Mesos Runtime as the default container runtime.
- Scale and performance limits.

## CLI

- DC/OS 1.10.0 requires DC/OS CLI 0.5.x.
- DC/OS CLI 0.5.x adds [multi-cluster support](/1.10/cli/multi-cluster-cli/) with [`dcos cluster`](/1.10/cli/command-reference/dcos-cluster/) commands. Multi-cluster support has a number of consequences:

   - DC/OS CLI 0.4.x and 0.5.x use a different structure for the location of configuration files. DC/OS CLI 0.4.x has a single configuration file, which by default is stored in `~/.dcos/dcos.toml`. DC/OS CLI 0.5.x has a configuration file for each connected cluster, which by default are stored in `~/.dcos/clusters/<cluster_id>/dcos.toml`.
   - DC/OS CLI 0.5.x introduces the `dcos cluster setup` command to configure a connection to a cluster and log into the cluster.
   - **Note:**
     -  Updating to the DC/OS CLI 0.5.x and running any CLI command triggers conversion from the old to the new configuration structure.
     - _After_ you call `dcos cluster setup`, (or after conversion has occurred), if you attempt to update the cluster configuration using a `dcos config set` command, the command prints a warning message saying the command is deprecated and cluster configuration state may now be corrupted.
  - If you have the `DCOS_CONFIG` environment variable configured:
    - After conversion to the new configuration structure, `DCOS_CONFIG` is no longer honored.
    - _Before_ you call `dcos cluster setup`, you can change the configuration pointed to by `DCOS_CONFIG` using `dcos config set`. This command prints a warning message saying the command is deprecated and recommends using `dcos cluster setup`.
  - CLI modules are cluster-specific and stored in `~/.dcos/clusters/<cluster_id>/subcommands`. Therefore you must install a CLI module for each cluster. For example, if you connect to cluster 1, and install the Spark module, then connect to cluster 2 which is also running Spark, Spark CLI commands are not available until you install the module for that cluster.

## GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.
- The "Security" tab has been removed. The "Secrets" tab that used to be under "Security" is now a top-level tab. [enterprise type="inline" size="small" /]
- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.
- The "System Overview" tab has been renamed to "Overview".


<a name="breaking-changes"></a>
# Breaking Changes

- Marathon Networking API Changes in 1.5.

  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md).

- TLS 1.0 is no longer enabled by default in Admin Router. [enterprise type="inline" size="small" /]

  TLS 1.0 no longer meets common minimum security requirements. To use TLS 1.0, set `adminrouter_tls_1_0_enabled` to `true` in your `config.yaml` at install time. The default is `false`.

- Moved file location for the DC/OS CA bundle in the sandbox of Mesos tasks from `$MESOS_SANDBOX/.ssl/ca.crt` to `$MESOS_SANDBOX/.ssl/ca-bundle.crt` and declared the new file path to be stable.

- Marathon-LB 1.11.0 or greater is required for DC/OS 1.10.0.

  Before upgrading to DC/OS 1.10.0, uninstall your existing Marathon-LB package and reinstall the updated version.

- REX-Ray configuration change.

  DC/OS 1.10.0 upgrades REX-Ray from v0.3.3 to v0.9.0 and the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the [`rexray_config`](/1.10/installing/oss/custom/configuration/configuration-parameters/#rexray-config) parameter of your `config.yaml` file, either update the configuration to the new format or remove `rexray_config` and set the parameter to `rexray_config_preset: aws`, which configures the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS. **Note:** The `rexray_config_preset: aws` option is only relevant to DC/OS clusters running on AWS.

- New flow to change the `dcos_url` and log in.

  The new command to set up your cluster URL is `dcos cluster setup <dcos_url>`. For details, see [CLI](#cli).

- Hard CFS CPU limits enabled by default.

  DC/OS 1.10 enforces hard CPU limits with CFS isolation for both the Docker and Universal Container Runtimes. This will give more predictable performance across all tasks but might lead to a slowdown for tasks (and thereby also deployments) who have previously have consumed more CPU cycles than allocated. See [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134) for more details.

# <a name="known-issues"></a>Known Issues and Limitations
- Upgrade: During upgrade to DC/OS 1.10, there is a brief moment when the DNS resolution does not work. If a health check runs at that moment, it will fail and services will be reported as unhealthy.
- CORE-1125 - Docker image pull config is re-used.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- INFINITY-1809 - [Data Svc] DC/OS Service Update / Config Update / Maintenance. [enterprise type="inline" size="small" /]
- MARATHON-7736 - Marathon Client Java library does NOT work with Marathon 1.5.
