---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 120
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


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
