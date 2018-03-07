---
layout: layout.pug
navigationTitle:  Release Notes
title: Release Notes
menuWeight: 90
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 0.5.0-1.9.1-beta

## Breaking Changes

- We now support DC/OS 1.11 alone, as has been planned all along. There will be no more
  releases compatible with DC/OS 1.10.

## Improvements

- Kubernetes v1.9.1.
- Docker v18.02.0-ce-rc2 because of [this runc issue](https://github.com/moby/moby/pull/36097)
  that was [originally discussed by us](https://github.com/containerd/containerd/issues/1882).
- Metrics Server is now deployed as an addon, replacing Heapster and enabling
  the `metrics.k8s.io/v1beta1` API.
- The kubelet no longer terminates when it finds swap is enabled on the agent -
  [Kubernetes doesn't support swap](https://github.com/kubernetes/kubernetes/issues/53533).
- kubelet-resource-watchdog (v0.2.0): Add support for kube-node disk usage
  monitoring. The kubelet doesn't understand how to calculate free disk space
  when it's running in a Mesos container. We monitor disk space inside the Mesos
  sandbox and when a configurable threshold is reached we trigger image
  container runtime garbage collection (we delete exited containers and their
  images). If after a garbage collection cycle, we still detect disk pressure we
  proceed to evict pods.
- There is no longer the need for a SSH tunnel in order to access the Kubernetes
  API for most operations. Please refer [here](connecting-clients.md) for more details.

## Bug Fixes

- kubelet-resource-watchdog (v0.2.0): Fix to memory usage monitor. Do not
  include page cache (including tmpf) and instead monitor total resident set
  size memory usage.
- Custom Kubernetes service CIDR wasn't working since the generation of `kube-apiserver`
  TLS certificates ignored this change and enforced `10.100.0.1` in SANS IPs
  field.

## Documentation

- Ingress.
- AWS cloud-provider.
- More details on how we do TLS on Open vs EE DC/OS.
- Fixed backup/restore formatting.
- Add notes about the fact the service name specified when installing the package
  must start and end with an alphanumeric character, be composed only of
  alphanumeric characters,underscores and dashes, and be no longer than 24 characters.
- Custom Kubernetes service CIDR.

## Known Issues

- The service name specified when installing the package must start and end with
  an alphanumeric character, be composed only of alphanumeric characters,
  underscores and dashes, and be no longer than 24 characters. In particular,
  this means that installing the package under a group (e.g., using
  `/dev/kubernetes` as the service name) is not supported.
- XFS filesystem is supported (RHEL 7.2 and higher), but only with `d_type=true` enabled. Use
  `xfs_info` to verify that the `ftype` option is set to `1`. To format an XFS filesystem correctly,
  use the flag `-n ftype=1`.
- The kubelet-resource-watchdog doesn't support disk usage yet, hence pod eviction based on this
  metric is failing.
- The `kubectl top` subcommand does not work with Metrics Server yet. Upstream tracking issues are
  kubernetes/kubernetes#55489 and kubernetes/kubernetes#56206.
- An SSH tunnel is still required for operations such as `kubectl proxy`.
