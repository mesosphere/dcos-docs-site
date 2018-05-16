---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 80
excerpt: Discover the new features, updates, and known limitations in this release of the Beta DC/OS Storage Service.
enterprise: true
---

# Version 0.2.0

* This version of the DC/OS Storage Service requires DC/OS version 1.11.1 or later.

## New features

* Support deletion of local [volume providers](../terminology-and-concepts/).
* Support deletion of [volumes](../terminology-and-concepts/).

## Updates

* Updated LVM [volume plugin](../terminology-and-concepts/).
* Bug fixes and other minor improvements.

## Limitations

DC/OS Storage Service is currently in Beta and has the following known limitations.

* Volume profile deactivation is not supported.
* Cannot list devices or create volume provider on public agents.
* Only linear target is supported by the LVM volume plugin.
* Limited error reporting.
* The only supported DC/OS [security](/latest/security/ent/#security-modes) mode is `permissive`.
* Automated [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are not yet supported.

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
