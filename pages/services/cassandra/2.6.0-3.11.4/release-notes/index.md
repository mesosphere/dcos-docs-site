---
layout: layout.pug
navigationTitle: Release Notes  
excerpt: Discover the new features, updates, and known limitations in this release of the Cassandra Service
title: Release Notes 
menuWeight: 10
model: /services/cassandra/data.yml
render: mustache
---
# Release Notes for Cassandra Service version 2.6.0-3.11.4

## Upgrades

- Upgraded {{ model.techShortName }} to version `3.11.4`
- Upgraded SDK library to version `0.56.1`

## New Features

- Added support for both [custom](/services/{{ model.serviceName }}/2.6.0-3.11.4/configuration/#custom-authentication-and-authorization) and {{model.techName}}'s [native](/services/{{ model.serviceName }}/2.6.0-3.11.4/configuration/#native-authentication-and-authorization) authentication and authorization mechanisms 
- Added support for DSS volume profiles 
- User defined functions are now configurable
- Added [custom](/services/{{ model.serviceName }}/2.6.0-3.11.4/security/#forwarding-dns-and-custom-domain) domain support

## Improvements

- Many of Cassandra's parameters are now configurable from the DC/OS UI

## Upgrading your cluster from 2.5.0-3.11.3 to 2.6.0-3.11.4

- Run the following command to upgrade your Cassandra package: 
  ```
  dcos cassandra update start --package-version=2.6.0-3.11.4 --replace
  ```
<!-- 
# Release Notes for Cassandra Service version 2.5.0-3.11.3

## Upgrades

- Upgrade {{ model.techShortName }} to version `3.11.3`
- Upgraded SDK library to version `0.55.2`

## New Features

- Readiness-check `interval`, `timeout`, and `delay` are now configurable properties 
- The number of open file descriptors (`RLIMIT_NOFILE`) is now a configurable property 

## Improvements

- Service names are now validated with a regex
 -->
<!-- 
# Version 2.4.0-3.0.16

## Bug Fixes

- Fix a bug where an out of date configuration ID would be selected when restarting or replacing pods. This could lead to configuration updates being reverted to the values with which the service was initially deployed. ([#2694](https://github.com/mesosphere/dcos-commons/pull/2694))

## Updates

- Upgrade JRE to 1.8u192 to address CVEs
 -->
<!-- # Version 2.3.0-3.0.16

## New Features

- It is now possible to configure {{ model.TechShortName }}'s `disk_failure_policy` through the `cassandra.disk_failure_policy` service configuration. In previous versions this is hard-coded to `stop`. ([#2515](https://github.com/mesosphere/dcos-commons/pull/2515))
- All frameworks ({{ model.TechShortName }} included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Bug Fixes

- Upgrading {{ model.TechShortName }} with non-default `service.rack` values has been fixed. ([#2553](https://github.com/mesosphere/dcos-commons/pull/2553))

## Improvements

- The SDK tests now validate missing values for `svc.yml` Mustache variables. ([#2527](https://github.com/mesosphere/dcos-commons/pull/2527))

# Version 2.2.0-3.0.16

## New Features
- Support for deploying the service in a remote region.

# Version 2.1.0-3.0.16

## New Features

- The {{ model.TechShortName }} tasks no longer run inside a Docker container. This removes the requirement that the service must be run as root on CentOS based distributions.
- Support for the automated provisioning of TLS artifacts to secure {{ model.TechShortName }} communication.
- Automatic configuration of the system tables on initial deployment.
- Support for `Zone` placement constraints in DC/OS 1.11.
- Ability to pause a service pod for debugging and recovery purposes.

## Updates
- Major improvements to the stability and performance of service orchestration.
- The service now uses {{ model.TechShortName }} v3.0.16.
- Upgrade JRE to 1.8u162.
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

# Version 2.0.3-3.0.14

## Bug Fixes

- Uninstall now handles failed tasks correctly.

# Version 2.0.2-3.0.14

## Bug Fixes

- Further fixes to scheduler behavior during task status transitions.

## Improvements

- Updated JRE version to 8u144.
- Improved handling of error codes in service CLI.

# Version 2.0.1-3.0.14

## Bug Fixes

- Corrected closing brace in {{ model.TechShortName }} mustache.
- Fixed restore-snapshot port rendering.
- Tasks will correctly bind on DC/OS 1.10.
- Fixed config generation.

## Documentation

- Updated post-install links for package.
- Updated `limitations.md`.
- Ensured previous `version-policy.md` content is present.
- Updated service user section

# Version 2.0.0-3.0.14

## Improvements
- Based on the latest stable release of the dcos-commons SDK, which provides numerous benefits:
  - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
  - Orchestrated software and configuration update, enforcement of version upgrade paths, and ability to pause/resume updates.
  - Placement constraints for pods.
  - Uniform user experience across a variety of services.
- Upgrade to version 3.0.14 of {{ model.TechName }}.

## Breaking Changes
- This is a major release.  You cannot upgrade to 2.0.0-3.0.14 from a 1.0.x version of the package.  To upgrade, you must perform a fresh install and restore from a backup.
 -->
