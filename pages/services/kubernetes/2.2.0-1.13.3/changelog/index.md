---
layout: layout.pug
navigationTitle: Changelog
title: Changelog
menuWeight: 75
excerpt: Changelog for DC/OS Kubernetes
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

## Version 2.2.0-1.13.3

### Changelog since 2.1.1-1.12.5

#### Improvements

* Kubernetes v1.13.3
* dcos-commons v0.55.2
* CoreDNS v1.3.1
* Enable CSI features required for CSI integration.
* Automate the task replacement when a DC/OS agent is decommissioned.
* Allow changing automated DC/OS proxy configuration into Kubernetes cluster tasks.

#### Bug Fixes

* Fix a bug where providing `--aws-session-token` for `cluster backup` and `cluster restore` commands did not actually work.
* Fix a bug affecting clusters in which the Kubernetes service CIDR or Calico network CIDR overlapped with Docker's default bridge network by disabling the bridge.

#### Documentation

* Add a [Storage](/services/kubernetes/2.2.0-1.13.3/operations/storage/) page documenting Container Storage Interface (CSI).

---
## Version 2.1.1-1.12.5

### Changelog since 2.1.0-1.12.3

#### Improvements

* dcos-commons v0.55.0
* Kubernetes v1.12.5
* Docker v18.09.1
* Kubernetes Dashboard v1.10.1
* Enable local-dns-dispatcher in control plane tasks.

#### Bug Fixes

* Fix a bug that might cause pods that have [resource limits crash](https://github.com/kubernetes/kubernetes/issues/61937) on RHEL based systems. The issue is related to Linux kmem accounting turned-on by default by runc. We now turn-off kmem accounting on RHEL-based systems, and on these systems alone. No user intervention is needed, however all of Kubernetes cluster tasks will be replaced, which may cause some downtime.

---
## Version 2.1.0-1.12.3

### Changelog since 2.0.1-1.12.2

#### Improvements

* dcos-commons v0.54.3
* Kubernetes v1.12.3
* CoreDNS v1.2.6
* Calico v3.2.4
* Enable `--peer-client-cert-auth` for `etcd`. When set, etcd will check all incoming peer requests from the cluster for valid client certificates signed by the supplied CA.
* Enable the selection of the desired region where to deploy the Kubernetes cluster.
* Add the new flag `--force` in the `cluster update` command to force the update of the cluster configuration.
* Support relative paths in `--path-to-custom-ca` for `cluster kubeconfig` command, e.g. `--path-to-custom-ca=./my-custom-ca.pem`.
* Move the validation of the service configuration to the Mesosphere Kubernetes Engine.
* Enable `--aws-session-token` for `cluster backup` and `cluster restore` commands. The AWS session token can now be used as part of the AWS credentials.
* Increase the number of retries an etcd task will perform during installation to resolve its own DNS name. This should prevent etcd tasks from getting stuck in a retry loop on larger clusters.

#### Bug Fixes

* Fix a bug that might cause segfault when running `dcos kubernetes cluster kubeconfig`.

#### Documentation

* Documentation section on how to [upgrade](/services/kubernetes/2.2.0-1.13.3/operations/upgrade/#Mesosphere-Kubernetes-Engine) the `kubernetes` package.

---
## Version 2.0.1-1.12.2

### Changelog since 2.0.0-1.12.1

#### Improvements

* dcos-commons v0.54.2.
* Kubernetes v1.12.2

#### Bug Fixes

* Fix a bug affecting use of private Docker registries.

#### Documentation

* * Add a [Private Docker Registry](../operations/private-docker-registry) page explaining how to configure it.

---
## Version 2.0.0-1.12.1

### Changelog since 1.x

#### Improvements

* Kubernetes v1.12.1 and other components' [version changes](/services/kubernetes/2.0.0-1.12.1/supported-versions#supported-and-bundled-versions).
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

#### Bug Fixes

* Fix a bug that might cause `kube-node` and `kube-node-public` tasks to freeze in the `STARTED` state, causing installations or upgrades to stop indefinitely.
* Fix a bug that could forever fail to run public Kubernetes node tasks.
* Fix a bug affecting node decommission that could cause Kubernetes apps temporary downtime.

#### Documentation

* Add an [Overview](/services/kubernetes/2.2.0-1.13.3/overview/) page explaining in detail what changed since the 1.x series of releases.
* Add a [CLI](/services/kubernetes/2.2.0-1.13.3/cli/) page detailing the new Mesosphere Kubernetes Engine CLI.
* Merge `Advanced Installation` page merging its content into [Customizing your Installation](/services/kubernetes/2.2.0-1.13.3/operations/customizing-install/).
* Add a [Private Docker Registry](/services/kubernetes/2.2.0-1.13.3/operations/private-docker-registry/) page explaining how to configure it.
