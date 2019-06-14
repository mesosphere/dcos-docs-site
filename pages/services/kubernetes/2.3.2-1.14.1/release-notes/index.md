---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for DC/OS Kubernetes version 2.3.2-1.14.1
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.3.2-1.14.1

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.3.2-1.14.1` requires DC/OS 1.12.
* DC/OS Kubernetes `2.3.2-1.14.1` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes to `2.3.2-1.14.1`.
* Before installing `kubernetes-cluster` package `2.3.2-1.14.1`, the `kubernetes` package must be [installed and running](/services/kubernetes/2.3.2-1.14.1/getting-started/installing-mke/).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Add media types required to show dropdown box in secrets and service account configuration. This UI feature will ship as an update and with DC/OS 1.13.1. It is not part of 1.13.0. It is backwards compatible such that a simple text input is displayed on older versions of the UI.

## Bug Fixes

* Downgrade to Kubernernetes 1.14.1 to mitigate https://github.com/kubernetes/kubernetes/issues/78308.
* Correctly configure TLS for the Kubernetes API server to work with intermediate CA certificates.

## Documentation

## Known Issues

Known issues and limitations are listed in the [Limitations](/services/kubernetes/2.3.2-1.14.1/limitations/) page.

## Changelog

See [Changelog](/services/kubernetes/2.3.2-1.14.1/changelog) for a list of all changes.
