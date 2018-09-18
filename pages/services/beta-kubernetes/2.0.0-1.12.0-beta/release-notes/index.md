---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 2.0.0-1.12.0-beta

## Breaking Changes

* DC/OS Kubernetes `2.0.0-1.12.0-beta` requires DC/OS 1.12.
* DC/OS Kubernetes `2.0.0-1.12.0-beta` introduces breaking changes to the way the
  package works and is deployed. Hence, it is not possible to upgrade an
  existing installation of DC/OS Kubernetes to `2.0.0-1.12.0-beta`.
* DC/OS Kubernetes `2.0.0-1.12.0-beta` now requires a package-manager to be running in DC/OS. You must install the `beta-mke` package prior to installing this package.

## Improvements

* Kubernetes v1.12.0-beta.2
* Docker v18.06.1-ce
* Etcd v3.3.9
* dcos-commons v0.53.0
* Calico v3.2.1
* CoreDNS: v1.2.2
* Kubernetes Metrics Server v0.3.1
* Kubernetes Dashboard 1.10.0
* Ark v0.9.4
* Enabled high density deployments of multiple kubernetes clusters on DC/OS.
* Phased-out `kube-apiserver`, `kube-controller-manager` and `kube-scheduler` tasks. These are now deployed as static pods in a new task `kube-control-plane`.
* Phased-out `kube-proxy` and `coredns` tasks. These are now deployed as
  static pods, and `coredns` has been renamed as `local-spartan-forwarder`.
* Replace cluster DNS `kube-dns` deployment with `coredns`.
* Add the `priorityClassName` field to critical system pods.
* Use a dedicated RBAC role for the `kubelet-resource-watchdog`.
* Installation and package options upgrades are now faster.

## Bug Fixes

* Fixed a bug which might cause `kube-node` and `kube-node-public` tasks to
  freeze in the `STARTED` state, causing installations or upgrades to freeze
  indefinitely.
* Fixed a bug which could forever fail to run public Kubernetes nodes tasks.

## Documentation

* Updated the documentation to reflect the latest changes to the Kubernetes
  control plane, as well as multi-tenancy.
* Removed `Advanced Installation` page merging its content into `Install and Customize`.

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
* Changing the value of the `kubernetes.authorization_mode` option after
  installing the package is not supported.
* CentOS 7.4 and earlier are not supported.
