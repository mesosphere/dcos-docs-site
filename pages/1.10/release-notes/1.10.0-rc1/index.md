---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.0 Release Candidate 1
title: Release Notes for 1.10.0 Release Candidate 1
menuWeight: 55
excerpt:
---

These are the release notes for DC/OS 1.10.0 Release Candidate 1.

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;">

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/1.10.0-rc1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]
<h3>This release candidate is for testing only and not to be used in production.</h3>

DC/OS 1.10 Release Candidate 1 has a number of limitations that will be resolved at GA time.
<ul>
<li>You must upgrade Marathon-LB <em>before</em> upgrading to DC/OS 1.10.0. See the <a href="https://docs.mesosphere.com/1.10/installing/production/upgrading/">upgrade section</a> for more information.</li>

<li>During upgrade to 1.10, there is a brief moment when the DNS resolution does not work. If a health check runs at that moment, it will fail and services will be reported as unhealthy.</li>
</ul>

Please try out the new features and updated data services. Provide any feedback through our support channel: <a href="https://support.mesosphere.com/">support.mesosphere.com</a>.
</td> </tr> </table>

DC/OS 1.10 includes many new capabilities and expands the collection of data and developer services, with a focus on:
- Core DC/OS service continuity - System resilience, IAM scalability & simplified upgrades.
- Robust security - Custom CA certificate & file-based secrets support. [enterprise type="inline" size="small" /]
- Enterprise-ready networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Data services enhancements across the board.
  - Rolling configuration update and upgrade support via the CLI. [enterprise type="inline" size="small" /]
  - Ability to deploy Data Services into folders to enable multi team deployments. [enterprise type="inline" size="small" /]
  - Ability to deploy to CNI-Based virtual networks.

### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.10.0 Beta 2](#fixed-issues)

# <a name="new-features"></a>New Features and Capabilities

## Apache Mesos 1.4 and Marathon 1.5 Integrated.
- DC/OS 1.10.0 is based on Mesos 1.4.0, here using master branch (pre-release) SHA 013f7e21, with over 1200 commits since the previous Mesos version. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.10.0 is integrated with the latest release of Marathon, version 1.5. Resulting breaking changes and new features are documented below. For more information about Marathon 1.5, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

## Networking
- Configurable Spartan upstreams for domains (dnames).
  You can now configure Spartan to delegate a particular domain (e.g. "\*.foo.company.com") to a particular upstream. <!-- I could use more information here -->

- Increased CNI network support.
  DC/OS now supports any type of CNI network. [View the documentation](/1.10/networking/virtual-networks/cni-plugins/).

- Edge-LB load balancer. [enterprise type="inline" size="small" /]

  Edge-LB load balances Mesos tasks. Not supported in strict security mode in DC/OS Beta 1. [View the documentation](/services/edge-lb/0.1/).

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

## Updated DC/OS Data Services

- Rolling Configuration Update and Upgrades support via the CLI.
- Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are also in beta and are compatible with DC/OS 1.10.0.

- Beta Cassandra. [Documentation](/services/beta-cassandra/1.0.31-3.0.13-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/cassandra-1.0.31-3.0.13-beta).

- Beta Elastic. [Documentation](/services/beta-elastic/1.0.15-5.5.1-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/elastic-1.0.15-5.5.1-beta).

- Beta HDFS. [Documentation](/services/beta-hdfs/v1.3.3-2.6.0-cdh5.11.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/hdfs-1.3.3-2.6.0-cdh5.11.0-beta).

- Beta Kafka. [Documentation](/services/beta-kafka/1.1.26-0.10.1.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/kafka-1.1.26-0.10.1.0-beta).

- Spark. [Documentation](/services/spark/v1.1.1-2.2.0/). [Release Notes](https://github.com/mesosphere/spark-build/releases/tag/1.1.1-2.2.0).

## Platform
- Node and cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/1.10/installing/production/deploying-dcos/node-cluster-health-check/).
- Enhanced upgrades with [backup and restore](/1.10/administering-clusters/backup-and-restore/). [enterprise type="inline" size="small" /]
- Enhanced upgrades with pre/post flight checks.
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


## GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.
- The "Security" tab has been removed. The "Secrets" tab that used to be under "Security" is now a top-level tab. [enterprise type="inline" size="small" /]
- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.
- The "System Overview" tab has been renamed to "Overview".


<a name="breaking-changes"></a>
# Breaking Changes

- Marathon Networking API Changes in 1.5
  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md). <!-- linking to the marathon doc until I port the relevant information to the dc/os site -->

- TLS 1.0 is no longer enabled by default in Admin Router. [enterprise type="inline" size="small" /]

  TLS 1.0 no longer meets common minimum security requirements. To use TLS 1.0, set `adminrouter_tls_1_0_enabled` to `true` in your `config.yaml` at install time. The default is `false`.

- Marathon-LB 1.11.0 or greater is required for DC/OS 1.10.0. Before upgrading to 1.10.0, uninstall your existing Marathon-LB package and reinstall the updated version.

- Moved file location for the DC/OS CA bundle in the sandbox of Mesos tasks from `$MESOS_SANDBOX/.ssl/ca.crt` to `$MESOS_SANDBOX/.ssl/ca-bundle.crt` and declared the new file path to be stable.

- REX-Ray configuration change.
  DC/OS 1.10.0 upgrades REX-Ray from v03.3 to v0.9.0 and the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the [`rexray_config`](/1.10/installing/production/advanced-configuration/configuration-reference/#rexray-config) parameter of your `config.yaml` file, either update the configuration to the new format or remove `rexray_config` and set the parameter to `rexray_config_preset: aws`, which configures the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS. **Note:** The `rexray_config_preset: aws` option is only relevant to DC/OS clusters running on AWS.

- New flow to change the `dcos_url` and log in.
  The new command to set up your cluster URL is `dcos cluster setup <dcos_url>`. For details, see [CLI](#cli).

- Marathon Jenkins Plugin and Marathon-Client Breaking Change
  Marathon 1.5, released with DCOS 1.10, made breaking changes to the API around Docker and management of networks. This breaking change has not yet been incorporated in the marathon-client, which is used by the marathon jenkins plugin. Marathon client and Marathon Jenkins Plugin _will_ work in general, however they will _fail_ to propagate configurations for networks if working with DCOS 1.10 or Marathon 1.5. A solution will be provided for the DCOS 1.10 GA release.

# <a name="known-issues"></a>Known Issues and Limitations
- Upgrade: During upgrade to 1.10, there is a brief moment when the DNS resolution does not work. If a health check runs at that moment, it will fail and services will be reported as unhealthy.
- DCOS-14534 - Marathon: Verbose Server Banner.
- DCOS-14536 - UI Vulnerable to Clickjacking (aka UI Redressing).
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- DCOS_OSS-1340 - Spartan "autoip" DNS should resolve to host IP for UCR in bridge network.
- INFINITY-1143 - Update / Uninstall. DSE does not support rolling upgrade.
- INFINITY-1809 - [Data Svc] DC/OS Service Update / Config Update / Maintenance.
- MARATHON-7736 - Marathon Client does NOT work with Marathon 1.5

# <a name="fixed-issues"></a>Major Issues Fixed Since 1.10.0 Beta 2

- DCOS-15590 - DCOS cli confirm() is not non-interactive safe.
- INFINITY-213 - Integrate with DC/OS access controls. [enterprise type="inline" size="small" /]
- INFINITY-1356 - Support strict mode for DSE. [enterprise type="inline" size="small" /]
- INFINITY-2003 - Make C/* backup and restore tests work in strict mode. [enterprise type="inline" size="small" /]
- INFINITY-2054	- Extend --replace={true|false} for <framework> CLI.
