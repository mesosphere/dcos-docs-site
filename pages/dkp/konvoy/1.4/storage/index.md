---
layout: layout.pug
navigationTitle: Storage
title: Konvoy Kubernetes Storage
menuWeight: 9
excerpt: Manage storage options including local and mounted persistent volumes
---

A workload on Kubernetes typically requires two types of storage:

-   Ephemeral Storage

-   Persistent Volume Storage

## Ephemeral storage

Ephemeral storage, by its name, is ephemeral in the sense that it is cleaned up when the workload is deleted or the container crashes. For example, the following are examples of ephemeral storage provided by Kubernetes:

<table>
  <tr>
   <td>EmptyDir volume.
   </td>
   <td>Managed by kubelet under /var/lib/kubelet.
   </td>
  </tr>
  <tr>
   <td>Container logs.
   </td>
   <td>Typically under /var/logs/containers.
   </td>
  </tr>
  <tr>
   <td>Container image layers.
   </td>
   <td>Managed by container runtime (e.g., under /var/lib/containerd).
   </td>
  </tr>
  <tr>
   <td>Container writable layers.
   </td>
   <td>Managed by container runtime (e.g., under /var/lib/containerd).
   </td>
  </tr>
</table>

Ephemeral storage is automatically managed by Kubernetes, and typically does not require explicit settings. You may need to express the capacity requests for ephemeral storage so that `kubelet` can use that information to make sure it does not run out of ephemeral storage space on each node.

## Persistent Volume

Persistent Volumes are storage resources that can be used by the cluster. Persistent Volumes are volume plug-ins that have lifecycle capabilities that are independent of any Kubernetes Pod or Deployment.  

You may have stateful workloads requiring persistent storage whose lifecycle is longer than that of Pods or containers. For instance, a database server needs to recover database files after it crashes. For those cases, the workloads need to use PersistentVolumes (PV).

Persistent Volumes are resources that represent storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes. Unlike ephemeral storage, the lifecycle of a PersistentVolume is independent of that of the workload that uses it.

The Persistent Volume API objects capture the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.  In order to use a Persistent Volume, your application needs to invoke a Persistent Volume Claim.

### Create a Persistent Volume

Create a Persistent Volume using NFS as an example.  

**Requirements: This procedure assumes you have access to an [NFS shared storage](https://en.wikipedia.org/wiki/Network_File_System) in your environment and accessible to your cluster.**

<p class="message--note"><strong>NOTE: </strong>Before you copy and paste this into your file, here are some parameters that you must change for your environment.</p>

-   name: The name of the persistent volume you want.

-   server: Your FQDN server name or IP of NFS Server.

-   path: Path to your NFS server volume.

1.  Create a file called `nfs-share.yaml`.

    ```yaml
    apiVersion: v1
    kind: PersistentVolume
    metadata:
      name: nfs-share
      namespace: default
      labels:
            storage: nfs
    spec:
      capacity:
            storage: 5Gi
      accessModes:
            - ReadWriteMany
      persistentVolumeReclaimPolicy: Retain
      nfs:
            server: 192.168.86.252
            path: /volume1/nfs-01/nfs-share  
    ```  

1.  Apply the file to create an NFS Persistent Volume (PV).

    ```shell
    kubectl apply -f nfs-share.yaml
    ```

     Once that is deployed, validate that the status is available. You should receive a return value of `persistentvolume/nfs-share created.`

1.  Validate that the Persistent Volume (PV) is available.

    ```shell
    kubectl get pv nfs-share
    ```

    This is the output that shows that the cluster has accepted your Persistent Volume and is in **status available**:

    ```shell
    NAME    CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS  CLAIM   STORAGECLASS   REASON   AGE
    nfs-share   5Gi           RWX                  Retain                    Bound
    ```

    Your Persistent Volume is now available for consumption.  Next, create a [Persistent Volume Claim](#persistent-volume-claim) so your Pod can use the storage.

## Persistent Volume Claim

A PersistentVolumeClaim is a request for storage. For a workload that requires persistent volumes, the workload should use PersistentVolumeClaim (PVC) to express its request on persistent storage. A PersistentVolumeClaim can request specific size and [Access Modes](https://v1-17.docs.kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) (for example, they can be mounted once read/write or many times read-only).

Any workload can specify a PersistentVolumeClaim. For example, a Pod may need a volume that is at least 4Gi large or a volume mounted under `/data` in the container's filesystem. If there is a PersistentVolume (PV) that satisfies the specified requirements in the PersistentVolumeClaim (PVC), it will be bound to the PVC before the Pod starts.

### Create a Persistent Volume Claim to be used with your Pod

Create a PersistentVolumeClaim (PVC) and leverage the existing PersistentVolume (PV) that was created in the previous example under Persistent Volumes. Remember that a Pod must use the PVC to invoke the use of a PV.

**Requirements: This assumes you created a Persistent Volume as outlined in the Persistent Volume section.**

<p class="message--note"><strong>NOTE: </strong>Before copying and pasting this into your file, change these parameters for your environment.</p>

-   name: The name of the persistent volume claim you want.

-   storage: The size of your storage claim.  This must not exceed the persistent volume capacity. In the example above for Persistent Volume we used 5Gi.  

-   matchLabels: This must match the Persistent Volume `labels:` in the (PV)

1.  Create a file called `nfs-share.yaml`.

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: nfs-share
      namespace: default
    spec:
      accessModes:
           - ReadWriteMany
      resources:
           requests:
           storage: 5Gi
      storageClassName: ""
      selector:
           matchLabels:
           storage: "nfs"
    ```

1.  After configuration, invoke the NFS Volume as a Persistent Volume Claim (PVC).

    ```yaml
    kubectl apply -f nfs-share.yaml
    ```

1.  After applying the file, validate the status of the PVC:

    ```yaml
    kubectl get pv nfs-share
    ```

    You should receive a return value of `persistentvolumeclaim/nfs-share created`. After that is deployed, validate that the status is `Pending`.  You should receive a return value of `persistentvolume/nfs-share created`.

### Configure your Workload to use the Persistent Volume Claim

Your Persistent Volume Claim is `Pending` because no workload has claimed it.  Next, create an example workload that will claim and use the Persistent Volume Claim (PVC).  We will also validate that the workload can access the volume.

1.  Create a file called `nfs-app.yaml`.

    <p class="message--note"><strong>NOTE: </strong>Before you copy and paste this into your file, you must change this parameter for your environment.</p>

    - mountPath: This is the path in the container that will map to your NFS Share.  You can change this to any path you want in your container.

    ```yaml
    kind: Pod
    apiVersion: v1
    metadata:
      name: pod-nfs
    spec:
      containers:
           - name: nfs-app
           image: alpine
           volumeMounts:
           - name: data
           mountPath: /var/nfs          command: ["/bin/sh"]
           args: ["-c", "sleep 500000"]
      volumes:
      - name: data
           persistentVolumeClaim:
           claimName: nfs-pvc
    ```

1.  Next apply the file.

    ```yaml
    kubectl apply -f nfs-app.yaml
    ```

    After the file is deployed, you should receive a return value of `pod/pod-nfs created`.

1.  Enter the following command to ensure that it is fully deployed.

    ```shell
     kubectl get pod pod-nfs
    ```

    When the container is fully running and the `READY STATUS` is `Running`, you should see output similar to the following:

    ```shell
    NAME        READY  STATUS RESTARTS AGE
    pod-nfs 1/1 Running 0     2m27s
    ```

1.  Use the following command to validate that the Persistent Volume Claim (PVC) has mounted the volume to your container `pod-nfs`:

    ```shell
    kubectl describe pod pod-nfs
    ```

    Here you can see under the [describe](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe) conditions that the Persistent Volume Claim has been mounted to your container under the `ClaimName: nfs-pvc` which is the (PVC).

    ```yaml
    Volumes:
      data:
           Type: PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
           ClaimName:  nfs-pvc
           ReadOnly:   false
    ```

1.  Enter the this command to validate that inside the container we can access the volume and write data:

    ```yaml
    kubectl exec -it pod-nfs sh
    ```

1.  This is where the `mountPath: /var/nfs` was labeled in the `pod-nfs.yaml`.  If you change the value `cd to your path`.

    ```yaml
    cd /var/nfs
    ```

    If you were able to access your `mountPath` you have successfully mounted the NFS volume to your container. Now try and write a file into the volume.

1.  Enter this command to create a file in the directory and list all files in that same directory.

    ```yaml
    touch nfs.txt

    ls
    ```

   You should see a file called `nfs.txt`. If you do, you have a fully functional NFS volume accessible to your container.

<p class="message--note"><strong>NOTE: </strong>If you receive a permission denied error, check with your storage administrator to ensure you have write access to the NFS volume.</p>

## Storage Classes

Container Storage Interface (CSI)

<table>
  <tr>
   <td>Storage Method
   </td>
   <td>Persistent Volume
   </td>
   <td>Persistent Volume Claim
   </td>
  </tr>
  <tr>
   <td>NFS
   </td>
   <td>Create NFS PV
   </td>
   <td>Create NFS PVC
   </td>
  </tr>
  <tr>
   <td>Open-ebs
   </td>
   <td>Create open-ebs PV
   </td>
   <td>Create open-ebs PVC
   </td>
  </tr>
</table>
