---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Discover the new features, updates, and known limitations in this release of the HDFS Service
title: Release Notes
menuWeight: 0
model: /mesosphere/dcos/services/hdfs/data.yml
render: mustache
---

# Release Notes for HDFS version 2.8.0-3.2.1

## Updates
- Updated SDK to version `0.57.3`. For more information see release-notes for previous SDK releases:
  - [0.57.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.3)
  - [0.57.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)
  - [0.56.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.3)


# Release Notes for HDFS version 2.7.0-3.2.1

## Updates
- Updated base-tech to version `3.2.1`
- Updated SDK to version `0.57.0`. For more information see release-notes for previous SDK releases:
  - [0.57.0](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0)
  - [0.56.3](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.3)
  - [0.56.2](https://github.com/mesosphere/dcos-commons/releases/tag/0.56.2)

## Features
- Added CLI support for native `hdfs` base-tech commands such as `dfs`. Users can now execute commands via: 
  ```
  dcos hdfs hdfs {cmd} {args}
  ```
  - For example:
  ```
  dcos hdfs hdfs dfs -mkdir /tmp
  dcos hdfs hdfs dfs -ls /
  ```
  - For the full list of executable commands, refer to [HDFS docs](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HDFSCommands.html)
- By upgrading the SDK, HDFS now comes with support for:
  - Quota enforcement
  - Node draining

# Upgrading the DC/OS HDFS Package
- This DC/OS package can be upgraded from the following versions:
  - `2.6.0-3.2.0`
  - `2.5.0-2.6.0-cdh5.11.0`
- To upgrade HDFS, run the following command:
  ```
  dcos hdfs update start --package-version=2.7.0-3.2.1
  ```


# Release Notes for HDFS version 2.6.0-3.2.0

## Updates
- Updated HDFS version to `3.2.0`. Note: our package no longer includes Cloudera's `cdh` variant
- Updated Snappy library to version `1.1.4`.
- Updated the SDK to version `0.56.1`
- Oracle JDK is replaced with OpenJDK 8

## Features
- Added support for custom domains. See [custom domains](/mesosphere/dcos/services/{{ model.serviceName }}/latest/operations/security/#forwarding-dns-and-custom-domain)
- Added support for DC/OS Storage Service (DSS). See [DSS documentation](https://docs.d2iq.com/mesosphere/dcos/services/storage/1.0.0/)
- Added marathon service scheduler checks

## Bug Fixes
- Fixed a bug in Apache Derby related to the miscalculation of bytes read for a principal entry in the Kerberos keytab file. See [HADOOP-16283](https://issues.apache.org/jira/browse/HADOOP-16283)).

<!-- # Release Notes for HDFS Service version 2.5.0-2.6.0-cdh5.11.0

## Feature
- Hadoop `ipc.maximum.data.length` is now a configurable property
- Readiness-check interval, timeout and delay are now configurable properties
- Number of open file descriptors (`RLIMIT_NOFILE`) is now a configurable property

## Bug Fixes
- Fix for JournalNodes failing to establish quorum when `paxos` folder is missing

## Improvements
- Added validation to verify package names are unique and follow Universe guidelines

## Updates
- Upgraded libmesos-bundle to version 1.12

# Release Notes for HDFS Service version 2.4.0-2.6.0-cdh5.11.0

## Bug Fixes
- Fix a bug where an out of date configuration ID would be selected when restarting or replacing pods. This could lead to configuration updates being reverted to the values with which the service was initially deployed. ([#2694](https://github.com/mesosphere/dcos-commons/pull/2694))

## Improvements
- The `hdfs.auth_to_local` setting no longer need to be specified for the {{ model.techShortName }}-specific principals when installing kerberized {{ model.techShortName }}.

## Updates
- Upgrade JRE to 1.8u192 to address CVEs

# Release Notes for HDFS Service version 2.3.0-2.6.0-cdh5.11.0

## New Features

- All frameworks ({{ model.techShortName }} included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Bug Fixes

- Fix duplicate mounts being generated for TLS secrets, causing pod maintenance operations to fail (#2577)

## Improvements

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
 -->
