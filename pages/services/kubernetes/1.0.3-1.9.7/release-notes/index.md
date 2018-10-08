---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.0.3-1.9.7

## Breaking Changes

* None

## Improvements

* Docker 18.03-ce
* kube-dns v1.14.9
* CoreDNS v1.1.1
* Etcd v3.3.3
* Bump Kubernetes pause container to v3.1
* Kubernetes v1.9.7

## Bug Fixes

* None

## Documentation

* None

## Known Issues

* XFS filesystem is supported (RHEL 7.2 and higher), but only with `d_type=true` enabled. Use
  `xfs_info` to verify that the `ftype` option is set to `1`. To format an XFS filesystem correctly,
  use the flag `-n ftype=1`.
* The [`kubectl top` subcommand does not work properly yet](https://github.com/kubernetes/kubernetes/issues/59438).
* An SSH tunnel is still required for operations such as `kubectl proxy`.
* Switching the value of the new `high_availability` option off after the
  creation of the cluster is not supported.
* Replacing the `etcd` or `kube-node` pods when `high_availability` is disabled
  may result in permanent data loss.
* Nodes are currently restricted to running 10 pods per available CPU core, up to a maximum of 100 pods per node. This
  will be configurable in future releases.
