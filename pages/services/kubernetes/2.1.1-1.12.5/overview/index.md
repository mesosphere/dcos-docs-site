---
layout: layout.pug
navigationTitle: Overview
title: Overview
menuWeight: 20
excerpt: What's new in DC/OS Kubernetes 2.1.1-1.12.5
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

When compared with previous versions, DC/OS Kubernetes 2.1.1-1.12.5 brings in a number of important improvements to how Kubernetes clusters are managed, as well as to how they operate.

# High-Density Multi-Kubernetes

The most notable change in the new release is that it is now possible to install multiple Kubernetes clusters side-by-side on the same DC/OS cluster.
It is also now possible to run multiple **private** Kubernetes nodes on the same private DC/OS agent, regardless of whether they belong to the same or to different Kubernetes clusters.
This change makes it possible, for example, to run multiple development clusters side-by-side on the same DC/OS cluster, reducing costs and management overhead.

# Revamped CLI

Accompanying the abovementioned change is a brand new command-line interface (CLI) that allows for easy management and inspection of Kubernetes clusters.

Creating a new Kubernetes cluster can now be done using the following command:

```shell
$ dcos kubernetes cluster create --options options.json
Kubernetes cluster '[dev/kubernetes01]' is being created
```

Listing existing Kubernetes clusters is also very intuitive:
```bash
dcos kubernetes cluster update --cluster-name dev/kubernetes01 --options options.json
```

```shell
$ dcos kubernetes cluster list
        NAME        KUBERNETES VERSION  PACKAGE VERSION
  dev/kubernetes01  v1.12.5             stub-universe
  dev/kubernetes02  v1.12.5             stub-universe
```

As another example, updating a Kubernetes cluster can be done via the CLI by specifying its name as a flag:

```bash
dcos kubernetes cluster update --cluster-name dev/kubernetes01 --options options.json
```

```bash
$ dcos kubernetes cluster update --cluster-name dev/kubernetes01 --options options.json
  Using Kubernetes cluster: dev/kubernetes01
  2018/10/17 17:20:10 starting update process...
```

The new CLI features a number of other useful commands, which can be listed by running:

```bash
dcos kubernetes --help
```

See the [CLI](/services/kubernetes/2.1.1-1.12.5/cli/) section for documentation on the new CLI.

# Cluster Manager

To make management of multiple Kubernetes clusters on the same DC/OS cluster a reality, a custom cluster manager was introduced.
As a result of its introduction, the old `kubernetes` package has been re-purposed and split into two different packages:

* The `kubernetes` package now represents the cluster manager. Installing this package is **required** to create Kubernetes clusters, and it can only be installed once.
* The `kubernetes-cluster` package has been introduced in order to represent a single, atomic Kubernetes cluster. It roughly corresponds to the `kubernetes` package available in DC/OS 1.11, and can now be installed multiple times.

# Control-Plane Nodes

Each Kubernetes cluster can be installed with one control-plane node or in HA mode with three nodes.
These nodes take the place of the old `kube-apiserver`, `kube-controller-manager` and `kube-scheduler` tasks, being that each one of these Kubernetes components now runs as a [static pod](https://kubernetes.io/docs/tasks/administer-cluster/static-pod/).
Control-plane nodes are labeled with `node-role.kubernetes.io/master`, being tainted with a similar key so that no pods are scheduled onto them.

# Networking

In order to make it possible to run multiple private Kubernetes nodes on the same private DC/OS agent, some changes to networking were required.
The `etcd` members, control-plane nodes and private Kubernetes nodes leverage [DC/OS virtual networking](/1.12/networking/SDN/) and each have their own IP address in the DC/OS cluster.
Kubernetes cluster pod networking and policy are now powered by [Calico](https://github.com/projectcalico/calico/).

# Community
Get help and connect with other users on the [mailing list](https://groups.google.com/a/dcos.io/forum/#!forum/kubernetes) or on DC/OS community [Slack](http://chat.dcos.io/) in the #kubernetes channel.
