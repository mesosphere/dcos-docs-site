---
layout: layout.pug
navigationTitle: Release Notes v. 2.4.0-4.1.1
excerpt: Release Notes for version 2.4.0-4.1.1
title: Release Notes
menuWeight: 10
model: /services/confluent-kafka/data.yml
render: mustache
---

# Version 2.4.0-4.1.1

## Updates

- Update to Confluent Kafka version 4.1.1
- Upgrade JRE to 1.8u192 to address CVEs

## New Features


# Version 2.3.0-4.0.0e

## New Features

- Support for configuring Kafka transport encryption ciphers with secure defaults.

# Version 2.2.0-4.0.0e

## New Features

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/services/confluent-kafka/2.2.0-4.0.0e/security/#securely-exposing-dcos-confluent-kafka-outside-the-cluster).
- Support for deploying the service in a remote region.


# Version 2.1.0-4.0.0e

## New Features

- Ability to pause a service pod for debugging and recovery purposes. ([#1989](https://github.com/mesosphere/dcos-commons/pull/1989))
- Support for the automated provisioning of TLS artifacts to secure Kafka communication.
- Support for Kerberos and SSL authorization and authentication.
- Support for Zone placement constraints in DC/OS 1.11

## Updates

- Major Improvements to the stability and performance of service orchestration
- Upgrade JRE to 1.8u162. ([#2135](https://github.com/mesosphere/dcos-commons/pull/2135))
- Set protocol to 1.0 by default.  ([#2085](https://github.com/mesosphere/dcos-commons/pull/2085))
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.

# Version 2.0.2-3.3.1e

See [Confluent Platform 3.3.1 release notes](https://docs.confluent.io/3.3.1/release-notes.html)

# Version 2.0.2-3.3.0e

## Bug fixes
* Uninstall now handles failed tasks correctly.
* The brokers may fail to start due to the broker VIP taking slightly too long to create relative to how fast the brokers start.
* The brokers may be stuck in the STARTING state due to the readiness check in this version being too time sensitive when the brokers start quickly.
* Fixes to scheduler behavior during task status transitions.
* Dynamic ports are no longer sticky across pod replaces.

# Version 2.0.1.1-3.3.0e

2.0.1.1-3.3.0e release of DC/OS Confluent Kafka.

## Bug Fixes

* The brokers may fail to start due to the broker VIP taking slightly too long to create relative to how fast the brokers start.
* The brokers may be stuck in the STARTING state due to the readiness check in this version being too time sensitive when the brokers start quickly.

# Version 2.0.1-3.3.0e

2.0.1-3.3.0e release of DC/OS Confluent Kafka.

## Bug fixes
- The correct IP address is now always selected in DC/OS 1.10

# Version 2.0.0-3.3.0e

## Improvements
- Based on the latest stable release of the dcos-commons SDK, which provides numerous benefits:
  - Integration with DC/OS features such as virtual networking and integration with DC/OS access controls.
  - Orchestrated software and configuration update, enforcement of version upgrade paths, and ability to pause/resume updates.
  - Placement constraints for pods.
  - Uniform user experience across a variety of services.
- Update to version 3.3.0 of Confluent Kafka.
- Graceful shutdown for brokers.

## Breaking Changes
- This is a major release.  You cannot upgrade to 2.0.0-3.3.0e from a 1.0.x version of the package.  To upgrade, you must perform a fresh install and replicate data across clusters.
