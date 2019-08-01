---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for DC/OS Kubernetes version 2.3.0-1.14.1
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.3.0-1.14.1

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.3.0-1.14.1` requires DC/OS 1.12.
* DC/OS Kubernetes `2.3.0-1.14.1` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes to `2.3.0-1.14.1`.
* Before installing `kubernetes-cluster` package `2.3.0-1.14.1`, the `kubernetes` package must be [installed and running](/mesosphere/dcos/services/kubernetes/2.3.0-1.14.1/getting-started/installing-mke/).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/mesosphere/dcos/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/mesosphere/dcos/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes 1.14.1
* Docker 18.09.4
* CoreDNS v1.4.0
* Calico 3.5.4
* Enable [Pod Priority scheduling and preemption](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/)
* Allow for defining the maximum amount of disk space taken by pods' containers' log files (defaults to 1MB).
  The default can be overriden by setting the  `kubernetes.maximum_container_log_size` configuration option.

## Bug Fixes


## Documentation

* Fix a few items in the [limitations section](/mesosphere/dcos/services/kubernetes/2.3.0-1.14.1/limitations/).


## Known Issues

Known issues and limitations are listed in the [Limitations](/mesosphere/dcos/services/kubernetes/2.3.0-1.14.1/limitations/) page.

## Changelog

See [Changelog](/mesosphere/dcos/services/kubernetes/2.3.0-1.14.1/changelog) for a list of all changes.
