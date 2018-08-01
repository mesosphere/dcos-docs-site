---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.2.0-1.10.5

## Upgrade Notices

* Users running pre-`1.2.0-1.10.5` versions that don't plan on upgrading to
  `1.2.0-1.10.5` are **STRONGLY ENCOURAGED** to follow the steps described in
  the new _Updating the package options in pre-`1.2.0-1.10.5` versions_ section
  of the [Upgrade](../upgrade) document.

## Deprecation Notices

* The Kubernetes API's insecure port is being deprecated, and will be
  permanently disabled in a future release.

## Improvements

* Kubernetes v1.10.5.
* Etcd v3.3.8.
* dcos-commons v0.51.0.
* The package can now be installed under a group (e.g. `production/kubernetes`).
* [Node authorization](https://kubernetes.io/docs/reference/access-authn-authz/node/)
  is now enabled when using the RBAC authorization mode.
* It's now possible to disable exposing the Kubernetes API over an insecure
  port. This option is meant to give time to users to adopt the secure port and
  will be removed soon.
* `dcos kubernetes kubeconfig` will now refuse to overwrite existing `user`,
  `config` and `cluster` entries in the `KUBECONFIG` file.

## Bug Fixes

* Fixed a bug which could cause the `etcd` cluster to fail permanently under
  some circumstances.
* Fixed a bug which caused `dcos kubernetes kubeconfig` to overwrite existing
  entries in the `KUBECONFIG` file.
* Fixed a bug which caused `dcos kubernetes kubeconfig` not to observe the value
  of the `--[no-]activate-context` flag.
* Fixed a bug which could, in certain conditions during a package update,
  restart all Kubernetes nodes simultaneously, resulting in temporary downtime
  of any running Kubernetes workloads.
* Fixed bug where pod is unable to communicate with itself via a service. Enables
  hairpin mode by default in kubelet's CNI configuration.

## Documentation

* The suggested HAProxy configuration in
  [Exposing the Kubernetes API](../exposing-the-kubernetes-api) was updated with
  more adequate timeout values. Existing deployments of HAProxy based on this
  configuration should be updated based on the new suggested configuration.
* Added a new
  [Exposing the Kubernetes API via Marathon-LB or Edge-LB](../exposing-the-kubernetes-api-marathonlb).
* Added a new [Troubleshooting `etcd`](../troubleshooting-etcd) page.
* Added a section with recommended steps that should be performed by users who
  are not planning on upgrading their clusters to `1.2.0-1.10.5`.
* Removed the outdated _Container Networking Interface (CNI) Support_ page.

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
