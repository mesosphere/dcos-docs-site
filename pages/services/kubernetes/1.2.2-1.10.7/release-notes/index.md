---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.2.2-1.10.7

## Upgrade Notices

* Users running pre-`1.2.0-1.10.5` versions are **STRONGLY ENCOURAGED** to follow the steps described in
  the new _Updating the package options in pre-`1.2.0-1.10.5` versions_ section
  of the [Upgrade](../upgrade) document.

## Deprecation Notices

* The Kubernetes API's insecure port is being deprecated, and will be
  permanently disabled in a future release.

## Improvements

* Kubernetes v1.10.7.
* Docker v18.06.1-ce.

## Bug Fixes

* Fixed a bug which could forever fail to run public Kubernetes nodes tasks.

## Documentation

None

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
