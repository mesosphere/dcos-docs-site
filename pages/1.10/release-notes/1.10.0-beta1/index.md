---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.0 Beta 1
title: Release Notes for 1.10.0 Beta 1
menuWeight: 65
excerpt:
---
These are the release notes for DC/OS 1.10.0 Beta 1.

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/commit/cc50fd59477f90c1881aa5ad02a81d174d3e42ed/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

This beta release is for testing only and not to be used in production. It will only support new installations. 

DC/OS 1.10 Beta 1 has a number of limitations that will be resolved at GA time.
- Upgrades from 1.9 are not supported.
- DC/OS 1.10 requires CLI version 0.5.3.
  - [Uninstall the existing CLI](/1.10/cli/uninstall/)
- Install version 0.5.3 using the *Install CLI* instructions in the dropdown in the upper left hand corner of the 1.10 DC/OS GUI.
*Note:* CLI version 0.5.3 is not compatible with DC/OS 1.9.
If you cannot access Marathon and you see <code>the trustAnchors parameter must be non-empty</code> in the logs, restart Marathon. Restart Marathon by entering the following command on the master node with the leading Marathon master: <code>sudo systemctl restart dcos-marathon.service</code>.</li>

Please try out the new features and updated data services. Provide any feedback through our support channel: [support.mesosphere.com](https://support.mesosphere.com/).

DC/OS 1.10 includes many new capabilities and expands the collection of data and developer services, with a focus on:
- Core DC/OS Service Continuity - System resilience, IAM Scalability & simplified upgrades.
- Robust Security - Custom CA & File-Based Secrets Support. [enterprise type="inline" size="small" /]
- Enterprise-Ready Networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Data services enhancements across the board.
  - Rolling Configuration Update and Upgrades support via CLI.
  - Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
  - Ability to deploy to CNI-Based Virtual Networks.

### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.9.0](#fixed-issues)

# <a name="new-features"></a>New Features and Capabilities

## Apache Mesos 1.4 and Marathon 1.5 Integrated.
- DC/OS 1.10 is is based on Mesos 1.4.0, here using master branch (pre-release) SHA 013f7e21, with over 1200 commits since the previous Mesos version. View the [changelog](https://github.com/apache/mesos/blob/master/CHANGELOG).

- DC/OS 1.10 is integrated with the latest release of Marathon, version 1.5. Resulting breaking changes and new features are documented below. For more information about Marathon 1.5, consult the [Marathon changelog](https://github.com/mesosphere/marathon/blob/master/changelog.md).

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
  Installation time [configuration options](/1.10/installing/production/advanced-configuration/configuration-reference/#security-enterprise) have been added that allow you to configure DC/OS Enterprise to use a custom CA certificate and corresponding private key, which DC/OS then uses for issuing all component certificates.

- Increased Admin Router security. <!-- ie TLS not supported out-of-the-box; where is the doc? is this enterprise-only?-->

- Enhanced secrets management with file-based secrets.
  You can now make a secret available to your service in the sandbox of the task. [View the documentation](/1.10/security/ent/secrets/use-secrets/).

- Docker `pullConfig` parameter.
  Use this parameter in your service definition to authenticate to a private Docker registry. [View the documentation](/1.10/deploying-services/private-docker-registry/#referencing-private-docker-registry-credentials-in-the-secrets-store-enterprise).

## Updated DC/OS Data Services

- Rolling Configuration Update and Upgrades support via CLI.
- Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
- Ability to deploy to CNI-Based Virtual Networks.

The following updated data services packages are also in beta and are compatible with DC/OS 1.10.

- Beta Cassandra. [Documentation](/services/beta-cassandra/1.0.31-3.0.13-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/cassandra-1.0.31-3.0.13-beta).

- Beta Elastic. [Documentation](/services/beta-elastic/1.0.15-5.5.1-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/elastic-1.0.15-5.5.1-beta).

- Beta HDFS. [Documentation](/services/beta-hdfs/v1.3.3-2.6.0-cdh5.11.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/hdfs-1.3.3-2.6.0-cdh5.9.1-beta).

- Beta Kafka. [Documentation](/services/beta-kafka/1.1.26-0.10.1.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/kafka-1.1.26-0.10.1.0-beta).

- Spark. [Documentation](/services/spark/v1.1.1-2.2.0/). [Release Notes](https://github.com/mesosphere/spark-build/releases/tag/1.1.1-2.2.0).

## Platform
- Node and Cluster health checks.
  Write your own custom health checks or use the predefined checks to access and use information about your cluster, including available ports, Mesos agent status, and IP detect script validation. [View the documentation](/1.10/installing/production/deploying-dcos/node-cluster-health-check/).
- Enhanced upgrades with [backup and restore](/1.10/administering-clusters/backup-and-restore/). [enterprise type="inline" size="small" /]
- Enhanced upgrades with pre/post flight checks.
- UCR. <!-- have there been updates? -->
- Scale and performance limits.

## CLI
- Multi-cluster support. [View the documentation](/1.10/cli/multi-cluster-cli/).

## GUI
The GUI sidebar tabs have been updated to offer a more intuitive experience.

- The "Deployments" subpage under the "Services" tab has been moved to a toggle-able modal in the "Services" page.
- The "Security" tab has been removed. The "Secrets" tab that used to be under "Security" is now a top-level tab. [enterprise type="inline" size="small" /]
- The "Universe" tab has been renamed to "Catalog" and the "Installed" subpage has been removed.
- The "System Overview" tab has been renamed to "Overview".


<a name="breaking-changes"></a>
# Breaking Changes

- Upgrades not supported in 1.10 Beta 1.
  Upgrades from 1.9 to 1.10 are _not supported_ in 1.10 Beta 1. Upgrades will be supported in 1.10 Beta 2.

- Marathon Networking API Changes in 1.5
  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md). <!-- linking to the marathon doc until I port the relevant information to the dc/os site -->

- TLS 1.0 is no longer enabled by default in Admin Router. [enterprise type="inline" size="small" /]

  TLS 1.0 no longer meets common minimum security requirements. To use TLS 1.0, set `adminrouter_tls_1_0_enabled` to `true` in your `config.yaml` at install time. The default is `false`.
<!-- relevant to beta 2
## Latest version of Marathon-LB is required for 1.10
Before upgrading to 1.10, uninstall your existing Marathon-LB package and reinstall the updated version.
-->

- Moved file location for the DC/OS CA bundle in the sandbox of Mesos tasks from `$MESOS_SANDBOX/.ssl/ca.crt` to `$MESOS_SANDBOX/.ssl/ca-bundle.crt` and declared the new file path to be stable.

- REX-Ray configuration change
  DC/OS 1.10 upgrades REX-Ray from v03.3. to v0.9.0 and therefore the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the `rexray_config` parameter of your `config.yaml` file, change the parameter to `rexray_config_preset: aws`.

- New flow to change the `dcos_url` and login
  The new command to change your cluster URL is `dcos cluster setup <dcos_url>`. This change will break any existing tooling that uses the former command. Backwards compatibility is slated for a future patch release.

# <a name="known-issues"></a>Known Issues and Limitations

- CASSANDRA-613 - Replace of Cassandra Nodes doesn't work with duplicate Hostname/IPs.
- DCOS-9444 - Task Remaining on Marathon 15.7 from guano backup. <!-- unclear from the Jira if this has been resolved or is even relevant -->
- DCOS-13762 - SDK Integration with DC/OS Folders. [enterprise type="inline" size="small" /]
- DCOS-14534 - Marathon: Verbose Server Banner.
- DCOS-14535 - Marathon GUI: Error Messages are Too Verbose.
- DCOS-14536 - UI Vulnerable to Clickjacking (aka UI Redressing).
- DCOS-15284 - Marathon Task Stuck.
- DCOS-15590 - DCOS cli confirm() is not non-interactive safe.
- DCOS-15937 - Pods do not receive SIGTERM.
- DCOS-16151 - Marathon Endpoints are not responding.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- DCOS-16564 - UI error message references Marathon command.
- DCOS-17294 - Unable to curl (resolve) applications using Mesos DNS names.
- DCOS-17321 - Fix upgrade of Marathon-lb from 1.9-1.10.
- DCOS-17502 - AdminRouter rejecting request to install package.
- DCOS_OSS-1340 - Spartan "autoip" DNS should resolve to host IP for UCR in bridge network.
- DCOS_OSS-1486 - Metrics agent crashes when the mesos containers endpoint is missing fields.
- INFINITY-213 - Integrate with DC/OS access controls.
- INFINITY-1143 - Update / Uninstall. DSE does not support rolling upgrade.
- INFINITY-1356 - Support strict mode for DSE. [enterprise type="inline" size="small" /]
- INFINITY-1809 - [Data Svc] DC/OS Service Update / Config Update / Maintenance.
- INFINITY-2003 - Make C* backup and restore tests work in strict mode. [enterprise type="inline" size="small" /]
- INFINITY-2054	- Extend --replace={true|false} for <framework> CLI. <!-- this doesn't seem like a known issue? -->
- MARATHON-7654 - Marathon cannot replace persistent tasks for rebooted hosts until the Mesos Master forgets about the old agent.
- MESOS-6950 - Launching two tasks with the same Docker image simultaneously may cause a staging dir never cleaned up.

# <a name="fixed-issues"></a>Major Issues Fixed Since 1.9.0

- DCOS-10873 - Marathon - Groups (and apps) endpoints return deprecated field.
- DCOS-10928 - Marathon leader election fails after OS upgrade.
- DCOS-11242 - Rounding issue with memory UI.
- DCOS-12154 - Minuteman: Failed to parse task.
- DCOS-13595 - Incomplete uninstall of package kafka due to Mesos unavailability.
- DCOS-14644 - Cannot use systemd socket for pkgpanda API.
- DCOS-14852 - Cosmos - Installed packages tab not functioning.
- DCOS-14872 - Filesystem corruption in dcos-ui container.
- DCOS-14886 - Updated the internal diagnostics utility (`dcos-3dt.service`).
- DCOS-15044 - Metrics API returning null value for datapoint for Cassandra service.
- DCOS-15232 - DC/OS Services UI does not expose the Service ports for a service.
- DCOS-15247 - Spartan repeatedly crashing on some nodes.
- DCOS-15302 - Pkgpanda redirects stderr to stdout.
- DCOS-15307 - Cannot "dcos task exec" to tasks in pods.
- DCOS-15332 - DC/OS login prompt vulnerability.
- DCOS-15505 - Jenkins Marathon Plug-in so it does not strip out the VIP specifications.
- DCOS-15653 - Excessive log rotation for Mesos logs.
- DCOS-16588 - In 1.9, the Mesos-DNS component by default did not set the truncate bit in responses. This is non-conforming behavior. The new default in 1.10 will be to set the truncate bit if the response is too large to fit in a single packet and therefore gets truncated. If you do not want TCP retry, set `mesos_dns_set_truncate_bit` to `false` in your `config.yaml` file at install time. The default is `true`. <!-- not sure if this is resolved; depends on https://jira.mesosphere.com/browse/DCOS-15771 -->
- DCOS-16725 - Marathon /ping Response Headers Changes on DC/OS 1.8.7 to 1.9.
- DCOS_OSS-839 - Upgrade script fails silently.
- DCOS_OSS-902 - Minuteman code in separate repo from navstr.
- DCOS_OSS-980 - Docker 1.12 and later breaks virtual networks.
- ELASTIC-79 - Elastic package doesn't work offline.
- INFINITY-1784- PortsSpec/PortSpec compatibility in latest beta-elastic.
- KAF-334 - Unable to replace/restart kafka brokers after node restart.
- MESOS-5187 - The filesystem/linux isolator does not set the permissions of the host_path.
- MESOS-7830 - Sandbox_path volume does not have ownership set correctly.
- SPARK-266	- Cannot use spark-shell.
- [PR 1395] - Add HTTP routing for Azure templates.
- Updated `dcos-launch`, now includes [user's guide](https://github.com/dcos/dcos-launch/blob/master/README.md).
- Pods and other v1 executors are supported in strict security mode.
