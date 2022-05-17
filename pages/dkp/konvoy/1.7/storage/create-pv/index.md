---
layout: layout.pug
navigationTitle: Create a Kubernetes PV to access NFS shared storage
title: Create a Kubernetes Persistent Volume
menuWeight: 10
excerpt: How to create a Kubernetes Persistent Volume to access your NFS shared storage
beta: false
enterprise: false
---

<!-- markdownlint-disable MD030 -->

This procedure shows how to create a Persistent Volume (PV) in your Kubernetes cluster to access your NFS shared storage.

## Before you begin

This procedure requires the following items and configurations:

- Kubernetes version 1.15.x or higher

- Konvoy version 1.4.x or higher

- [NFS shared storage](https://en.wikipedia.org/wiki/Network_File_System) in your environment and accessible to your cluster

## Create a Persistent Volume

Create a Persistent Volume using NFS as an example.

1.  Create a file called `nfs-share.yaml`, similar to the example below.

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: nfs-share # The name of your persistent volume.
      namespace: default
      labels:
        storage: nfs # The labels used when matching with a Persistent Volume Claim.
    spec:
      capacity:
        storage: 5Gi
      accessModes:
        - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain
      nfs:
        server: 192.168.86.252 # The FQDN server name or IP of the NFS server goes here.
        path: /volume1/nfs-01/nfs-share # The path to your NFS server volume.
    ```

    - Choose a `name` for the persistent volume you want to create. In this example it is `nfs-share`.

    - Select the appropriate labels.

    - Enter the FQDN server name or IP address of the NFS server. In this example it is `192.168.86.252`.

    - Enter the path to your NFS server volume. In this example it is `/volume1/nfs-01/nfs-share`.

1.  Apply the file to create an NFS Persistent Volume (PV).

    ```bash
    kubectl apply -f nfs-share.yaml
    ```

     After that is deployed, validate that the status is available. You should receive a return value of `persistentvolume/nfs-share created.`

1.  Validate the PV is available.

    ```bash
    kubectl get pv nfs-share
    ```

    Output, similar to this below, shows that the cluster has accepted your Persistent Volume and is in **status available**:

    ```sh
    NAME        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS  CLAIM   STORAGECLASS   REASON   AGE
    nfs-share   5Gi        RWX            Retain           Bound
    ```

    Your Persistent Volume is now available for use. Next, create a [Persistent Volume Claim](../create-pvc) so your Pod can use the storage.

## Related Information

For information on related topics or procedures, refer to the following:

- [Kubernetes Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Configure a Pod to Use a PersistentVolume for Storage](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/)
