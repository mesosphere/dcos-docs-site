---
layout: layout.pug
navigationTitle: Configure a Pod to access NFS Share
title: Configure a Workload to use a Persistent Volume Claim
menuWeight: 12
excerpt: Configure a Workload to use a Persistent Volume Claim to access your NFS shared storage
beta: false
enterprise: false
---

<!-- markdownlint-disable MD030 -->

This procedure shows how to configure a Workload to use a Persistent Volume Claim (PVC) to access your NFS shared storage.

## Before you begin

The following items and configurations are required for this procedure:

- Kubernetes version 1.15.x or higher

- Konvoy version 1.4.x or higher

- [NFS shared storage](https://en.wikipedia.org/wiki/Network_File_System) in your environment and accessible to your cluster

- Valid Persistent Volume [installed](../create-pv)

- Persistent Volume Claim [installed](../create-pvc) and in the pending state

## Create a Pod that uses a Persistent Volume Claim

If a workload does not claim a Persistent Volume Claim it stays in a `Pending` state. This procedure shows how to create an example workload that claims and uses the Persistent Volume Claim (PVC).  This procedure also validates that the workload can access the volume.

1.  Create a file called `nfs-app.yaml`, similar to the example below.

    ```yaml
    kind: Pod
    apiVersion: v1
    metadata:
      name: pod-nfs
    spec:
      containers:
        - name: nfs-app
          image: alpine
          volumeMounts: null
        - name: data
          mountPath: /var/nfs # The path in you container where the NFS shared volume is available.
          command:
            - /bin/sh
          args:
            - '-c'
            - sleep 500000
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: nfs-pvc # The name of the PVC you want to use in this pod.
    ```

    - Configure the `mountPath` with the path in the container that maps to your NFS Share. You can change this to any path in your container.

    - Configure the `claimName` with the name of the Persistent Volume Claim you want to use.

1.  Next, apply the file.

    ```shell
    kubectl apply -f nfs-app.yaml
    ```

    After the file is deployed, you should receive a return value of `pod/pod-nfs created`.

1.  Ensure that it is fully deployed.

    ```shell
     kubectl get pod pod-nfs
    ```

    When the container is fully running and the `READY STATUS` is `Running`, you should see output similar to the following:

    ```shell
    NAME        READY  STATUS RESTARTS AGE
    pod-nfs 1/1 Running 0     2m27s
    ```

1.  Use the following command to validate that the PVC has mounted the volume to your container `pod-nfs`:

    ```shell
    kubectl describe pod pod-nfs
    ```

    You can see under the [describe](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) conditions that the Persistent Volume Claim has been mounted to your container under the `ClaimName: nfs-pvc` which is the PVC.

    ```yaml
    Volumes: null
    data:
      Type: >-
        PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same
        namespace)
      ClaimName: nfs-pvc
      ReadOnly: false
    ```

1.  Enter the following command to validate that, inside the container, we can access the volume and write data:

    ```shell
    kubectl exec -it pod-nfs sh
    ```

1.  This is where the `mountPath: /var/nfs` was labeled in the `pod-nfs.yaml`.  If you change the value, `cd to your path`.

    ```shell
    cd /var/nfs
    ```

    If you can access your `mountPath`, you have successfully mounted the NFS volume to your container. Now try and write a file into the volume.

1.  Enter the following command to create a file in the directory and list all files in that same directory.

    ```shell
    touch nfs.txt && ls
    ```

   You should see a file called `nfs.txt`. If you do, you have a fully functional NFS volume accessible to your container.

<p class="message--note"><strong>NOTE: </strong>If you receive a permission denied error, check with your storage administrator to ensure you have write access to the NFS volume.</p>

## Related Information

For information on related topics or procedures, refer to the following:

- [Kubernetes Persistent Volume Claims](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
- [Creating a Pod to use a PVC](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/#create-a-pod)
