---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.0.0-1.9.3

## Improvements

* Kubernetes v1.9.3.
* KubeDNS 1.14.8.
* Adopt [new `kube-apiserver` lease endpoint reconciler](https://kubernetes.io/docs/admin/high-availability/building/#endpoint-reconciler) for HA scenarios.
* Introduce opt-in HA mode.
* Revamp backup/restore.
* Revamp updates.
* Add `MutatingAdmissionController` and `ValidatingAdmissionController` admission controllers.
* Re-order admission controllers.
* It is now possible to set path for `dcos` and/or `kubectl` executables (e.g.,
  `dcos kubernetes kubeconfig --path-to-kubectl=/opt/kubernetes-1.9.3/bin/kubectl`).

## Bug Fixes

* Use more recent executor in order to fix tasks not being scheduled even
  though DC/OS has enough resources.
* Fix (re)deploy of Kubernetes nodes, both private and public.
* `dcos kubernetes kubeconfig` is clear about missing `dcos` and/or `kubectl` executables.

## Documentation

* Reorganize documentation structure.
* Introduce opt-in HA mode.
* Revamp backup/restore.
* Revamp updates.

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
