---
layout: layout.pug
navigationTitle:
excerpt:
title: Release Notes
menuWeight: 120
model: /services/kafka-zookeeper/data.yml
render: mustache
---

# Version 2.2.0-3.4.11

## Features

- Support for using a custom top level domain to facilitate exposing the service securely outside of the cluster. Details [here](/services/kafka-zookeeper/2.2.0-3.4.11/security/#securely-exposing-dcos-kafka-zookeeper-outside-the-cluster).
- Support for launching the service in a remote region.


# Version 2.1.0-3.4.11

This is the initial GA release of the DC/OS Apache ZooKeeper service.

## Features

- Support for Kerberos authorization and authentication.
- Support for Zone placement constraints in DC/OS 1.11 (beta versions of DC/OS 1.11 coming soon).
- Support for 3 or 5 ZooKeeper nodes.
- Support for pausing ZooKeeper nodes for debugging and recovery purposes.
