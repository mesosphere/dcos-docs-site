---
layout: layout.pug
navigationTitle: 
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


# Version 2.1.2-4.0.0e-beta

## NOTICE

This is a beta release of the DC/OS Confluent Kafka service. It contains multiple improvements as well as new features that are to be considered of beta quality. Do _not_ operate this version in production.

### Updates
- Disable VIPs when Kerberos is enabled
- Update the ordering of service settings to be consistent with other data service
- Kerberos settings
  - Ensure all settings are empty by default
  - Add an option to toggle Kerberos debug output
- Set protocol to 1.0.0 by default
- Add support for Confluent Metrics Reporter
- Moved scheduler health-checks from HTTP to [Mesos-level health checks](https://mesosphere.github.io/marathon/docs/health-checks.html#mesos-level-health-checks).
- Bump JRE to 1.8u162.
- Improvements to the pod pause feature.
- Improve handling of unexpected task statuses.

### Bug Fixes
- Update Kafka's ZK library to enable re-resolution as required on virtual networks

# Version 2.1.1-4.0.0e-beta

## NOTICE

This is a beta release of the DC/OS Confluent Kafka framework. It contains multiple improvements as well as new features that are to be considered of beta quality. Do _not_ operate this version in production.

### Bug Fixes
- Scheduler health check now passes during service uninstall.
- Fixed a regression in replacing failed pods on failed agents.
- Replacing a pod on a failed agent now no longer waits for Mesos to register the agent as lost.

# Version 2.0.0-4.0.0e-beta

## NOTICE

This is a beta release of the DC/OS Confluent Kafka framework. It contains multiple improvements as well as new features that are to be considered of beta quality. Do _not_ operate this version in production.

### New features
- Support for the automated provisioning of TLS artifacts to secure Kafka communication.
- Support for Kerberos and SSL authorization and authentication.
- Support for `Zone` placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).

### Updates
- Major improvements to the stability and performance of service orchestration.
- The service now uses Confluent Kafka Platform v4.0.0e. Note that the broker protocol version defaults to 1.0.0, but can be manually set to 1.0.0 if desired.

# Version 2.0.3-3.3.1e

### Updates
* Updates to version 3.3.1 of the Confluent Platform.

### Bug fixes
None

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
- Update to 0.11.0.0 version of Apache Kafka (including log and protocol versions).

## Breaking Changes
- This is a major release.  You cannot upgrade to version 2.0.0-0.11.0 from a 1.0.x version of the package. To upgrade, you must perform a fresh install and replicate data across clusters.
