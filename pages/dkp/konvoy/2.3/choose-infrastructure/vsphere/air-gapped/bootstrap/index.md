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

Before you perform this procedure, ensure that you have [created a CAPI VM template][create-capi-image]

## Bootstrap a kind cluster and CAPI controllers

DKP Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster, after which the workload cluster manages its own lifecycle.

1.  Copy the image tar file to the machine where you want to run the bootstrap cluster.

1.  Load the bootstrap Docker image. The image version should correspond to the version of Konvoy as returned by `dkp version`:

    ```bash
    docker load -i <path to mesosphere/konvoy-bootstrap image>
    ```

1.  Create a bootstrap cluster with the command:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    The output resembles this example:

    ```
    ✓ Creating a bootstrap cluster
    ✓ Initializing new CAPI components
    ```

1.  Ensure that the CAPV controllers are present with the command:

    ```bash
    kubectl get pods -n capv-system
    ```

    The output resembles the following:

    ```sh
    NAME                                      READY   STATUS    RESTARTS   AGE
    capv-controller-manager-785c5978f-nnfns   1/1     Running   0          13h
    ```

1.  Refresh the credentials used by the vSphere provider at any time, using the command:

    ```bash
    dkp update bootstrap credentials vsphere
    ```

Next, you can create a [new vSphere Kubernetes cluster][new-cluster].

[prereqs]: ../../prerequisites/
[new-cluster]: ../new
[create-capi-image]: ../create-capi-vm-image/
