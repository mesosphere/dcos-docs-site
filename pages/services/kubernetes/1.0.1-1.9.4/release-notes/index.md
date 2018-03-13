---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- The source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.0.1-1.9.4

## Improvements

* [Kubernetes 1.9.4](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md#changelog-since-v193)
* [etcd 3.3.2](https://github.com/coreos/etcd/blob/master/CHANGELOG-3.3.md#v332-2018-03-08)

## Bug Fixes

* Bump Kubernetes to v1.9.4 to fix [critical security issues with subpath volume mount handling](https://github.com/kubernetes/kubernetes/issues/60813).
* Bump `dcos-commons` to v0.40.5, which fixes [a cleanup issue](https://github.com/mesosphere/dcos-commons/pull/2368)
  where this framework could, in very limited scenarios, clean up other frameworks'
  volumes.
* Fix `dcos kubernetes kubeconfig` to support DC/OS Open when `oauth_enabled` is
  `false`.

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
