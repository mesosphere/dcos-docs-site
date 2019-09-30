---
layout: layout.pug
navigationTitle: Release Notes 
excerpt: Release Notes for version 2.8.0-5.3.1
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/confluent-kafka/data.yml
render: mustache
---


# Version 2.7.0-5.3.0

## Updates

- Upgrade the base dcos-commons SDK version to `0.56.2`.
- Upgrade the base tech version of Confluent Kafka to `5.3.0`. 
- Oracle JDK is replaced by OpenJDK 8
- Option to configure new listener config `max.connections` which limits the number of active connections on each listener.

## New Features

- Added support for DC/OS Storage Service (DSS). See official [DSS docs](https://docs.d2iq.com/mesosphere/dcos/services/storage/1.0.0) for more details.
- User can enable advanced service health checks. Option to choose between a simple port-based check and an advanced producer-consumer check based on a custom heartbeat topic.
- Support for Secure JMX
- Added marathon service scheduler checks
- Service will fetch all required resources over HTTPS
- Autosuggestion available for Service Account and Secrets when launching the service from DC/OS UI

<!--
# Version 2.6.0-5.1.2

## Updates

- Update to {{ model.techName }} version `5.1.2`.
- SDK bumped to `0.55.2`.

## New Features

- The inter_broker_protocol_version now defaults to the 2.1. Check how to upgrade without downtime [upgrade](/mesosphere/dcos/services/confluent-kafka/2.6.0-5.1.2/updates/#upgrading-from-412-to-512)

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

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/mesosphere/dcos/services/confluent-kafka/2.2.0-4.0.0e/security/#securely-exposing-dcos-confluent-kafka-outside-the-cluster).
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
-->
