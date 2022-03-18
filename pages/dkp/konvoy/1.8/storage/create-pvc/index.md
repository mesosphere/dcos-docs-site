---
layout: layout.pug
navigationTitle: Create a Kubernetes PVC to access NFS shared storage
title: Create a Kubernetes Persistent Volume Claim
menuWeight: 11
excerpt: How to create a Kubernetes Persistent Volume Claim to access your NFS shared storage
beta: false
enterprise: false
---

<!-- markdownlint-disable MD030 -->

This procedure shows how to create a Persistent Volume Claim (PVC) in your Kubernetes cluster to access your NFS shared storage.

## Before you begin

This procedure requires the following items and configurations:

- Kubernetes version 1.15.x or higher

- Konvoy version 1.4.x or higher

- Valid Persistent Volume [installed](../create-pv)

## Create a Persistent Volume Claim

Create a Persistent Volume Claim to access your NFS share storage.

1.  Create a file called `nfs-share.yaml` similar to the example below.

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: nfs-share # The name of this Persistent Volume Claim
      namespace: default
    spec:
      accessModes:
        - ReadWriteMany
      resources:
        requests:
          storage: 5Gi # The size of the storage claim.
      storageClassName: ""
      selector:
        matchLabels:
          storage: "nfs" # The volume must have this label with this value.
    ```

    - Determine a `name` for the Persistent Volume Claim you want to create.

    - Determine a `size` for your storage claim, but it must not exceed the Persistent Volume capacity. In the [example](../create-pv), the Persistent Volume we use has 5Gi.

    - Configure the `matchLabels` field, it must contain the labels of the Persistent Volume.

1.  After configuration, apply the PVC to request the NFS Volume.

    ```bash
    kubectl apply -f nfs-share.yaml
    ```

1.  You should receive a return value of `persistentvolumeclaim/nfs-share created`. After the PVC is deployed, validate the status is `Pending`.

    ```bash
    kubectl get pv nfs-share
    ```

Your Persistent Volume Claim is `Pending` because no workload has claimed it.

## Related Information

For information on related topics or procedures, refer to the following:

- [Kubernetes Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
- [Creating a PersistentVolumeClaim](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-persistentvolumeclaim)
