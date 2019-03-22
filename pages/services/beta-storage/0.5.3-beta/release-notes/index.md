---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Discover the new features, updates, and known limitations in this release of the Beta DC/OS Storage Service
enterprise: true
beta: true
---
#include /services/include/beta-software-warning.tmpl

# Release notes for Beta DC/OS Storage Service version 0.5.3

* This is a bug fix release, see the [version 0.5.0](#version_050) release notes for major changes between 0.4.x and 0.5.x.

## Updates

* `min-allocatable-disk` is a new DSS configuration option.
* Documentation corrections and updates.

# Release notes for Beta DC/OS Storage Service version 0.5.2

* This is a bug fix release, see the [version 0.5.0](#version_050) release notes for major changes between 0.4.x and 0.5.x.

## Updates

* LVM plugin performance improvements.
* Documentation corrections and updates.

<a name="version_050"></a>
# Release notes for Beta DC/OS Storage Service version 0.5.0

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.12.1 or later.
* Upgrading DSS from v0.4.x to v0.5.x requires [manual intervention](../upgrades/). Simply upgrading the `beta-storage` package is not sufficient.

## Updates

* More robust coordination with Mesos in regard to resource reservations and create/remove volume operations.
* Configurable `logrotate` maximal `stdout`/`stderr` size for the DC/OS Storage Service itself.
* LVM provider names are now limited to 64 characters in length.
* The `devices` and `lvm` plugins have been updated with fixes.
* Added `log-journald` package configuration option to redirect storage service logs to `journald`.
* Provider and volume records are purged from DSS history upon successful removal.
* Increase default CPU requirements to reduce CPU throttling and API tail latencies.
* Various other bug/performance fixes and documentation corrections.

## Limitations

* Only local volume storage is currently supported.
* Volume profile deactivation is not supported.
* Automated [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are not yet supported.
* The service must be deployed in a DC/OS cluster running in `strict` [security](/latest/security/ent/#security-modes) mode when configured with a service account and corresponding secret.

## Known Issues

DC/OS Storage Service is currently in Beta and has the following known bugs.

* The `devices` provider plugin does not witness new or removed devices on the agent until the agent is restarted.
* `dcos storage` CLI sub-commands may fail with a gateway timeout error, but still complete successfully in the background.
* `MOUNTPOINT` and `FSTYPE` are no longer available via `dcos storage device list`.
* The Mesos SLRP implementation is not yet compatible with multiple profiles that consume capacity from the same provider in different ratios (for example, RAID1 and linear).
* The storage service should only list providers that it currently manages; incompletely removed providers may be incorrectly listed in some cases.
* Deleting a volume may fail with "Cannot allocate memory" on CoreOS; please use a [supported version](/latest/version-policy/#dcos-platform-version-compatibility-matrix) of CoreOS.
* Kernels from (including) 3.10.0-862.6.3.el7 up to (including) 3.10.0-862.11.6.el7 may panic as a result of LVM operations (https://access.redhat.com/solutions/3520511).

<!--
# Version 0.4.0

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.12 or later.

## New features

* Local volume provider support for LVM2-backed RAID1 storage. See the [Volume plugins](../volume-plugins/) documentation for details.

## Updates

* Added the `--all` flag for the `list` action of storage CLI sub-commands `profile`, `provider`, and `volume`.
* The `--timeout` flag, added to all storage CLI sub-commands, limits the time that the CLI waits for a storage service response.
* Improved error reporting for storage CLI sub-commands.
* Improved interoperability with other DC/OS CLI sub-commands.
* Emitted statsd metrics use `_` instead of `.` as a sub-label separator.
* Additional metrics for previously untracked Mesos API interactions.
* Increased verbosity for debug logging in the RPC layer.
* Support for performance diagnosis at run-time.
* Configurable CPU, memory, and disk resource usage for the DC/OS Storage Service itself.
* Improvements to Mesos offer handling to improve throughput and reduce offer contention.
* Documentation corrections and enhancements.
* Various other bug fixes.

## Limitations

DC/OS Storage Service is currently in Beta and has the following known limitations.

* Only local volume storage is currently supported.
* Volume profile deactivation is not supported.
* Removing the devices provider from a node is not supported.
* Automated [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are not yet supported.
* The service must be deployed in a DC/OS cluster running in `strict` [security](/latest/security/ent/#security-modes) mode when configured with a service account and corresponding secret.

## Known Issues

DC/OS Storage Service is currently in Beta and has the following known bugs.

* Local volume creation will fail if the volume provider name is too long.
* Local volume removal can hang indefinitely.
* The `devices` provider plugin does not witness new or removed devices on the agent until the agent is restarted.
* Multiple storage providers with the same name can be created, but only uniquely named providers are listed.
* `dcos storage` CLI sub-commands may fail with a gateway timeout error, but still complete successfully in the background.

# Version 0.3.2

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.12 or later.

## Updates

* Updated the doc to add the `resource_provider` read permission to the install steps.

# Version 0.3.1

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.12 or later.

## Updates

* Fixed the `minDcosReleaseVersion` on the package so the package does not install on 1.11 (or older) DC/OS.

# Version 0.3.0

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.12 or later.

## New features

* Add support for [device blacklist](../cli-references/dcos-storage-device/).
* [Installation](../install/package-registry-based/) via DC/OS Package Registry.
* Publish service metrics to DC/OS [metrics](/latest/metrics/).

## Updates

* Devices [volume plugin](../terminology-and-concepts/) needs be installed manually from this version.
* Compatible with DC/OS clusters running in `strict` [security](/latest/security/ent/#security-modes) mode, see [installation notes](../install/) for details.
* CLI commands report additional details for errors generated by the DC/OS Storage Service.
* Plugin [logs are viewable](../tutorials/) via [DC/OS CLI](../latest/cli/command-reference/dcos-node/dcos-node-log/).
* Bug fixes and other minor improvements.

## Limitations

DC/OS Storage Service is currently in Beta and has the following known limitations.

* Volume profile deactivation is not supported.
* Only linear target is supported by the LVM volume plugin.
* Removing the devices provider from a node is not supported.
* Automated [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are not yet supported.

# Version 0.2.0

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.11.1 or later.

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

-->
