---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for DC/OS Kubernetes version 2.4.6-1.15.6
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.4.6-1.15.6

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.4.6-1.15.6` requires DC/OS 1.12.
* DC/OS Kubernetes `2.4.6-1.15.6` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes 1.x to `2.4.6-1.15.6`.
* Before installing `kubernetes-cluster` package `2.4.6-1.15.6`, the `kubernetes` package must be [installed and running](/mesosphere/dcos/services/kubernetes/2.4.6-1.15.6/getting-started/installing-mke/).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/mesosphere/dcos/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/mesosphere/dcos/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes 1.15.6
* Calico 3.10.1
* CoreDNS v1.6.5
* Add option to enable AlwaysPullImages Kubernetes admission controller. See [Admission Controllers](/mesosphere/dcos/services/kubernetes/2.4.6-1.15.6/operations/admission-controllers/) for more details.
* Add option to enable Kubernetes secret encryption. See [Kubernetes secret encryption](/mesosphere/dcos/services/kubernetes/2.4.6-1.15.6/operations/encrypt-data) for more details.
* Update Debian base container images to version stable-20191118-slim.
* Remove timeout option from `dcos kubernetes cluster update` command. Now you need to check the status of deployment plan after initiating a package options update or a package version update. Use `dcos kubernetes cluster debug plan show deploy` to check when the update operation finished. This is in line with other DC/OS frameworks behavior.
* Add node controller from [calico/kube-controllers](https://docs.projectcalico.org/v3.10/reference/kube-controllers/configuration#the-calicokube-controllers-container) that watches for the removal of Kubernetes nodes and removes corresponding data from Calico.

## Bug Fixes

* Fix a bug where sometimes a Kubernetes pod is assigned an IP from a calico-node. Changes the default Calico CNI plugin from host-local to calico-ipam. When upgrading to this MKE version installing the mandatory-addons will take longer since it has to ensure Calico deployment finishes upgrading to calico-ipam before proceeding.

## Documentation

* Add instructions to install [Gatekeeper](/mesosphere/dcos/services/kubernetes/2.4.6-1.15.6/operations/gatekeeper) and how to use it as a replacement for Kubernetes PodSecurity policies.

## Known Issues

Known issues and limitations are listed in the [Limitations](/mesosphere/dcos/services/kubernetes/2.4.6-1.15.6/limitations/) page.

## Changelog

See [Changelog](/mesosphere/dcos/services/kubernetes/2.4.6-1.15.6/changelog) for a list of all changes.
