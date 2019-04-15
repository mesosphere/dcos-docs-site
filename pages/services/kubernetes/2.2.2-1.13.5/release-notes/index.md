---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for DC/OS Kubernetes version 2.2.2-1.13.5
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.2.2-1.13.5

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.2.2-1.13.5` requires DC/OS 1.12.
* DC/OS Kubernetes `2.2.2-1.13.5` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes to `2.2.2-1.13.5`.
* Before installing `kubernetes-cluster` package `2.2.2-1.13.5`, the `kubernetes` package must be [installed and running](/services/kubernetes/2.2.2-1.13.5/getting-started/installing-mke/).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes v1.13.5
* Expose the Kubernetes controller manager secure port to access metrics with authentication and authorization, and disable the localhost insecure port.
* Expose the scheduler secure port to access metrics with authentication and authorization, and disable the localhost insecure port.
* Improve security of kubelet unauthenticated healthz endpoint by only binding to localhost.
* Improve security of kube-proxy unauthenticated healthz endpoint by only binding to localhost.
* Enable unauthenticated etcd /metrics endpoint on port 2381 by default. Available using DCOS VIP `http://etcd-N-peer.${KUBERNETES_CLUSTER_NAME}.autoip.dcos.thisdcos.directory:2381/metrics` where N is the task instance index.

## Bug Fixes


## Documentation


## Known Issues

Known issues and limitations are listed in the [Limitations](/services/kubernetes/2.2.2-1.13.5/limitations/) page.

## Changelog

See [Changelog](/services/kubernetes/2.2.2-1.13.5/changelog) for a list of all changes.
