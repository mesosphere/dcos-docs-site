---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 0.6.0-1.9.1-beta

## Breaking Changes

* We now support DC/OS 1.11 alone, as has been planned all along. There will be no more
  releases compatible with DC/OS 1.10.

## Improvements

* Kubernetes v1.9.1.
* Docker v18.02.0-ce which fixes [this runc issue](https://github.com/moby/moby/pull/36097)
  that was [originally discussed by us](https://github.com/containerd/containerd/issues/1882).
* Metrics Server is now deployed as an addon, replacing Heapster and enabling
  the `metrics.k8s.io/v1beta1` API.
* kubelet-resource-watchdog (v0.2.0): Add support for kube-node disk usage
  monitoring. The kubelet doesn't understand how to calculate free disk space
  when it's running in a Mesos container. We monitor disk space inside the Mesos
  sandbox and when a configurable threshold is reached we trigger image
  container runtime garbage collection (we delete exited containers and their
  images). If after a garbage collection cycle, we still detect disk pressure we
  proceed to evict pods.
* There is no longer the need for a SSH tunnel in order to access the Kubernetes
  API for most operations. Please refer [here](../connecting-clients) for more
  details.
* Experimental support for rolling-upgrades. Please refer [here](../upgrade)
  for more details.

## Bug Fixes

* The kubelet no longer terminates when it finds swap is enabled on the agent -
  [Kubernetes doesn't support swap](https://github.com/kubernetes/kubernetes/issues/53533).
* kubelet-resource-watchdog (v0.2.0): Fix to memory usage monitor. Do not
  include page cache (including tmpf) and instead monitor total resident set
  size memory usage.
* Custom Kubernetes service CIDR wasn't working since the generation of
  `kube-apiserver` TLS certificates ignored this change and enforced
  `10.100.0.1` in SANS IPs field.
* In DC/OS, the DNS resolution of `.directory` FQDN should happen locally to
  an agent node. However, when `kube-dns` forwards such DNS queries
  then they might get resolved on a non-local agent depending on where kube-dns
  might be running. This issue is now fixed by running a DNS forwarder in each
  kube-node which will make sure that `.directory` FQDNs goes to local DNS
  resolver.

## Documentation

* Running an ingress controller
* Enable AWS cloud-provider.
* More details on how we do TLS on Open vs EE DC/OS.
* Fix backup/restore formatting.
* Clarify the fact the service name specified when installing the package
  must start and end with an alphanumeric character, be composed only of
  alphanumeric characters,underscores and dashes, and be no longer than 24 characters.
* How to set a custom Kubernetes service CIDR.
* Upgrading this package and your Kubernetes cluster.

## Known Issues

* XFS filesystem is supported (RHEL 7.2 and higher), but only with `d_type=true` enabled. Use
  `xfs_info` to verify that the `ftype` option is set to `1`. To format an XFS filesystem correctly,
  use the flag `-n ftype=1`.
* The [`kubectl top` subcommand does not work properly yet](https://github.com/kubernetes/kubernetes/issues/59438).
* An SSH tunnel is still required for operations such as `kubectl proxy`.
