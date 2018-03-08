---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 80
excerpt:
---

# Version 0.1.0

Initial release.

## New features

* Support creating [volume profiles](../terminology-and-concepts/).
* Support dynamically adding local [volume providers](../terminology-and-concepts/).
* Support dynamically creating [volumes](../terminology-and-concepts/) with profiles.
* Support listing [devices](../terminology-and-concepts/) on each agent node.
* Built-in LVM [volume plugin](../terminology-and-concepts/).
* Integrate with Apache Mesos [CSI](mesos.apache.org/documentation/latest/csi/) support.

## Limitations

DC/OS Storage Service is currently in Beta and has the following known limitations.

* Volume deletion is not supported.
* Volume provider deletion is not supported.
* Volume profile deactivation is not supported.
* Cannot list devices or create volume provider on public agents.
* Only linear target is supported by the LVM volume plugin.
