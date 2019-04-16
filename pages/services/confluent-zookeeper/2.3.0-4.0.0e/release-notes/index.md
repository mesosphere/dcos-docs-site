---
layout: layout.pug
navigationTitle:
excerpt: Discover the new features, updates, and known limitations in this release of the Confluent ZooKeeper Service
title: Release Notes
menuWeight: 10
model: /services/kafka-zookeeper/data.yml
render: mustache
---

# Release Notes for Confluent ZooKeeper Service version 2.3.0-4.0.0e

## Features
- All frameworks (Confluent ZooKeeper included) now isolate their `/tmp` task directories by making them Mesos [`SANDBOX_PATH` volume sources](https://github.com/apache/mesos/blob/master/docs/container-volume.md#sandbox_path-volume-source). ([#2467](https://github.com/mesosphere/dcos-commons/pull/2467) and [#2486](https://github.com/mesosphere/dcos-commons/pull/2486))

## Bug Fixes
- The `zookeeper.autopurge_purge_interval` in the configuration options is now used when configuring the system. Previously, the  `zookeeper.autopurge_snap_retain_count` value with a default of 3 was used (#98)
- Metrics have been fixed on DC/OS 1.9 clusters (#99)

<!-- # Version 2.2.0-4.0.0e

## Features

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/services/confluent-zookeeper/2.2.0-4.0.0e/security/#securely-exposing-dcos-confluent-zookeeper-outside-the-cluster).
- Support for deploying the service in a remote region.


# Version 2.1.0-4.0.0e

This is the initial GA release of the DC/OS Confluent ZooKeeper service.

## Features

- Support for Kerberos authorization and authentication.
- Support for Zone placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Support for 3 or 5 ZooKeeper nodes.
- Support for pausing ZooKeeper nodes for debugging and recovery purposes.
 -->