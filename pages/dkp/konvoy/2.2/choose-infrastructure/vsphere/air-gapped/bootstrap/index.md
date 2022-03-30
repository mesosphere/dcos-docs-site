---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 30
excerpt: Bootstrap a kind cluster
beta: false
enterprise: false
---

## Prerequisites

Before you perform this procedure, ensure that you have [created a CAPI VM template][create-capi-vm]

## Bootstrap a kind cluster and CAPI controllers

DKP Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, after which the workload cluster manages its own lifecycle.

1.  Copy the image tar file to the machine where you want to run the bootstrap cluster.

1.  Load the bootstrap Docker image. The image version should correspond to the version of Konvoy as returned by `dkp version`:

    ```bash
    docker load -i <path to mesosphere/konvoy-bootstrap image>
    ```

1.  Create a bootstrap cluster with the command:

    ```bash
    ./dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

1.  Refresh the credentials used by the vSphere provider at any time, using the command:

    ```bash
    ./dkp update bootstrap credentials vsphere
    ```

Next, you can create a [new vSphere Kubernetes cluster][new-cluster].

[prereqs]: ../../prerequisites/
[create-bastion-vm]: ../create-capi-vm-image/
[new-cluster]: ../new
