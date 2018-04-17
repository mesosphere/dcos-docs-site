---
layout: layout.pug
navigationTitle: 
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->

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
