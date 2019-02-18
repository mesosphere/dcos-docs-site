---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 100
excerpt: Release notes for DC/OS Kubernetes version 2.2.0-1.13.3
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.2.0-1.13.3

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.2.0-1.13.3` requires DC/OS 1.12.
* DC/OS Kubernetes `2.2.0-1.13.3` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes to `2.2.0-1.13.3`.
* Before installing `kubernetes-cluster` package `2.2.0-1.13.3`, the `kubernetes` package must be [installed and running](/services/kubernetes/2.2.0-1.13.3/getting-started/installing-mke/).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes v1.13.3
* dcos-commons v0.55.2
* CoreDNS v1.3.1
* Enable CSI features required for CSI integration.
* Automate the task replacement when a DC/OS agent is decommissioned.
* Allow changing automated DC/OS proxy configuration into Kubernetes cluster tasks.

## Bug Fixes

* Fix a bug where providing `--aws-session-token` for `cluster backup` and `cluster restore` commands did not actually work.
* Fix a bug affecting clusters in which the Kubernetes service CIDR or Calico network CIDR overlapped with Docker's default bridge network by disabling the bridge.

## Documentation

* Add a [Storage](/services/kubernetes/2.2.0-1.13.3/operations/storage/) page documenting Container Storage Interface (CSI).

## Known Issues

Known issues and limitations are listed in the [Limitations](/services/kubernetes/2.2.0-1.13.3/limitations/) page.

## Changelog

See [Changelog](/services/kubernetes/2.2.0-1.13.3/changelog) for a list of all changes.
