---
layout: layout.pug
navigationTitle: Release Notes 
excerpt: Release Notes for version 2.9.0-5.4.0
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/confluent-kafka/data.yml
render: mustache
---

## Version 2.9.0-5.4.0

### Updates
- Upgrade the base tech version of Apache Kafka to `2.4.0`. See Kafka's Release Notes for [2.4.0](https://www.apache.org/dist/kafka/2.4.0/RELEASE_NOTES.html) for details.
- Updated the SDK to version [0.57.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3)
  - [#3215](https://github.com/mesosphere/dcos-commons/pull/3215) is a major bug-fix since `v0.57.0`. Frameworks are recommended to upgrade to `v0.57.3` and issue `pod replace` commands to exisiting deployments to mitigate the risks. Existing procedures for [migrating a existing service to the quotated role](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0#migrate-an-existing-deployed-service-to-use-quota-support) should be followed.
- Updated the scheduler JRE to `v11`.

### Important Notes
- Apache Kafka 2.4.0 introduces `[KAFKA-7335] - Store clusterId locally to ensure broker joins the right cluster`, which means that kafka cluster will store the clusterId locally so that it does not join the wrong zookeeper cluster accidentally. Therefore, if your kafka service is connected to default DC/OS zookeeper, changing the zookeeper path is not permitted. Please check [here](https://issues.apache.org/jira/browse/KAFKA-7335) for more information.


## Version 2.8.0-5.3.1

### Updates
- Update the base tech version of Confluent Kafka to `5.3.1`.
- Update the SDK to version `0.57.0`. For more information, see release notes for previous SDK releases:
  - [0.57.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)
  - [0.56.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.3)

### New Features
- By upgrading the SDK, Confluent-Kafka now comes with support for:
  - Quota enforcement
  - Node draining


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
