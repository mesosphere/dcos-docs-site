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
    ./dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

    The output resembles this example:

    ```
    INFO[2022-03-30T15:52:42-07:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:151"
    INFO[2022-03-30T15:53:35-07:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:112"
    INFO[2022-03-30T15:54:22-07:00] Created bootstrap controllers                 src="bootstrap/controllers.go:125"
    INFO[2022-03-30T15:54:22-07:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:129"
    INFO[2022-03-30T15:54:22-07:00] Initializing Tigera operator                  src="bootstrap/clusterresourceset.go:38"
    INFO[2022-03-30T15:54:22-07:00] Created/Updated Tigera operator               src="bootstrap/clusterresourceset.go:43"
    INFO[2022-03-30T15:54:22-07:00] Initializing AWS EBS CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:96"
    INFO[2022-03-30T15:54:22-07:00] Created/Updated AWS EBS CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:101"
    INFO[2022-03-30T15:54:22-07:00] Initializing Azure Disk CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:103"
    INFO[2022-03-30T15:54:22-07:00] Created Azure Disk CustomResourceSet          src="bootstrap/clusterresourceset.go:108"
    INFO[2022-03-30T15:54:22-07:00] Initializing Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:110"
    INFO[2022-03-30T15:54:22-07:00] Created/Updated Local Volume Provisioner CustomResourceSet  src="bootstrap/clusterresourceset.go:115"
    INFO[2022-03-30T15:54:22-07:00] Initializing VSphere CSI CustomResourceSet    src="bootstrap/clusterresourceset.go:117"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated VSphere CSI CustomResourceSet  src="bootstrap/clusterresourceset.go:122"
    INFO[2022-03-30T15:54:23-07:00] Initializing Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:196"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated Cluster Autoscaler CustomResourceSet  src="bootstrap/clusterresourceset.go:201"
    INFO[2022-03-30T15:54:23-07:00] Initializing Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:254"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated Node Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:259"
    INFO[2022-03-30T15:54:23-07:00] Initializing NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:312"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated NVIDIA GPU Feature Discovery CustomResourceSet  src="bootstrap/clusterresourceset.go:317"
    INFO[2022-03-30T15:54:23-07:00] Initializing VSphere CPI CustomResourceSet    src="bootstrap/clusterresourceset.go:370"
    INFO[2022-03-30T15:54:23-07:00] Created/Updated VSphere CPI CustomResourceSet  src="bootstrap/clusterresourceset.go:375"
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
    ./dkp update bootstrap credentials vsphere
    ```

Next, you can create a [new vSphere Kubernetes cluster][new-cluster].

[prereqs]: ../../prerequisites/
[new-cluster]: ../new
[create-capi-image]: ../create-capi-vm-image/
