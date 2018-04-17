---
layout: layout.pug
navigationTitle: 
title: Release Notes
menuWeight: 200
excerpt:
featureMaturity:
enterprise: false
---

## Version 1.2.4-3.3.0e-beta

### Improvements
- Upgrade to Confluent 3.3.0
- Many common configuration options now align with other DC/OS packages
- Support for Kafka's graceful shutdown.
- Default broker protocol and log message formats now default to 0.11.0.0.
- Upgrade to [dcos-commons 0.30.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.30.0).

### Bug Fixes
- Numerous fixes and enhancements to service reliability.

## Version 1.2.3-3.2.2e-beta

### New Features
- Installation in folders is supported
- Use of a CNI network is supported

### Improvements
- Upgrade to [dcos-commons 0.20.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.20.1)
- Default user is now `nobody`
- Allow configuration of scheduler log level
- Readiness check has been added
- Custom ZK configuration is supported
- Statsd is enabled
