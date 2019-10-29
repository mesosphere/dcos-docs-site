---
layout: layout.pug
navigationTitle:
excerpt: Release notes for version 2.7.0-5.1.2e
title: Release Notes
menuWeight: 10
model: /mesosphere/dcos/services/confluent-zookeeper/data.yml
render: mustache
---

# Version 2.7.0-5.1.2e

## Updates
- Upgraded the SDK to version `0.57.0`. See [SDK's Release Notes](https://github.com/mesosphere/dcos-commons/releases/tag/0.57.0) for more information.

## New Features
- Added support for DC/OS Storage Service (DSS). See official [DSS docs](https://docs.d2iq.com/mesosphere/dcos/services/storage/1.0.0) for more details.
- By upgrading the SDK, Kafka now comes with support for:
  - Quota enforcement
  - Node draining

 # Version 2.5.0-4.1.3e
 
## Updates 

- Update to {{ model.techName }} version `4.1.3e`
- SDK bumped to `0.55.4` 

<!--
# Version 2.4.0-4.0.0e

## Bug Fixes
- [DCOS-40634] Fix a bug where restarting more than one server in an ensemble at a time would cause the servers to not be able to start due to waiting for other servers that are also down. -->

<!--
# Version 2.3.0-4.0.0e

## Features
- All frameworks (Confluent ZooKeeper included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Bug Fixes
- The `zookeeper.autopurge_purge_interval` in the configuration options is now used when configuring the system. Previously, the  `zookeeper.autopurge_snap_retain_count` value with a default of 3 was used (#98)
- Metrics have been fixed on DC/OS 1.9 clusters (#99) -->

<!--
# Version 2.2.0-4.0.0e

## Features

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/mesosphere/dcos/services/confluent-zookeeper/2.2.0-4.0.0e/security/#securely-exposing-dcos-confluent-zookeeper-outside-the-cluster).
- Support for deploying the service in a remote region. -->

<!--


# Version 2.1.0-4.0.0e

This is the initial GA release of the DC/OS Confluent ZooKeeper service.

## Features

- Support for Kerberos authorization and authentication.
- Support for Zone placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Support for 3 or 5 ZooKeeper nodes.
- Support for pausing ZooKeeper nodes for debugging and recovery purposes.
-->
