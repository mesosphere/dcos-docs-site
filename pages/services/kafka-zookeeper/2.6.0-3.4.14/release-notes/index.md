---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Discover the new features, updates, and known limitations in this release of the Kafka ZooKeeper Service
title: Release Notes
menuWeight: 0
model: /services/kafka-zookeeper/data.yml
render: mustache
---

# Version 2.6.0-3.4.14

### Updates
- Upgrade the base dcos-commons SDK version to `0.56.1`.
- Upgrade Zookeeper base tech to version `3.4.14`. See [Zookeeper's Release Notes](https://zookeeper.apache.org/doc/r3.4.14/releasenotes.html) for details.
- Oracle JDK is replaced by OpenJDK 8.

### New Features
- Autosuggestion is available for Service Account and Secrets when launching the service from DC/OS UI
- Added marathon service scheduler checks

# Version 2.5.0-3.4.13

### Updates
- Upgrade the base dcos-commons SDK version to 0.55.2.

### New Features
- Number of open file descriptors is now configurable via the `RLIMIT_NOFILE_SOFT` and `RLIMIT_NOFILE_HARD` configuration parameters.
- Timeouts for readiness checks are now configurable via the `READINESS_CHECK_INTERVAL`, `READINESS_CHECK_DELAY` and `READINESS_CHECK_TIMEOUT` configuration parameters.


# Version 2.4.0-3.4.13

## Updates
- The service now uses Apache ZooKeeper 3.4.13
## Bug Fixes
- [DCOS-40634] Fix a bug where if one node goes down and the other nodes are restarted will cause a crashloop.

<!-- # Version 2.3.0-3.4.12

## Features
- Support for launching the service in a remote region.
- All frameworks ({{ model.techName }} included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Updates
- The service now uses Apache ZooKeeper 3.4.12

**Note:** Due to a bug in Apache ZooKeeper 3.4.11 used in previous DC/OS Kafka ZooKeeper packages, there is no automated method for downgrading from version `2.3.0-3.4.12` to `2.3.0-3.4.12`.

## Bug Fixes
- The `zookeeper.autopurge_purge_interval` in the configuration options is now used when configuring the system. Previously, the  `zookeeper.autopurge_snap_retain_count` value with a default of 3 was used (#98)
- Metrics have been fixed on DC/OS 1.9 clusters (#99)

# Version 2.2.0-3.4.11

## Features

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/mesosphere/dcos/services/kafka-zookeeper/2.2.0-3.4.11/security/#securely-exposing-dcos-kafka-zookeeper-outside-the-cluster).
- Support for launching the service in a remote region.


# Version 2.1.0-3.4.11

This is the initial GA release of the DC/OS Apache ZooKeeper service.

## Features

- Support for Kerberos authorization and authentication.
- Support for Zone placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Support for 3 or 5 ZooKeeper nodes.
- Support for pausing ZooKeeper nodes for debugging and recovery purposes.
 -->
