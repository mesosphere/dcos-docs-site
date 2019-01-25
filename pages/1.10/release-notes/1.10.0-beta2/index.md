---
layout: layout.pug
navigationTitle:  Release Notes for 1.10.0 Beta 2
title: Release Notes for 1.10.0 Beta 2
menuWeight: 60
excerpt:
---

These are the release notes for DC/OS 1.10.0 Beta 2.

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/commit/66e3d4582d38ef6373ae489a219400a36ae5064d/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

This beta release is for testing only and not to be used in production. 

DC/OS 1.10.0 Beta 2 has a number of limitations that will be resolved at GA time:
- Upgrades from 1.10 Beta 1 to 1.10 Beta 2 are not currently supported.
- DC/OS 1.10 requires CLI version 0.5.3.
  - [Uninstall the existing CLI](/1.10/cli/uninstall/)
  - Install version 0.5.3 using the <strong>Install CLI</strong> instructions in the dropdown in the upper left hand corner of the 1.10 DC/OS GUI.
- You must upgrade Marathon-LB _before_ upgrading to DC/OS 1.10. See the [upgrade section](/1.10/installing/production/upgrading/) for more information.
*Note:* CLI version 0.5.3 is not compatible with DC/OS 1.9.

Please try out the new features and updated data services. Provide any feedback through our support channel: [support.mesosphere.com](https://support.mesosphere.com/).

DC/OS 1.10 includes many new capabilities and expands the collection of data and developer services, with a focus on:
- Core DC/OS Service Continuity - System resilience, IAM Scalability & simplified upgrades.
- Robust Security - Custom CA & File-Based Secrets Support. [enterprise type="inline" size="small" /]
- Enterprise-Ready Networking - New DC/OS Edge-LB for higher availability and security. [enterprise type="inline" size="small" /]
- Data services enhancements across the board.
  - Rolling Configuration Update and Upgrades support via CLI. [enterprise type="inline" size="small" /]
  - Ability to deploy Data Services into Folders to enable multi team deployments. [enterprise type="inline" size="small" /]
  - Ability to deploy to CNI-Based Virtual Networks.

### Contents
- [New Features and Capabilities](#new-features)
- [Breaking Changes](#breaking-changes)
- [Known Issues and Limitations](#known-issues)
- [Issues Fixed since 1.10.0 Beta 1](#fixed-issues)

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

- Beta HDFS. [Documentation](/services/beta-hdfs/v1.3.3-2.6.0-cdh5.11.0-beta/). [Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/hdfs-1.3.3-2.6.0-cdh5.11.0-beta).

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

- Upgrades not supported from 1.10.0 Beta 1.
  Upgrades from 1.10.0 Beta 1 to 1.10.0 Beta 2 are _not supported_ in 1.10.0 Beta 2. This upgrade will be supported in a future 1.10 release.

- Marathon Networking API Changes in 1.5
  The networking section of the Marathon API has changed significantly in version 1.5. Marathon can still accept requests using the 1.4 version of the API, but it will always reply with the 1.5 version of the app definition. This will break tools that consume networking-related fields of the service definition. [View the documentation](https://github.com/mesosphere/marathon/blob/master/docs/docs/networking.md). <!-- linking to the marathon doc until I port the relevant information to the dc/os site -->
- Moved file location for the DC/OS CA bundle in the sandbox of Mesos tasks from `$MESOS_SANDBOX/.ssl/ca.crt` to `$MESOS_SANDBOX/.ssl/ca-bundle.crt` and declared the new file path to be stable.

- TLS 1.0 is no longer enabled by default in Admin Router. [enterprise type="inline" size="small" /]

  TLS 1.0 no longer meets common minimum security requirements. To use TLS 1.0, set `adminrouter_tls_1_0_enabled` to `true` in your `config.yaml` at install time. The default is `false`.

## Latest version of Marathon-LB 

Before upgrading to 1.10, uninstall your existing Marathon-LB package and reinstall the updated version.

- REX-Ray configuration change
  DC/OS 1.10 upgrades REX-Ray from v03.3. to v0.9.0 and the REX-Ray configuration format has changed. If you have specified custom REX-Ray configuration in the [`rexray_config`](/1.10/installing/production/advanced-configuration/configuration-reference/#rexray-config) parameter of your `config.yaml` file, either update the configuration to the new format or remove `rexray_config` and set the parameter to `rexray_config_preset: aws`, which configures the `rexray_config` parameter to the default REX-Ray configuration bundled with DC/OS. This option has the benefit of automatically upgrading your cluster's REX-Ray configuration when you upgrade to a newer version of DC/OS. **Note:** The `rexray_config_preset: aws` option is only relevant to DC/OS clusters running on AWS.

- New flow to change the `dcos_url` and log in
  The new command to set up your cluster URL is `dcos cluster setup <dcos_url>`. This change breaks any existing tooling that uses the former command `dcos config set core.dcos_url <dcos_url>`. Backwards compatibility is slated for a future patch release.

# <a name="known-issues"></a>Known Issues and Limitations

- DCOS-13762 - SDK Integration with DC/OS Folders. [enterprise type="inline" size="small" /]
- DCOS-14534 - Marathon: Verbose Server Banner.
- DCOS-14536 - UI Vulnerable to Clickjacking (aka UI Redressing).
- DCOS-15590 - DCOS cli confirm() is not non-interactive safe.
- DCOS-16547 - Task state does not update after the agent running it was removed from the cluster.
- DCOS_OSS-1340 - Spartan "autoip" DNS should resolve to host IP for UCR in bridge network.
- INFINITY-213 - Integrate with DC/OS access controls. [enterprise type="inline" size="small" /]
- INFINITY-1143 - Update / Uninstall. DSE does not support rolling upgrade.
- INFINITY-1356 - Support strict mode for DSE. [enterprise type="inline" size="small" /]
- INFINITY-1809 - [Data Svc] DC/OS Service Update / Config Update / Maintenance.
- INFINITY-2003 - Make C* backup and restore tests work in strict mode. [enterprise type="inline" size="small" /]
- INFINITY-2054	- Extend --replace={true|false} for <framework> CLI. <!-- this doesn't seem like a known issue? -->

# <a name="fixed-issues"></a>Major Issues Fixed Since 1.10.0 Beta 1

- Upgrades from DC/OS 1.9 are supported.
- CASSANDRA-613 - Replace of Cassandra Nodes doesn't work with duplicate Hostname/IPs.
- DCOS-5809	- Admin Router: use "variables approach" for DNS name re-resolution instead of periodic worker process reload.
- DCOS-9794	- secrets CLI subcommand: bad error handling when an unauthorized user tries to fetch a secret. [enterprise type="inline" size="small" /]
- DCOS-14469 - Pods displaying duplicate image of same container.
- DCOS-14535 - Marathon GUI: Error Messages are Too Verbose.
- DCOS-15902 - Add documentation for the dcos-backup CLI. [enterprise type="inline" size="small" /]
- DCOS-15937 - Pods do not receive SIGTERM.
- DCOS-16088 - The flow for changing the dcos_url and login has changed.
- DCOS-16144 - DC/OS CLI: AttributeError: 'str' object has no attribute 'status_code'.
- DCOS-16151 - Marathon Endpoints are not responding.
- DCOS-16225 - Edit modal for SDK services should mention the CLI.
- DCOS-16528 - Incorrect command in Edit Service modal.
- DCOS-16564 - UI error message references Marathon command.
- DCOS-16643 - dcos tunnel doesn't work with DC/OS CLI 0.5.x. [enterprise type="inline" size="small" /]
- DCOS-16658 - Move "Secrets" back to "Resources" menu section. [enterprise type="inline" size="small" /]
- DCOS-17219 - Marathon-LB broken in DC/OS 1.10.
- DCOS-17284 - [1.10] GUI bug: container type must be defined.
- DCOS-17294 - Unable to curl (resolve) applications using Mesos DNS names.
- DCOS-17321 - Fix upgrade of Marathon-lb from 1.9-1.10.
- DCOS-17412 - bouncer: aces must be unique for [user,resource] and [group,resource]. [enterprise type="inline" size="small" /]
- DCOS-17430 - bouncer: policyquery is slow against cockroachdb. [enterprise type="inline" size="small" /]
- DCOS-17473 - bouncer: stay close to official transaction retry logic. [enterprise type="inline" size="small" /]
- DCOS-17502 - Marathon cannot retrieve JSON web key set: 'the trustAnchors parameter must be non-empty'.
- DCOS-17511 - cockroachdb: upgrade to v1.0.4.
- DCOS-17553 - dcos-backup should prevent concurrent backup/restores. [enterprise type="inline" size="small" /]
- DCOS-17560 - bouncer: bump ldap3 to 2.2.4 (2017.05.07). [enterprise type="inline" size="small" /]
- DCOS-17581 - bootstrap: consolidate write_java_truststore_with_dcos_ca_bundle for concurrent execution. [enterprise type="inline" size="small" /]
- DCOS-17593 - bouncer: optimize policyquery endpoint. [enterprise type="inline" size="small" /]
- DCOS-17631 - Bouncer: fix transaction retry rollback condition. [enterprise type="inline" size="small" /]
- DCOS-17844 - 1.10 disabled->permissive upgrade fails due to node health checks when upgrading masters. [enterprise type="inline" size="small" /]
- DCOS-17979 - Remove "Open Service" from UI for SDK-based Services.
- DCOS-17982 - Remove the suspend button for SDK services.
- DCOS_OSS-1014	- Admin Router: Document /service endpoint behaviour and limitations.
- DCOS_OSS-1398	- Instructions for forcing `dcos-docker` to use docker 1.13.1 are incorrect.
- DCOS_OSS-1470 - Exhibitor: use PatternLayoutEscaped logger layout for structured journal logger.
- DCOS_OSS-1486 - Metrics agent crashes when the mesos containers endpoint is missing fields.
- DCOS_OSS-1524	- `dcos-diagnostics --diag` returns false positives during DC/OS install.
- INFINITY-1912	- Update CLI to reflect Cosmos update fixes.
- INFINITY-1988	- Suppress/revive out of sync with Mesos.
- INFINITY-2114 - Flaky Uninstall.
- INFINITY-2115	- Kibana will not uninstall.
- MARATHON-7469 - Marathon killed tasks involved in Deployment after leader election.
- MARATHON-7521	- Histograms, counters, min-max-counters, and timers are duplicated in /metrics.
- MARATHON-7574	- MetricsTimerTest fails 2% of the time.
- MARATHON-7575	- DeleteAppAndBackupIntegrationTest fails 3% of the time.
- MARATHON-7654	- Marathon cannot replace persistent tasks for rebooted hosts until the Mesos Master forgets about the old agent.
- MARATHON-7688	- VIP does not work with pods on overlay.
- MESOS-6950 - Launching two tasks with the same Docker image simultaneously may cause a staging dir never cleaned up.
