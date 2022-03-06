---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your machine and environment to run DKP
enterprise: false
---

## DKP&reg; Prerequisites

Before you begin using DKP, you must have:

- An x86_64-based Linux&reg; or macOS&reg; machine.
- The `dkp` binary for Linux, or macOS.
- [Docker&reg;][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid VMware vSphere&reg; account with _%%% link here_ credentials configured.

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

## vSphere Prerequisites

Before installing, verify that your VMware vSphere environment meets the following basic requirements:

* vCenter&reg; version v6.7.x with Update 3

  vCenter provides the vSphere APIs that Konvoy uses to create the cluster VMs. You must be able to reach the API endpoint from where the Konvoy command line interface (CLI) runs.

* vSphere account with [credentials configured][credentials_configured]

  DKP uses the account to access vCenter APIs. This account must have administrator privileges.

* [govc][install_govc] command-line utility

   This guide shows how to use the govc CLI to create vSphere roles that are used by the Kubernetes cluster components.

- [Docker][install_docker] version 18.09.2 or later

  You must have Docker installed on the host where the Konvoy CLI runs. For example, if you are installing Konvoy on your laptop, ensure the laptop has a supported version of Docker.

- [kubectl][install_kubectl] v1.20.6 or later

  To enable interaction with the running cluster, you must have `kubectl` installed on the host where the Konvoy command line interface (CLI) runs.

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[iampolicies]: ../../iam-policies
