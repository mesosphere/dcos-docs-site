---
layout: layout.pug
navigationTitle: 
excerpt:
title: Release Notes
menuWeight: 120

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-commons -->


## Version 2.1.2-3.4.11


### Improvements
- Ensure that a task passes self-resolution on startup
- Kerberos settings
  - Ensure all settings are empty by default
  - Add an option to toggle Kerberos debug output
- Moved scheduler health-checks from HTTP to [Mesos-level health checks](https://mesosphere.github.io/marathon/docs/health-checks.html#mesos-level-health-checks).
- Bump JRE to 1.8u162.
- Improvements to the pod pause feature.
- Improve handling of unexpected task statuses.

## Version 2.1.1-3.4.11-beta

## NOTICE

This is a beta release of the DC/OS Apache Zookeeper framework. It contains multiple improvements as well as new features that are to be considered of beta quality. Do not operate this version in production.

## Version 0.1.0-3.4.11-beta

## NOTICE

This is a beta release of the DC/OS Kafka ZooKeeper framework. It contains multiple improvements as well as new features that are to be considered of beta quality. Do _not_ operate this version in production.

### Launch features
- Support for Kerberos authorization and authentication.
- Support for `Zone` placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Support for 3 or 5 ZooKeeper nodes.
- The service runs ZooKeeper v3.4.11.
