---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.1.0-1.10.3

## Breaking Changes

* The `kubernetes-proxy` Marathon application used to expose the Kubernetes API
  to outside the DC/OS cluster has been removed. The user is now responsible for
  [exposing](../connecting-clients) the Kubernetes API in a suitable way. Also,
  the user should remove any existing instances of the `kubernetes-proxy`
  service.

## Improvements

* Support for DC/OS strict mode installation.
* Support for enabling the RBAC authorization mode.
* Kubernetes v1.10.3
* Docker 18.03.1-ce
* Etcd v3.3.5

## Bug Fixes

* Fix framework installation in DC/OS Enterprise clusters that use a custom CA
  certificate.
* `localhost` is now a valid DNS name for `kube-apiserver`, allowing the
  Kubernetes API to be accessed via HTTPS when using an SSH tunnel.

## Documentation

* Add new page about Kubernetes Authorization modes.
* Update "Connecting Clients" page, following the authentication and
  authorization changes introduced in this release.

## Known Issues

* XFS filesystem is supported (RHEL 7.2 and higher), but only with `d_type=true`
  enabled. Use `xfs_info` to verify that the `ftype` option is set to `1`.
  To format an XFS filesystem correctly, use the flag `-n ftype=1`.
* The [`kubectl top` subcommand does not work properly yet](https://github.com/kubernetes/kubernetes/issues/59438).
* Switching the value of the `kubernetes.high_availability` option off after the
  creation of the cluster is not supported.
* Replacing the `etcd` or `kube-node` pods when `high_availability` is disabled
  may result in permanent data loss.
* Nodes are currently restricted to running 10 pods per available CPU core, up
  to a maximum of 100 pods per node. This will be configurable in future
  releases.
* Changing the value of the `kubernetes.authorization_mode` option after installing the package is not supported.
