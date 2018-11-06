---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 1
excerpt: Release notes for DC/OS Kubernetes version 2.0.1-1.12.2
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.0.1-1.12.2

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.0.1-1.12.2` requires DC/OS 1.12.
* DC/OS Kubernetes `2.0.1-1.12.2` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes to `2.0.1-1.12.2`.
* Before installing `kubernetes-cluster` package `2.0.1-1.12.2`, the `kubernetes` package must be [installed and running](../install-and-customize).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes v1.12.2 and other components' [version changes](../supported-versions#supported-and-bundled-versions).
* Enable high density deployments of multiple Kubernetes clusters on DC/OS.
* Replace `kube-apiserver`, `kube-controller-manager` and `kube-scheduler` tasks with static pods in a new task `kube-control-plane`.
* Replace `kube-proxy` and `coredns` tasks with static pods, and rename `coredns` to `local-dns-dispatcher`.
* Replace cluster DNS `kube-dns` deployment with `coredns` and prevent co-location of these pods.
* Add the `priorityClassName` field to critical system pods.
* The Kubernetes Dashboard is now secured using HTTPS and will now show the [login view](https://github.com/kubernetes/dashboard/wiki/Access-control#login-view) when accessed.
* Use a dedicated RBAC role for the `kubelet-resource-watchdog`.
* Add options to enable [Calico's Typha](https://github.com/projectcalico/typha).
* Public Kubernetes nodes now reserve ports `80` and `443` of the underlying public DC/OS agent to help prevent issues with port binding, and to making them available for [Ingress](../ingress).
* Installation and package options upgrades are now faster.
* Scaling up a cluster is now performed in parallel and therefore faster. Scaling down a cluster is still performed serially to ensure workload stability while decommissioning Kubernetes nodes.
* dcos-commons v0.54.2.

## Bug Fixes

* Fixed a bug that might cause `kube-node` and `kube-node-public` tasks to freeze in the `STARTED` state, causing installations or upgrades to stop indefinitely.
* Fixed a bug that could forever fail to run public Kubernetes node tasks.
* Fixed a bug affecting node decommission that could cause Kubernetes apps temporary downtime.
* Fixed a bug affecting use of private Docker registries.

## Documentation

* Add an [Overview](../overview) page explaining in detail what changed since the 1.x series of releases.
* Add a [CLI](../CLI) page detailing the new Mesosphere Kubernetes Engine CLI.
* Merged `Advanced Installation` page merging its content into [Install and Customize](../install-and-customize).
* Add a [Private Docker Registry](../operations/private-docker-registry) page explaining how to configure it.

## Known Issues

Known issues and limitations are listed in the [Limitations](../limitations) page.
