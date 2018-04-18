---
layout: layout.pug
navigationTitle:
excerpt:
title: Release Notes
menuWeight: 120
model: /services/hdfs/data.yml
render: mustache
---

## Version 2.2.0-2.6.0-cdh5.11.0

### New Features
- Support for deploying the service in a remote region.

## Bug Fixes
- Expose heap settings for all nodes.

## Version 2.1.0-2.6.0-cdh5.11.0

### New Features
- Support for HDFS rack awareness using DC/OS zones on DC/OS 1.11+
- Support for the automated provisioning of TLS artifacts to secure HDFS communication.
- Support for Kerberos authorization and authentication.
- Ability to pause a service pod for debugging and recovery purposes.

### Updates
- Major Improvements to the stability and performance of service orchestration
- Upgrade JRE to 1.8u162. (#2135)
- The service now uses the Mesos V1 API. The service can be set back to the V0 API using the service property `service.mesos_api_version`.


## Version 2.0.4-2.6.0-cdh5.11.0

### Bug Fixes
- Placement constraints are now exposed.

## Version 2.0.3-2.6.0-cdh5.11.0

### Bug Fixes
* Dashes in envvars replaced with underscores to support Ubuntu.
* Some numeric configuration parameters could be interpreted incorrectly as floats, and are fixed.
* Uninstall now handles failed tasks correctly.

## Version 2.0.0-2.6.0-cdh5.11.0

### Improvements
- Enhanced inter-node checks for journal and name nodes.
- Upgrade to [dcos-commons 0.30.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.30.0).

### Bug Fixes
- Numerous fixes and enhancements to service reliability.

## Version 1.3.3-2.6.0-cdh5.11.0-beta

### New Features
- Installation in folders is supported
- Use of a CNI network is supported

### Improvements
- Upgraded to [dcos-commons 0.20.1](https://github.com/mesosphere/dcos-commons/releases/tag/0.20.1)
- Upgraded to `cdh 5.11.0`
- Default user is now `nobody`
- Allow configuration of scheduler log level
- Added a readiness check to journal nodes

### Documentation
- Pre-install notes include five agent pre-requisite
- Updated CLI documentation
