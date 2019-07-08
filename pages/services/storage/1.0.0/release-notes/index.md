---
layout: layout.pug
origin: github.com/mesosphere/dcos-storage/docs/release-notes/index.md
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Discover the new features, updates, and known limitations in this release of DC/OS Storage Service
enterprise: true
---

# Release notes for DC/OS Storage Service version 1.0.0

* This version of the DC/OS Storage Service is considered Generally Available and all users are strongly encouraged to upgrade from previous versions.
* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.13.2 or later.

## New Features

* The `devices` volume provider now blacklists descendants of blacklisted devices by default. To override the default behavior, you can also explicitly blacklist a device using the `blacklist-exactly` configuration option.
* The `devices` and `lvm` volume providers now emit metrics. For more information see [New Metrics](#new-metrics).
* DSS can manage storage providers and volumes on agents that also advertise GPU resources.
* Operator can scrub volume removal operations that will never complete due to interrupted `DESTROY_DISK` operations.
* Operator can scrub local volumes and local volume providers that DSS reports as `MISSING`.
* Volume remove operations can be canceled. If no Mesos operations been issued to remove the volume, you can cancel the removal request.
* Operator can more easily remove failing providers from a node.
* The `dcos storage volume create` accepts create parameters via JSON file or `stdin`.
* The `dcos storage ...` commands accept a `-v` flag to toggle verbose logging.

## Updates

* Additional logging of API requests and responses.
* Enforce uniqueness of device provider names.
* More robust enforcement of non-overlapping devices among multiple `lvm` volume providers.
* Device provider creation validates that the target node is known to DSS.
* Prevent volume lifecycle operations when the parent provider is being modified, or is otherwise not ready.
* Prevent provider modifications when that provider has an in-progress volume operation.
* Removed permissions that are no longer needed by storage principal (related to marathon, package, storage service).
* DSS running on permissive mode clusters requires storage principal configuration.
* DSS running on strict mode clusters requires `enforce-authorization` to be enabled.
* `dcos storage ... list` commands display results in sorted order.
* `dcos storage provider list` table header `STATE` is now called `STATUS` (for consistency).
* Removed the `--all` flag from `dcos storage provider list`
* The `--timeout` flag sets a timeout after which the CLI will abort its operation instead of relying on the server to time out the operation. The CLI will keep retrying internally until the timeout is hit or a non-timeout error or success is achieved.
* Removed the previously deprecated "Artifacts Container" installation method.
* Secondary DSS instances will refuse to start if a primary instance is already running.
* Actively monitor Mesos heartbeats to DSS and trigger re-connection as needed.
* The DSS package includes a `LICENSES` file that contains copies of all OSS licenses.
* Service bug fixes, performance fixes, security fixes, as well as other doc fixes and improvements.

## Limitations

* [](https://jira.mesosphere.com/browse/ASF-2423) Only local volume storage is currently supported.
* [](https://jira.mesosphere.com/browse/DCOS-52744) Only manual [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are supported at this time.
* Volume size must be a multiple of 4MiB, which is the default size of an LVM extent. Otherwise, DSS will reply with an error when attempting to create the volume.
* When planning to manually remove a logical volume via `lvremove`, the operator is responsible for zeroing the volume prior to removal.

## Known Issues

* [](https://jira.mesosphere.com/browse/ASF-1655) In the event of an unexpected device and/or volume change on an agent, you must restart the agent for the `devices` and `lvm` providers to reconcile the condition. For example, if you add or remove devices, restart the agent to update the `devices` volume provider with the changes.
* `dcos storage` CLI subcommands may fail with a gateway timeout error, but still complete successfully in the background.
* [](https://jira.mesosphere.com/browse/ASF-1655) The Mesos SLRP implementation is not yet compatible with multiple profiles that consume capacity from the same provider in different ratios (for example, RAID1 and linear). To work around this, create multiple providers, each of which is wholly dedicated to linear or RAID1.
* [](https://jira.mesosphere.com/browse/DCOS-44108) The storage service should only list providers that it currently manages; incompletely removed providers may be incorrectly listed in some cases.
* Deleting a volume may fail with "Cannot allocate memory" on some versions of CoreOS. To avoid this issue, ensure you are using a [supported version](/latest/version-policy/#dcos-platform-version-compatibility-matrix) of CoreOS.
* Kernels from (including) 3.10.0-862.6.3.el7 up to (including) 3.10.0-862.11.6.el7 may panic as a result of LVM operations (https://access.redhat.com/solutions/3520511).
* The DC/OS installer may issue one or more *WARNING* messages regarding missing kernel modules:
    ```
    Checking if kernel module raid1 is loaded: WARNING Kernel module raid1 is not loaded. DC/OS Storage Service (DSS) depends on it.
    Checking if kernel module dm_raid is loaded: WARNING Kernel module dm_raid is not loaded. DC/OS Storage Service (DSS) depends on it.
    ```
    To resolve the issue, configure the `raid1` and `dm_raid` kernel modules to load at OS boot time.
* Using NVMe storage with DSS may require additional modifications to the underlying OS. For more information see these [suggested commands and helper scripts](/latest/storage/external-storage/#ebs-specific).
* [](https://jira.mesosphere.com/browse/DCOS-54794) The device names (e.g. `sda`) used to create volume providers can be unstable over time thus [precautions](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/storage_administration_guide/persistent_naming) should be taken to avoid this condition.
* [](https://jira.mesosphere.com/browse/DCOS-55524) The DC/OS UI shows an incorrect unit for DC/OS Storage volume size in the service create modal – the value will be treated as MiB instead of GiB as stated in the UI.
* [](https://jira.mesosphere.com/browse/DCOS-44055) The DC/OS cluster's reported total disk resources is inflated due to double-counting of DSS devices.

## New Metrics
All metrics related to the DC/OS Storage Service have a prefix of `csidevices_`, `csilvm_`, or `dss_`.

### New `devices` provider metrics
* `csidevices_uptime`: the uptime (in seconds) of the process
* `csidevices_requests`: number of requests served, tagged by:
    * `result_type`: one of `success`, `error`
    * `method`: the RPC name, e.g., `/csi.v0.Controller/ListVolumes`
* `csidevices_requests_latency_(stddev,mean,lower,count,sum,upper)`: the request duration (in milliseconds), tagged by:
    * `method`: the RPC name, e.g., `/csi.v0.Controller/ListVolumes`
* `csidevices_devices`: the number of devices reported by ListVolumes

### New `lvm` volume provider metrics
* `csilvm_uptime`: the uptime (in seconds) of the process
* `csilvm_requests`: number of requests served, tagged by:
    * `result_type`: one of `success`, `error`
    * `method`: the RPC name, e.g., `/csi.v0.Controller/CreateVolume`
* `csilvm_requests_latency_(stddev,mean,lower,count,sum,upper)`: the request duration (in milliseconds), tagged by:
    * `method`: the RPC name, e.g., `/csi.v0.Controller/CreateVolume`
* `csilvm_volumes`: the number of active logical volumes
* `csilvm_bytes_total`: the total number of bytes in the volume group
* `csilvm_bytes_free`: the number of bytes available for creating a linear logical volume
* `csilvm_bytes_used`: the number of bytes allocated to active logical volumes
* `csilvm_pvs`: the number of physical volumes in the volume group
* `csilvm_missing_pvs`: the number of pvs given on the command-line but are not found in the volume group
* `csilvm_unexpected_pvs`: the number of pvs not given on the command-line but are found in the volume group
* `csilvm_lookup_pv_errs`: the number of errors encountered while looking for pvs specified on the command-line

### New DSS metrics
* `dss_agent_lookups_hits`: number of successful agent address lookups (via cache)
* `dss_agent_lookups_misses`: number of failed agent address lookups (via cache)
* `dss_mesosclient_master_getAgents_shared`: count of coalesced API calls
* `dss_obj_providers_missing`: number of `MISSING` providers
* `dss_obj_volumes_missing`: number of `MISSING` volumes
* `dss_ops_providers_create`: duration of provider create operations
* `dss_ops_providers_modify`: duration of provider modify operations
* `dss_ops_providers_remove`: duration of provider remove operations
* `dss_ops_volumes_create`: duration of volume create operations
* `dss_ops_volumes_remove`: duration of volume remove operations
* `dss_sched_hb_disabled`: non-zero if scheduler is subscribed to mesos w/o heartbeats enabled
* `dss_sched_hb_missed`: missed mesos heartbeats
* `dss_sched_hb_missed2Many`: how many times the number of consecutively missed mesos heartbeats triggered reconnection to mesos

<!--
# Release notes for Beta DC/OS Storage Service version 0.6.0

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.13 or later.

## New Features

* Volume capacity constraints may be specified as part of a volume profile.
* Added and enhanced existing CLI commands to support mitigation of issues resulting from agent reconfiguration events.
* SDK-based services (still in Beta) may consume DC/OS Storage Service volumes.
* Storage provider configurations may be modified in place, and no longer require a remove/reinstall cycle in order to update.
* Storage plugins are upgradable in-place, and no longer require a remove/reinstall cycle in order to upgrade.
* Storage service diagnostics are downloaded as part of the DC/OS Diagnostics bundle.

## Updates

* Narrowed the scope of Mesos disk permissions required by the storage service.
* `devices` volume provider is not removable if another provider (e.g. `lvm` provider) is consuming one or more of its devices.
* Improved observability via additional metrics instrumented throughout the storage service.
* `journald+logrotate` logging enabled, by default, for the storage service.
* Streamlined resource management via default storage service offer filters.
* Tutorial for extending the default Universal Installer configuration in order to provide additional raw disks for the storage service to consume.
* Service bug fixes, performance fixes, as well as other doc fixes and improvements.

## Limitations

* Only local volume storage is currently supported.
* Automated [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are not yet supported.
* The service must be deployed in a DC/OS cluster running in `strict` [security](/latest/security/ent/#security-modes) mode when configured with a service account and corresponding secret.

## Known Issues

DC/OS Storage Service is currently in Beta and has the following known bugs.

* `devices` volume providers do not witness new or removed devices on the agent until the agent is restarted.
* `dcos storage` CLI subcommands may fail with a gateway timeout error, but still complete successfully in the background.
* The Mesos SLRP implementation is not yet compatible with multiple profiles that consume capacity from the same provider in different ratios (for example, RAID1 and linear).
* The storage service should only list providers that it currently manages; incompletely removed providers may be incorrectly listed in some cases.
* Deleting a volume may fail with "Cannot allocate memory" on CoreOS; please use a [supported version](/latest/version-policy/#dcos-platform-version-compatibility-matrix) of CoreOS.
* Kernels from (including) 3.10.0-862.6.3.el7 up to (including) 3.10.0-862.11.6.el7 may panic as a result of LVM operations (https://access.redhat.com/solutions/3520511).

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
* `lvm` volume provider names are now limited to 64 characters in length.
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

* `devices` volume providers do not witness new or removed devices on the agent until the agent is restarted.
* `dcos storage` CLI subcommands may fail with a gateway timeout error, but still complete successfully in the background.
* `MOUNTPOINT` and `FSTYPE` are no longer available via `dcos storage device list`.
* The Mesos SLRP implementation is not yet compatible with multiple profiles that consume capacity from the same provider in different ratios (for example, RAID1 and linear).
* The storage service should only list providers that it currently manages; incompletely removed providers may be incorrectly listed in some cases.
* Deleting a volume may fail with "Cannot allocate memory" on CoreOS; please use a [supported version](/latest/version-policy/#dcos-platform-version-compatibility-matrix) of CoreOS.
* Kernels from (including) 3.10.0-862.6.3.el7 up to (including) 3.10.0-862.11.6.el7 may panic as a result of LVM operations (https://access.redhat.com/solutions/3520511).

# Version 0.4.0

* This version of the DC/OS Storage Service requires DC/OS Enterprise version 1.12 or later.

## New features

* Local volume provider support for LVM-backed RAID1 storage. See the [Volume plugins](../volume-plugins/) documentation for details.

## Updates

* Added the `--all` flag for the `list` action of storage CLI subcommands `profile`, `provider`, and `volume`.
* The `--timeout` flag, added to all storage CLI subcommands, limits the time that the CLI waits for a storage service response.
* Improved error reporting for storage CLI subcommands.
* Improved interoperability with other DC/OS CLI subcommands.
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
* Removing a `devices` volume provider from a node is not supported.
* Automated [upgrades](../upgrades/) of a running DC/OS Storage Service on an existing cluster are not yet supported.
* The service must be deployed in a DC/OS cluster running in `strict` [security](/latest/security/ent/#security-modes) mode when configured with a service account and corresponding secret.

## Known Issues

DC/OS Storage Service is currently in Beta and has the following known bugs.

* Local volume creation will fail if the volume provider name is too long.
* Local volume removal can hang indefinitely.
* `devices` volume providers do not witness new or removed devices on the agent until the agent is restarted.
* Multiple storage providers with the same name can be created, but only uniquely named providers are listed.
* `dcos storage` CLI subcommands may fail with a gateway timeout error, but still complete successfully in the background.

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
* Removing a `devices` volume provider from a node is not supported.
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
