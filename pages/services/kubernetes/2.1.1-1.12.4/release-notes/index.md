---
layout: layout.pug
navigationTitle: Release Notes
title: Release Notes
menuWeight: 10
excerpt: Release notes for DC/OS Kubernetes version 2.1.1-1.12.4
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Version 2.1.1-1.12.4

## Breaking Changes from 1.x

* DC/OS Kubernetes `2.1.1-1.12.4` requires DC/OS 1.12.
* DC/OS Kubernetes `2.1.1-1.12.4` introduces breaking changes to the way the package works and is deployed.
  Therefore, it is not possible to upgrade an existing installation of DC/OS Kubernetes to `2.1.1-1.12.4`.
* Before installing `kubernetes-cluster` package `2.1.1-1.12.4`, the `kubernetes` package must be [installed and running](/services/kubernetes/2.1.1-1.12.4/getting-started/installing-mke/).
* It is no longer possible to install DC/OS Kubernetes on DC/OS Enterprise without specifying a [service account](/1.12/security/ent/service-auth/) and a service account secret with adequate [permissions](/1.12/security/ent/perms-reference/).
* Package options have been renamed and re-organized.
  * `node_placement` renamed to `private_node_placement`
  * `reserved_resources` renamed to `private_reserved_resources`
  * `control_plane_reserved_resources` contains the combined resources from previous `1.x` options `apiserver`, `controller_manager` and `scheduler` and `2.0.0-1.12.0-beta` options `control_plane_cpus`, `control_plane_mem` and `control_plane_disk` were moved to under this group.

## Improvements

* Kubernetes v1.12.4
* Kubernetes Dashboard v1.10.1
* dcos-commons v0.55.0.
* CoreDNS v1.2.6.
* Calico v3.2.4.
* Enable `--peer-client-cert-auth` for `etcd`. When set, etcd will check all incoming peer requests from the cluster for valid client certificates signed by the supplied CA.
* Add the new flag `--force` in the `cluster update` command to force the update of the cluster configuration.
* Move the validation of the service configuration to the Mesosphere Kubernetes Engine.
* Enable `--aws-session-token` for `cluster backup` and `cluster restore` commands. The AWS session token can now be used as part of the AWS credentials.
* Support relative paths in `--path-to-custom-ca` for `cluster kubeconfig` command, e.g. `--path-to-custom-ca=./my-custom-ca.pem`.
* Documentation section on how to [upgrade](/services/kubernetes/2.1.1-1.12.4/operations/upgrade/#Mesosphere-Kubernetes-Engine) the `kubernetes` package.
* Enable the selection of the desired region where to deploy the Kubernetes cluster.
* Increase the number of retries an etcd task will perform during installation to resolve its own DNS name. This should prevent etcd tasks from getting stuck in a retry loop on larger clusters.

## Bug Fixes

* Fixed a bug that might cause `kube-node` and `kube-node-public` tasks to freeze in the `STARTED` state, causing installations or upgrades to stop indefinitely.
* Fixed a bug that could forever fail to run public Kubernetes node tasks.
* Fixed a bug affecting node decommission that could cause Kubernetes apps temporary downtime.
* Fixed a bug affecting use of private Docker registries.
* Fixed a bug that might cause segfault when running `dcos kubernetes cluster kubeconfig`

## Documentation

* Add an [Overview](/services/kubernetes/2.1.1-1.12.4/overview/) page explaining in detail what changed since the 1.x series of releases.
* Add a [CLI](/services/kubernetes/2.1.1-1.12.4/cli/) page detailing the new Mesosphere Kubernetes Engine CLI.
* Merged `Advanced Installation` page merging its content into [Customizing your Installation](/services/kubernetes/2.1.1-1.12.4/operations/customizing-install/).
* Add a [Private Docker Registry](/services/kubernetes/2.1.1-1.12.4/operations/private-docker-registry/) page explaining how to configure it.

## Known Issues

Known issues and limitations are listed in the [Limitations](/services/kubernetes/2.1.1-1.12.4/limitations/) page.
