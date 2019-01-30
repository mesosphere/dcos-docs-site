---
layout: layout.pug
navigationTitle:
excerpt: Release notes for 2.3.0-1.1.0
title: Release Notes
menuWeight: 120
model: /services/kafka/data.yml
render: mustache
---


## Version 2.3.0-1.1.0

### Updates
- Upgrade {{ model.techShortName }} base tech to version 1.1.0. See [{{ model.techShortName }}'s Release Notes](https://kafka.apache.org/11/documentation.html#upgrade_110_notable) for details.

## Version 2.3.0-1.0.0

### New Features
- Support for configuring {{ model.techShortName }} transport encryption ciphers with secure defaults.

## Version 2.2.0-1.0.0

### New Features
- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/services/kafka/2.3.0-1.0.0/security/#securely-exposing-dcos-apache-kafka-outside-the-cluster).
- Support for launching the service in a remote region.

## Version 2.1.0-1.0.0

### New Features
- Support for the automated provisioning of TLS artifacts to secure {{ model.techShortName }} communication.
- Support for Kerberos and SSL authorization and authentication.
- Support for `Zone` placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Ability to pause a service pod for debugging and recovery purposes.

### Updates
- Major improvements to the stability and performance of service orchestration.
- Protocol and log version defaults are also set to `1.0`.
- Improve {{ model.techShortName }}'s ZK library to enable re-resolution as required on virtual networks
- Upgrade the JRE to 1.8u162
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

## Version 2.0.4-1.0.0

### Updates
- Upgraded to {{ model.techShortName }} v1.0.0. **Note:** Protocol and log version defaults are set to 0.11.0. After upgrading to this version, they may be set to 1.0.0.

# Version 2.0.3-0.11.0

### Bug Fixes
* Uninstall now handles failed tasks correctly.
* Fixed a timing issue in the broker readiness check that caused brokers to be stuck in STARTING when the service is allocated more than 2 CPUs per broker.

# Version 2.0.2-0.11.0

### Bug Fixes

- Dynamic ports are no longer sticky across pod replaces
- Further fixes to scheduler behavior during task status transitions.

#### Improvements

- Updated JRE version to 8u144.
- Improved handling of error codes in service CLI.

# Version 2.0.1-0.11.0

### Bug Fixes
* Tasks will correctly bind on DC/OS 1.10.

### Documentation
* Updated post-install links for package.
* Updated `limitations.md`.
* Ensured previous `version-policy.md` content is present.

# Version 2.0.0-0.11.0

## Improvements
- Based on the latest stable release of the dcos-commons SDK, which provides numerous benefits:
  - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
  - Orchestrated software and configuration update, enforcement of version upgrade paths, and ability to pause/resume updates.
  - Placement constraints for pods.
  - Uniform user experience across a variety of services.
- Graceful shutdown for brokers.
- Update to 0.11.0.0 version of Apache {{ model.techShortName }} (including log and protocol versions).

## Breaking Changes
- This is a major release.  You cannot upgrade to version 2.0.0-0.11.0 from a 1.0.x version of the package. To upgrade, you must perform a fresh install and replicate data across clusters.
