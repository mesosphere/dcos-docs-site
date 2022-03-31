---
layout: layout.pug
navigationTitle: Volume Cloning
title: Volume Cloning
menuWeight: 13
excerpt: Create a new Persistent Volume Claim by cloning an existing PVC
beta: false
enterprise: false
---

<!-- markdownlint-disable MD030 -->

This procedure shows how to clone an existing Persistent Volume Claim (PVC) using CSI Volume Cloning.

## Before you begin

The following items and configurations are required for this procedure:

- Kubernetes version 1.16.x or higher

- Konvoy version 1.4.x or higher

- [CSI driver](../intro-csi) that supports volume cloning

## Limitations

- Only CSI drivers support cloning

- Only some CSI drivers support cloning if underlying platform supports it

- Only the [Azure CSI Driver][azuredisk-csi-driver] in Konvoy supports cloning

- PVC can be cloned only if

    - Source and destination PVC are in the same Kubernetes namespace

    - Source and destination PVC are of the same [`storageclass`](../intro-csi)

    - Source and destination PVC use the same `VolumeMode`

## Create a source Persistent Volume Claim and write data

1. First, create a Persistent Volume Claim by creating a file called `original-pvc.yaml`.

    ```yaml
    ---
    kind: PersistentVolumeClaim
    apiVersion: v1
    metadata:
      name: original-pvc
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
      storageClassName: azurediskprovisioner
    ```

1. Apply the configuration to create the PVC.

    ```bash
    kubectl apply -f original-pvc.yaml
    ```

1. After the PVC is created, verify its status.

    ```bash
    kubectl describe pvc/original-pvc
    ```

    Check that the PVC was created and is in pending state:

    ```bash
    kubectl describe pvc/original-pvc
    ```

    ```sh
    Name:          original-pvc
    Namespace:     default
    StorageClass:  azurediskprovisioner
    Status:        Pending
    Volume:
    Labels:        <none>
    Annotations:   Finalizers:  [kubernetes.io/pvc-protection]
    Capacity:
    Access Modes:
    VolumeMode:    Filesystem
    Mounted By:    <none>
    Events:
      Type    Reason                Age                  From                         Message
      ----    ------                ----                 ----                         -------
      Normal  WaitForFirstConsumer  2s (x12 over 2m33s)  persistentvolume-controller  waiting for first consumer to be created before binding
    ```

The underlying storage has not been provisioned yet because it is waiting for the first consumer.
Create a pod that will write to the newly created volume.

1. To create a Pod, create a new file `original-pod.yaml`

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: original-pvc-consumer
    spec:
      containers:
      - name: ubuntu
        image: ubuntu:latest
        command: [ "/bin/bash", "-c", "--" ]
        args: [ "echo 'test' > /mnt/azuredisk/file; while true; do sleep 30; done;" ]
        volumeMounts:
          - name: original-pvc
            mountPath: "/mnt/azuredisk"
      volumes:
        - name: original-pvc
          persistentVolumeClaim:
            claimName: original-pvc
    ```

1. Apply the configuration to create the pod.

    ```bash
    kubectl apply -f original-pod.yaml
    ```

1. Check the pod is running, its underlying Persistent Volume (PV) storage for
   the `original-pvc` was provisioned and that it was bound to the PVC.

    ```bash
    kubectl get pod
    ```

    ```sh
    NAME                    READY   STATUS    RESTARTS   AGE
    original-pvc-consumer   1/1     Running   0          6m52s

    kubectl describe pvc original-pvc
    Name:          original-pvc
    Namespace:     default
    StorageClass:  azurediskprovisioner
    Status:        Bound
    Volume:        pvc-466daf5d-ff57-4fe0-959b-f0553fa74d93
    Labels:        <none>
    Annotations:   pv.kubernetes.io/bind-completed: yes
                  pv.kubernetes.io/bound-by-controller: yes
                  volume.beta.kubernetes.io/storage-provisioner: disk.csi.azure.com
                  volume.kubernetes.io/selected-node: worker-2-konvoy-v1-5-0-099c
    Finalizers:    [kubernetes.io/pvc-protection]
    Capacity:      1Gi
    Access Modes:  RWO
    VolumeMode:    Filesystem
    Mounted By:    original-pvc-consumer
    Events:
      Type    Reason                 Age                 From                                                                                 Message
      ----    ------                 ----                ----                                                                                 -------
      Normal  WaitForFirstConsumer   10m (x42 over 20m)  persistentvolume-controller                                                          waiting for first consumer to be created before binding
      Normal  Provisioning           7m10s               disk.csi.azure.com_worker-1-konvoy-v1-5-0-099c_95d7a08b-8698-4ee5-a1f6-08b2b952a369  External provisioner is provisioning volume for claim "default/original-pvc"
      Normal  ProvisioningSucceeded  6m59s               disk.csi.azure.com_worker-1-konvoy-v1-5-0-099c_95d7a08b-8698-4ee5-a1f6-08b2b952a369  Successfully provisioned volume pvc-466daf5d-ff57-4fe0-959b-f0553fa74d93
    ```

## Clone a Persistent Volume Claim

1. Create a Persistent Volume Claim by cloning an existing PVC. Create a new file `cloned-pvc.yaml`.

   An important part of this definition is `dataSource` which is set to `PersistentVolumeClaim` kind.

   It is possible to request storage capacity that is identical or higher than the source PVC.

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: cloned-pvc
      namespace: default
    spec:
      storageClassName: azurediskprovisioner
      resources:
        requests:
          storage: 10Gi
      accessModes:
      - ReadWriteOnce
      dataSource:
        kind: PersistentVolumeClaim
        name: original-pvc
    ```

1. Apply the new configuration.

    ```bash
    kubectl apply -f cloned-pvc.yaml
    ```

1. Check the PVC was created and is in pending state, waiting for its consumer.

    ```bash
    kubectl get pvc
    ```

    ```sh
    NAME           STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS           AGE
    cloned-pvc     Pending                                                                        azurediskprovisioner   18s
    original-pvc   Bound     pvc-466daf5d-ff57-4fe0-959b-f0553fa74d93   1Gi        RWO            azurediskprovisioner   26m
    ```

  The new PVC `cloned-pvc` is now waiting for its consumer.

1. Create a new file called `cloned-pod.yaml`.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cloned-pvc-consumer
spec:
  containers:
  - name: ubuntu
    image: ubuntu:latest
    command: [ "/bin/bash", "-c", "--" ]
    args: [ "ls -lah /mnt/azuredisk/file; cat /mnt/azuredisk/file; while true; do sleep 30; done;" ]
    volumeMounts:
      - name: cloned-pvc
        mountPath: "/mnt/azuredisk"
  volumes:
    - name: cloned-pvc
      persistentVolumeClaim:
        claimName: cloned-pvc
```

1. Apply the new pod configuration.

    ```bash
    kubectl apply -f cloned-pod.yaml
    ```

1. Check that the new PVC has been provisioned.

    ```bash
    kubectl get pvc
    ```

    ```sh
    NAME           STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS           AGE
    cloned-pvc     Pending                                                                        azurediskprovisioner   7m15s
    original-pvc   Bound     pvc-466daf5d-ff57-4fe0-959b-f0553fa74d93   1Gi        RWO            azurediskprovisioner   33m

    kubectl get pvc
    NAME           STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS           AGE
    cloned-pvc     Bound    pvc-4c08da33-f26b-4fbe-8438-46801b16a17d   10Gi       RWO            azurediskprovisioner   7m18s
    original-pvc   Bound    pvc-466daf5d-ff57-4fe0-959b-f0553fa74d93   1Gi        RWO            azurediskprovisioner   33m
    ```

1. Check the logs output of the new pod and verify that the file is present in the filesystem.

    ```bash
    kubectl logs cloned-pvc-consumer
    ```

    ```sh
    -rw-r--r--. 1 root root 5 Aug 13 09:06 /mnt/azuredisk/file
    test
    ```

## Related Information

For information on related topics or procedures, refer to the following:

- [CSI Volume Cloning](https://kubernetes.io/docs/concepts/storage/volume-pvc-datasource/)
- [Introducing Volume Cloning Alpha for Kubernetes](https://kubernetes.io/blog/2019/06/21/introducing-volume-cloning-alpha-for-kubernetes/)

[aws-csi-driver]:https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[azuredisk-csi-driver]:https://github.com/kubernetes-sigs/azuredisk-csi-driver
[csi-volume-cloning]:https://kubernetes.io/docs/concepts/storage/volume-pvc-datasource/
