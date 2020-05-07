---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for DC/OS Kubernetes version 2.5.0-1.16.9
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.5.0-1.16.9

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.5.0-1.16.9` requires DC/OS 1.12 or higher.
* DC/OS Kubernetes `2.5.0-1.16.9` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes 1.x to `2.5.0-1.16.9`.
* Before installing `kubernetes-cluster` package `2.5.0-1.16.9`, the `kubernetes` package must be [installed and running](/mesosphere/dcos/services/kubernetes/2.5.0-1.16.9/getting-started/installing-mke/).
* Now, when installing DC/OS Kubernetes on DC/OS Enterprise, you must specify a [service account](/mesosphere/dcos/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/mesosphere/dcos/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes 1.16.9
* etcd 3.3.20
* Calico 3.13.1
* Replace Ark With Velero 1.3.2 for cluster backup and restore functionality
* Update Debian base container images to version stable-20200414-slim

## Bug Fixes

## Documentation

## Known Issues

Known issues and limitations are listed in the [Limitations](/mesosphere/dcos/services/kubernetes/2.5.0-1.16.9/limitations/) page.

## Changelog

See [Changelog](/mesosphere/dcos/services/kubernetes/2.5.0-1.16.9/changelog) for a list of all changes.
