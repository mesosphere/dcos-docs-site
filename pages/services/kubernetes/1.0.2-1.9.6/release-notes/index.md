---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 120
excerpt:
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


# Version 1.0.2-1.9.6

## Breaking Changes

* `kubernetes-api-proxy` is replaced by `kubernetes-proxy`. You should re-run
  `dcos kubernetes kubeconfig` after updating the package, and delete the
  `kubernetes-api-proxy` Marathon application manually by running
  `dcos marathon app remove /kubernetes-api-proxy`.

## Improvements

* Kubernetes 1.9.6
* Kubelet API access is now [secured by mutual TLS authentication](https://kubernetes.io/docs/admin/kubelet-authentication-authorization/#kubelet-authentication).
* CLI: `kubeconfig` subcommand now has a `--[no-]activate-context` flag to
  disable automatically switching to the configured `kubectl` context.
* CLI: `kubeconfig` subcommand now has a `--context-name` flag to specify the
  name of the kubeconfig context to create/update.
* Bump Kubernetes Dashboard to v1.8.3.
* Kubernetes Dashboard is now accessible via the DC/OS UI. Check
  [Kubernetes Dashboard](../kubernetes-dashboard) for details on how to access.

## Bug Fixes

* Fix support for air-gapped clusters which use [local universe](/1.11/administering-clusters/deploying-a-local-dcos-universe/).

## Documentation

* Added new section with instructions for accessing the
  [Kubernetes Dashboard](../kubernetes-dashboard).

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
