---
layout: layout.pug
navigationTitle: Use Portworx for persistent volumes
title: Use Portworx for persistent volumes
menuWeight: 23
excerpt: Learn how to use Portworx for persistent volume storage
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Portworx is a software-defined storage solution that provides high-availability persistent volume storage for containerized stateful applications running on Kubernetes clusters.

This tutorial demonstrates how to leverage Portworx to provide persistent volumes for applications running on a Konvoy cluster.

## Before you begin

Before starting this tutorial, you should verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings, see the [Quick start][quickstart].

## Set environment variables

1. Edit the `create-and-attach-volumes.sh` to update the following environment variables:

    ```bash
    export CLUSTER=konvoy_v0.0.187789
    export REGION=us-west-2
    ```

1. Execute the `create-and-attach-volumes.sh` script to create and attach an Amazon Elastic Block Storage (EBS) volume to each Kubelet.

## Deploy Portworx

Before you can use Portworx to provide persistent volume storage for pods running on your Kubernetes cluster, you must deploy it.

1. Deploy Portworx on the Kubernetes cluster by running the following command:

    ```bash
    kubectl apply -f portworx-manifests.yaml
    ```

1. Verify the list of pods available in the `kube-system` namespace by running the following command:

    ```bash
    kubectl --namespace kube-system get pods
    ```

## Create the storage class

1. Create the Kubernetes `StorageClass` by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    kind: StorageClass
    apiVersion: storage.k8s.io/v1beta1
    metadata:
    name: portworx-sc
    provisioner: kubernetes.io/portworx-volume
    parameters:
    repl: "2"
    EOF
    ```

    This command creates a volume on Portworx with two replicas.

1. Define the `StorageClass` you just created as the default storage class in your Kubernetes cluster by running the following command:

    ```bash
    kubectl patch storageclass portworx-sc -p "{\"metadata\": {\"annotations\":{\"storageclass.kubernetes.io/is-default-class\":\"true\"}}}"
    ```

1. Create the Kubernetes `PersistentVolumeClaim` by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    kind: PersistentVolumeClaim
    apiVersion: v1
    metadata:
    name: pvc001
    annotations:
        volume.beta.kubernetes.io/storage-class: portworx-sc
    spec:
    accessModes:
        - ReadWriteOnce
    resources:
        requests:
        storage: 1Gi
    EOF
    ```

1. Check the status of the `PersistentVolumeClaim` by running the following command:

    ```bash
    kubectl describe pvc pvc001
    ```

    The command displays output similar to the following:

    ```bash
    Name:          pvc001
    Namespace:     default
    StorageClass:  portworx-sc
    Status:        Bound
    Volume:        pvc-a38e5d2c-7df9-11e9-b547-0ac418899022
    Labels:        <none>
    Annotations:   pv.kubernetes.io/bind-completed: yes
                pv.kubernetes.io/bound-by-controller: yes
                volume.beta.kubernetes.io/storage-class: portworx-sc
                volume.beta.kubernetes.io/storage-provisioner: kubernetes.io/portworx-volume
    Finalizers:    [kubernetes.io/pvc-protection]
    Capacity:      1Gi
    Access Modes:  RWO
    VolumeMode:    Filesystem
    Events:
    Type       Reason                 Age   From                         Message
    ----       ------                 ----  ----                         -------
    Normal     ProvisioningSucceeded  12s   persistentvolume-controller  Successfully provisioned volume pvc-a38e5d2c-7df9-11e9-b547-0ac418899022 using kubernetes.io/portworx-volume
    Mounted By:  <none>
    ```

1. Create a Kubernetes pod that uses the `PersistentVolumeClaim` by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    apiVersion: v1
    kind: Pod
    metadata:
    name: pvpod
    spec:
    containers:
    - name: test-container
        image: alpine:latest
        command: [ "/bin/sh" ]
        args: [ "-c", "while true; do sleep 60;done" ]
        volumeMounts:
        - name: test-volume
        mountPath: /test-portworx-volume
    volumes:
    - name: test-volume
        persistentVolumeClaim:
        claimName: pvc001
    EOF
    ```

1. Create a file in the volume by running the following commands:

    ```bash
    kubectl exec -i pvpod -- /bin/sh -c "echo test > /test-portworx-volume/test"
    ```

## Verify persistence

1. Delete the pod you previously created by running the following command:

    ```bash
    kubectl delete pod pvpod
    ```

1. Create a new Kubernetes pod that will use the same `PersistentVolumeClaim` by running the following command:

    ```bash
    cat <<EOF | kubectl create -f -
    apiVersion: v1
    kind: Pod
    metadata:
    name: pvpod
    spec:
    containers:
    - name: test-container
        image: alpine:latest
        command: [ "/bin/sh" ]
        args: [ "-c", "while true; do sleep 60;done" ]
        volumeMounts:
        - name: test-volume
        mountPath: /test-portworx-volume
    volumes:
    - name: test-volume
        persistentVolumeClaim:
        claimName: pvc001
    EOF
    ```

1. Validate that the file created for the previous pod is still available by running the following command:

    ```bash
    kubectl exec -i pvpod cat /test-portworx-volume/test
    ```

[quickstart]:../../quick-start/
