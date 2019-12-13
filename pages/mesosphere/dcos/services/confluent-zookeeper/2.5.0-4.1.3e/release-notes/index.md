---
layout: layout.pug
navigationTitle: Release Notes
excerpt: Release Notes for Confluent ZooKeeper Service version 2.5.0-4.1.3e 
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/confluent-zookeeper/data.yml
render: mustache
---

# Release Notes for {{ model.techName }} Service version 2.5.0-4.1.3e 

- Update to {{ model.techName }} version 4.1.3 
- Update dcos-commons sdk version to 0.55.4 

## Features

- Number of open file descriptors is now configurable via the `RLIMIT_NOFILE_SOFT` and `RLIMIT_NOFILE_HARD` configuration parameters.

<!--
# Release Notes for Confluent ZooKeeper Service version 2.4.0-4.0.0e

## Bug Fixes
- [DCOS-40634] Fix a bug where restarting more than one server in an ensemble at a time would cause the servers to not be able to start due to waiting for other servers that are also down.
-->
<!-- 
# Version 2.3.0-4.0.0e

## Features
- All frameworks (Confluent ZooKeeper included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Bug Fixes
- The `zookeeper.autopurge_purge_interval` in the configuration options is now used when configuring the system. Previously, the  `zookeeper.autopurge_snap_retain_count` value with a default of 3 was used (#98)
- Metrics have been fixed on DC/OS 1.9 clusters (#99)

# Version 2.2.0-4.0.0e

## Features

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/mesosphere/dcos/services/confluent-zookeeper/2.2.0-4.0.0e/security/#securely-exposing-dcos-confluent-zookeeper-outside-the-cluster).
- Support for deploying the service in a remote region.


# Version 2.1.0-4.0.0e

This is the initial GA release of the DC/OS Confluent ZooKeeper service.

## Features

- Support for Kerberos authorization and authentication.
- Support for Zone placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Support for 3 or 5 ZooKeeper nodes.
- Support for pausing ZooKeeper nodes for debugging and recovery purposes.
 -->
