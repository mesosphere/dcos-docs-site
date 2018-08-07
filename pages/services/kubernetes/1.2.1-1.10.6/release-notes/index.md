---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.2.1-1.10.6

## Upgrade Notices

* Users running pre-`1.2.0-1.10.5` versions are **STRONGLY ENCOURAGED** to follow the steps described in
  the new _Updating the package options in pre-`1.2.0-1.10.5` versions_ section
  of the [Upgrade](../upgrade) document.

## Deprecation Notices

* The Kubernetes API's insecure port is being deprecated, and will be
  permanently disabled in a future release.

## Improvements

* Kubernetes v1.10.6.
* dcos-commons v0.52.1.
* Added a new configuration property that allows for specifying the reserved resources for public nodes.

## Bug Fixes

* Fixed a bug which might cause one of the mandatory addons to fail to install
  under some circumstances.
* Fixed a bug which prevents CNI allocating a pod IP due to no
  available addresses in requested 9.x.x.x/25 range.
* Fixed a bug which might cause some `kube-node` and `kube-node-public` tasks to
  take more time than expected to be marked as ready.
* Fixed a bug which might cause certain commands to malfunction when the package
  is installed under a folder (e.g. `prod/kubernetes`).

## Documentation

* Updated the documentation to explain the usage of the new configuration property `kubernetes.public_reserved_resources`.

## Known Issues

* XFS filesystem is supported (RHEL 7.2 and higher), but only with `d_type=true`
  enabled. Use `xfs_info` to verify that the `ftype` option is set to `1`.
  To format an XFS filesystem correctly, use the flag `-n ftype=1`.
* Switching the value of the `kubernetes.high_availability` option off after the
  creation of the cluster is not supported.
* Replacing the `etcd` or `kube-node` pods when `kubernetes.high_availability` is disabled
  may result in permanent data loss.
* Nodes are currently restricted to running 10 pods per available CPU core, up
  to a maximum of 100 pods per node. This will be configurable in future
  releases.
* Changing the value of the `kubernetes.authorization_mode` option after installing the package is not supported.
