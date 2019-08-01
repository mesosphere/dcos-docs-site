---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release Notes for DSE v. 3.0.0-6.7.2
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/dse/data.yml
render: mustache
---

# Version 3.0.0-6.7.2

## Updates
- Upgraded DSE to version `6.7.2` and OpsCenter to version `6.7.1`
- Upgraded SDK to `0.55.4` 

## New Features
- Added pod plan commands: `nodetool-ser` and `nodetool-par` for executing `nodetool` commands either serially or in parallel across all nodes in the cluster.
	- Now users can issue nodetool commands against all nodes in their cluster via command:
	```
	dcos datastax-dse plan start nodetool-ser \
	  -p NODETOOL_CONNECTION_OPTS='<connection_options>'  \
	  -p NODETOOL_SUBCOMMAND='<subcommand>'  \
	  -p NODETOOL_CMD_ARGS='<subcommand_arguments>'
	```
	- For example:
	```
	dcos datastax-dse plan start nodetool-ser \
	  -p NODETOOL_CONNECTION_OPTS='-p 7199'  \
	  -p NODETOOL_SUBCOMMAND='upgradesstables'  \
	  -p NODETOOL_CMD_ARGS='-a'
	```
- Upgrading the SDK from the 0.4x series to 0.5x comes with significant framework and scheduler improvements such as:
	- Adding [multi-service support](https://github.com/mesosphere/dcos-commons/releases/tag/0.50.0) and region-/zone-awareness
	- [Scheduler metrics](https://github.com/mesosphere/dcos-commons/releases/tag/0.52.0)
	- Improving logging, debuggability, and bug fixes
	- Please read SDK-related release notes to learn more: https://github.com/mesosphere/dcos-commons/releases

## Upgrading your cluster from DSE 5.1 to 6.7
Due to the complexity of upgrading to DSE 6.7, it is highly advised that you attempt the upgrade on a test cluster before upgrading in your production environment.

In order to upgrade your cluster from DSE 5.1 to DSE 6.7 you must:
- Review official DSE upgrade docs: https://docs.datastax.com/en/upgrade/doc/upgrade/datastax_enterprise/upgdDSE51to67.html
  - follow instructions in the [Upgrade restrictions and limitations](https://docs.datastax.com/en/upgrade/doc/upgrade/datastax_enterprise/upgdDSE51to67.html#Upgraderestrictionsandlimitations)
  - if using CFS, copy your data from it
  - Using `cqlsh`, drop CFS keyspaces: `cfs` and `cfs_archive`
- Run the following command to upgrade your DSE package: 
  ```
  dcos datastax-dse update start --package-version=3.0.0-6.7.2
  ```
	- This will run a script to drop `COMPACT_STORAGE` from all keyspaces and then upgrade each DSE node to version `6.7.2`
	<p class="message--important"><strong>IMPORTANT: </strong>Before upgrading, make sure the agent running <code>dse-0-node</code> has more than 0.25 CPU available. This is required to run the <code>compact-storage</code> task. You may have to move other services running on that agent to accommodate.</p>

- After DSE upgrade, you can upgrade OpsCenter with the following command: 
  ```
  dcos datastax-ops update start --package-version=3.0.0-6.7.1
  ```
- After OpsCenter upgrade succeeds, run the following command to convert sstables to the proper version:
	```
	dcos datastax-dse plan start nodetool-ser \
	  [-p NODETOOL_CONNECTION_OPTS='-p 7199']  \  ## optional
	  -p NODETOOL_SUBCOMMAND='upgradesstables'  \
	  -p NODETOOL_CMD_ARGS='-a'
	```
	<p class="message--important"><strong>IMPORTANT: </strong>This action cannot be undone and you should plan for increased load activity on your cluster. This task should be scheduled for off-peak hours. Should any problems arise, `pause` the plan and investigate.


# Version 2.4.0-5.1.10

## Improvements
- Update to {{ model.shortTechName }} 5.1.10 and OpsCenter 6.1.9

# Version 2.3.0-5.1.2

## New Features

- DataStax {{ model.shortTechName }} and DataStax OpsCenter now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Improvements

- The SDK tests now validate missing values for `svc.yml` Mustache variables. ([#2527](https://github.com/mesosphere/dcos-commons/pull/2527))

# Version 2.2.0-5.1.2

## New Features
- Support for deploying the service in a remote region.

## Bug Fixes
- Default the RLimits to the recommended defaults.
- Allow the service to run as the root user.

# Version 2.1.2-5.1.2

## New Features

- Ability to pause a service pod for debugging and recovery purposes. ([#1989](https://github.com/mesosphere/dcos-commons/pull/1989))
- Support for starting/stopping Cassandra for PIT backup/restore support via OpsCenter.
- Support for the automated provisioning of TLS artifacts to secure service communication.

## Updates

- Upgraded JRE to 1.8u162. ([#2135](https://github.com/mesosphere/dcos-commons/pull/2135))
- Marks all {{ model.shortTechName }} tasks as non-essential: the {{ model.shortTechName }} agent and {{ model.shortTechName }} node may now fail independently (without the entire pod failing).
- Major Improvements to the stability and performance of service orchestration
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

# Version 2.0.5-5.1.2

## Bug Fixes
* Uninstall now handles failed tasks correctly.

# Version 2.0.4-5.1.2

## Bug Fixes

- Permission denied error when attempting to create a backup in OpsCenter

## Improvements

- Exposed additional OpsCenter agent options to the {{ model.shortTechName }} DC/OS service
- Exposed commitlog_archiving.properties file and associated options to the {{ model.shortTechName }} DC/OS service

## Breaking Changes

- None

## Upgrade Steps

- Follow the upgrade steps in the [DCOS {{ model.shortTechName }} service guide](https://docs.mesosphere.com/services/dse/2.0.4-5.1.2/managing/#upgrading-or-downgrading-a-service).


# Version 2.0.3-5.1.2

## Bug Fixes

- Tomcat not deploying Solr admin web app.
- `OPSC_DEFINITIONS_AUTO_UPDATE` environment variable not taking affect.

## Improvements

- Upgraded to the latest stable release of the dcos-commons SDK.
- Better support for configuring/using {{ model.shortTechName }} Unified Authentication. See the [authentication documentation](https://docs.mesosphere.com/services/dse/2.0.3-5.1.2/dse-authentication).

## Breaking Changes

- New authentication configuration options have been added, and one existing option (`ldap.default_scheme`) has been moved.  Follow the steps in the Upgrade section, below, to prepare your configuration options and perform the upgrade.

## Upgrade Steps

- Upgrade to the latest version of the CLI: `dcos package install --cli datastax-dse --package-version=2.0.3-5.1.2`.

### On DC/OS 1.10 Enterprise:
  1. Save your current configuration: `dcos datastax-dse describe > $HOME/options.json`.
  1. Update your configuration. Add the following options to your `$HOME/options.json` file just before the "ldap" section.

    ```
    "authentication_options_enabled": false,
    "authentication_options_default_scheme": "internal",
    "authentication_options_scheme_permissions": true,
    "authentication_options_allow_digest_with_kerberos": true,
    "authentication_options_plain_text_without_ssl": "warn",
    "authentication_options_transitional_mode": "disabled",
    "role_management_options_mode": "internal",
    "authorization_options_enabled": false,
    "authorization_options_transitional_mode": "disabled",
    "authorization_options_allow_row_level_security": false,
    ```

  1. The location of `ldap.default_scheme` has been changed. Record the current value and then delete that option from the ldap section. The new option is named `authentication_options_default_scheme`. Set this value to the value you just recorded.
  1. Set your authentication and authorization options according to your needs. See the [authentication documentation](https://docs.mesosphere.com/services/dse/2.0.3-5.1.2/dse-authentication).
  1. Save your changes to that file and run the following command: `dcos datastax-dse update start --replace --options=$HOME/options.json --package-version=2.0.3-5.1.2`.
  1. After the service performs a rolling restart of each node, the upgrade is complete.

 ### On DC/OS 1.9 and DC/OS Open Source

  1. Create an `options.json` file with your existing installation options. If you saved a copy during initial install, you can use that. If you don't have it, follow the steps in the "Recreating options.json" section of the [management docs](https://docs.mesosphere.com/services/dse/2.0.3-5.1.2/managing/#enterprise-dcos-1.10). When you have obtained your `options.json` file, place a copy of it in `$HOME/options.json`.
  1. Update your configuration. Add the following options to your `$HOME/options.json` file just before the "ldap" section.

     ```
     "authentication_options_enabled": false,
     "authentication_options_default_scheme": "internal",
     "authentication_options_scheme_permissions": true,
     "authentication_options_allow_digest_with_kerberos": true,
     "authentication_options_plain_text_without_ssl": "warn",
     "authentication_options_transitional_mode": "disabled",
     "role_management_options_mode": "internal",
     "authorization_options_enabled": false,
     "authorization_options_transitional_mode": "disabled",
     "authorization_options_allow_row_level_security": false,
     ```

  1. The location of ldap.default_scheme has been changed. Record the current value and then delete that option from the ldap section. The new option is named authentication_options_default_scheme. Set this value to the value you just recorded.
  1. The location of `ldap.default_scheme` has been changed. Record the current value and then delete that option from the ldap section. The new option is named `authentication_options_default_scheme`. Set this value to the value you just recorded.
  1. Set your authentication and authorization options according to your needs. See the [authentication documentation](https://docs.mesosphere.com/services/dse/2.0.3-5.1.2/dse-authentication).
  1. Save your changes to that file
  1. Get the marathon app id for dse: `marathon app list`.
  1. Remove the app: `marathon app remove <dse-app-id-here>`.
  1. Wait 30 seconds and then confirm the dse app is no longer present: `marathon app list`.
  1. Install the latest version: `dcos package install --options=$HOME/options.json --package-version=2.0.3-5.1.2`.
  1. After the service performs a rolling restart of each node, the upgrade is complete.

# Version 2.0.2-5.1.2

## Bug Fixes
* Tasks will correctly bind on DC/OS 1.10.

# Version 2.0.0-5.1.2

## Improvements
- Based on the latest stable release of the dcos-commons SDK, which provides numerous benefits:
  -Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
  - Orchestrated software and configuration updates, enforcement of version upgrade paths, and ability to pause/resume updates.
  - Placement constraints for pods.
  - Uniform user experience across a variety of services.
- Upgrade to version 5.1.2 of DataStax Enterprise.
- Upgrade to version 6.1.2 of DataStax Enterprise Opscenter.

## Breaking Changes
- This is a major release available for DC/OS 1.9 or higher. You cannot upgrade to version 2.0.0-5.1.2 from any previous versions of the  package. This is due to the separation of the core {{ model.shortTechName }} nodes from Opscenter.
