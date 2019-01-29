---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release notes for v. 2.5.0-2.6.0-cdh5.11.0
title: Release Notes
menuWeight: 10
model: /services/hdfs/data.yml
render: mustache
---
## Version 2.5.0-2.6.0-cdh5.11.0
### Feature
- Hadoop `ipc.maximum.data.length` is now a configurable property
- Readiness-check interval, timeout and delay are now configurable properties
- Number of open file descriptors (`RLIMIT_NOFILE`) is now a configurable property

### Bug Fixes
- Fix for JournalNodes failing to establish quorum when `paxos` folder is missing

### Improvements
- Added validation to verify package names are unique and follow Universe guidelines

### Updates
- Upgraded libmesos-bundle to version 1.12

## Version 2.4.0-2.6.0-cdh5.11.0

### Bug Fixes
- Fix a bug where an out of date configuration ID would be selected when restarting or replacing pods. This could lead to configuration updates being reverted to the values with which the service was initially deployed. ([#2694](https://github.com/mesosphere/dcos-commons/pull/2694))

### Improvements
- The `hdfs.auth_to_local` setting no longer need to be specified for the {{ model.techShortName }}-specific principals when installing kerberized {{ model.techShortName }}.

### Updates
- Upgrade JRE to 1.8u192 to address CVEs

## Version 2.3.0-2.6.0-cdh5.11.0

### New Features

- All frameworks ({{ model.techShortName }} included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

### Bug Fixes

- Fix duplicate mounts being generated for TLS secrets, causing pod maintenance operations to fail (#2577)

### Improvements

- The SDK tests now validate missing values for `svc.yml` Mustache variables. ([#2527](https://github.com/mesosphere/dcos-commons/pull/2527))

## Version 2.2.0-2.6.0-cdh5.11.0

### New Features
- Support for deploying the service in a remote region.

### Bug Fixes
- Expose heap settings for all nodes.

## Version 2.1.0-2.6.0-cdh5.11.0

### New Features
- Support for {{ model.techShortName }} rack awareness using DC/OS zones on DC/OS 1.11+
- Support for the automated provisioning of TLS artifacts to secure {{ model.techShortName }} communication.
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
