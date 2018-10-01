---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release notes for DC/OS DataStax Enterprise
title: Release Notes
menuWeight: 120
model: /services/dse/data.yml
render: mustache
---

# Version 3.0.0-6.0.2

## New Features
- Added AlwaysOn SQL service, a highly available (HA) Spark SQL Thrift server
- Improved NodeSync usability with secure environments
- New thread per core (TPC) and asynchronous architecture provides up to 2x more throughput for read and write operations
- Enhanced Spark SQL support allows you to execute Spark queries using a variation of the SQL language
- Storage engine optimizations that provide up to half the latency of open source Cassandra and include optimized compaction
- Improved security for Spark JobServer
- Updated {{ model.techMidName }} {{ model.techOpsName }} to 6.5.2

## Updates
- Some graph and gremlin_server properties in earlier versions of {{ model.techShortName }} are no longer required for {{ model.techShortName }} 6.0. For more information about these properties refer [here](https://docs.datastax.com/en/dse/6.0/dse-admin/datastax_enterprise/releaseNotes/RNdse.html#changesTxt602)
- Updated Cassandra version to 3.11 which removed support for the deprecated Thrift interface (rpc_port, start_rpc, etc).
- Updated TinkerPop version 3.3.3 with additional production-certified changes.
- Updated Apache Solr™ to version 6.0.1.1.2321 which includes Solr security upgrades bundle.
- Updated Apache Spark™ to version 2.2.1.2 for bug fixes such as to improve Spark Master discovery and reliability.


# Version 2.2.0-5.1.2

## New Features
- Support for deploying the service in a remote region.

## Bug Fixes
- Default the RLimits to the recommended defaults.
- Allow the service to run as the root user.

# Version 2.1.2-5.1.2

## New Features

- Ability to pause a service pod for debugging and recovery purposes. ([#1989](https://github.com/mesosphere/dcos-commons/pull/1989))
- Support for starting/stopping Cassandra for PIT backup/restore support via {{ model.techOpsName }}.
- Support for the automated provisioning of TLS artifacts to secure service communication.

## Updates

- Upgraded JRE to 1.8u162. ([#2135](https://github.com/mesosphere/dcos-commons/pull/2135))
- Marks all {{ model.techShortName }} tasks as non-essential: the {{ model.techShortName }} agent and {{ model.techShortName }} node may now fail independently (without the entire pod failing).
- Major Improvements to the stability and performance of service orchestration
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

# Version 2.0.5-5.1.2

## Bug Fixes
* Uninstall now handles failed tasks correctly.

# Version 2.0.4-5.1.2

## Bug Fixes

- Permission denied error when attempting to create a backup in {{ model.techOpsName }}

## Improvements

- Exposed additional {{ model.techOpsName }} agent options to the {{ model.techShortName }} DC/OS service
- Exposed `commitlog_archiving.properties` file and associated options to the {{ model.techShortName }} DC/OS service

## Breaking Changes

- None

## Upgrade Steps

- Follow the upgrade steps in the [DCOS {{ model.techShortName }} service guide](https://docs.mesosphere.com/services/dse/2.0.4-5.1.2/managing/#upgrading-or-downgrading-a-service).


# Version 2.0.3-5.1.2

## Bug Fixes

- Tomcat not deploying Solr admin web app.
- `OPSC_DEFINITIONS_AUTO_UPDATE` environment variable not taking affect.

## Improvements

- Upgraded to the latest stable release of the dcos-commons SDK.
- Better support for configuring/using {{ model.techShortName }} Unified Authentication. See the [authentication documentation](https://docs.mesosphere.com/services/dse/2.0.3-5.1.2/dse-authentication).

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
- Based on the latest stable release of the `dcos-commons` SDK, which provides numerous benefits:
  -Integration with DC/OS features such as virtual networking and integration with DC/OS access controls
  - Orchestrated software and configuration updates, enforcement of version upgrade paths, and ability to pause/resume updates
  - Placement constraints for pods
  - Uniform user experience across a variety of services
- Upgrade to version 5.1.2 of {{ model.techName }}
- Upgrade to version 6.1.2 of {{ model.techName }} {{ model.techOpsName }}

## Breaking Changes
- This is a major release available for DC/OS 1.9 or higher. You cannot upgrade to version 2.0.0-5.1.2 from any previous versions of the package. This is due to the separation of the core {{ model.techShortName }} nodes from {{ model.techOpsName }}.
