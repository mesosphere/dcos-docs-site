---
layout: layout.pug
navigationTitle: Storage
title: Storage
menuWeight: 9
excerpt: Manage storage options including local and mounted persistent volumes
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Kubernetes Storage Overview

A workload (i.e., Pod) on Kubernetes typically requires two types of storage: ephemeral storage and persistent storage.

## Ephemeral storage

Ephemeral storage, by its name, is ephemeral in the sense that it will be cleaned up when the workload (i.e., Pod) is deleted or the container crashes.
For example, the followings are ephemeral storage provided by Kubernetes:

* [EmptyDir][emptydir] volume.
  Managed by kubelet under `/var/lib/kubelet`.
* Container logs.
  Typically under `/var/logs/containers`.
* Container image layers.
  Managed by container runtime (e.g., under `/var/lib/containerd`).
* Container writable layers.
  Managed by container runtime (e.g., under `/var/lib/containerd`).

Ephemeral storage is automatically managed by Kubernetes, and typically does not require explicit settings from users.
Users may need to express the [capacity requests][ephemeral_storage_request] for ephemeral storage so that kubelet can use that information to make sure it does not run out of ephemeral storage space on each node.

## Persistent volumes

Some stateful workloads require persistent storage whose lifecycle is longer than that of Pods or containers.
For instance, a database server will need to recover database files after it crashes.
For those case, the workloads need to use [PersistentVolumes][pv] (PV).

Persistent Volumes are resources that represent storage in the cluster that has been provisioned by an administrator or dynamically provisioned using [Storage Classes][#storage-class].
Unlike ephemeral storage, the lifecycle of a `PersistentVolume` is independent of that of the workload that uses it.

The Persistent Volume API objects capture the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.
For instance:

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteMany
  nfs:
    server: nfs-server.default.svc.cluster.local
    path: "/"
```

<a name="storage-class"></a>

## Storage classes and dynamic volume provisioning

For a workload that requires persistent volumes, it should use [PersistentVolumeClaim][pvc] (PVC) to express its request on persistent storage.
A `PersistentVolumeClaim` can request specific size and access modes (e.g., can be mounted once read/write or many times read-only) like the following.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-claim
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ebs-sc
  resources:
    requests:
      storage: 4Gi
```

And the workload (e.g., Pod) can specify the `PersistentVolumeClaim` like the following.
In this example, the pod needs one `PersistentVolume` that is at least 4Gi large.
And the persistent volume will be mounted under `/data` in the filesystem of the container.
A `PersistentVolume` that satisfies the requirements specified in the`PersistentVolumeClaim` will be *bound* to the `PersistentVolumeClaim` before the pod starts.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app
spec:
  containers:
  - name: app
    image: centos
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo $(date -u) >> /data/out.txt; sleep 5; done"]
    volumeMounts:
    - name: persistent-storage
      mountPath: /data
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: ebs-claim
```

It is common that users might need `PersistentVolumes` with varying properties, such as performance, for different problems.
Cluster administrators need to be able to offer a variety of `PersistentVolumes` that differ in more ways than just size and access modes, without exposing users to the details of how those volumes are implemented.
For these needs there is the `StorageClass` resource.

A typical `StorageClass` will be look like the following.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  fsType: xfs
  type: io1
  iopsPerGB: "50"
  encrypted: "true"
```

Cluster administrators are responsible for setting up `StorageClasses` for the cluster, and the users will specify their storage needs by referencing the storage class name in the `PersistentVolumeClaims`.
In the above example, `PersistentVolumeClaim` `ebs-claim` reference `StorageClass` `ebs-sc`, meaning that only `PersistentVolumes` that satisfy the requirements specified in `StorageClass` `ebs-sc` can be bound to the `PersistentVolumeClaim`.

## Container Storage Interface (CSI)

Kubernetes has a volume plugin system to support different kinds of storage vendors.
Prior to Container Storage Interface, most of the volume plugins are *in-tree*, meaning that the driver code lives in Kubernetes main repository.
This creates many issues, especially forcing all storage vendors to release at the same time.

[Container Storage Interface][csi] (CSI) is the solution to solve the above issues.
It reached GA status in Kubernetes 1.13.
It uses an *out-of-tree* plugin model so that plugins from storage vendors can have a different release cycle than Kubernetes, as long as it conforms to the CSI spec.

Konvoy only supports CSI volume plugins and DO NOT support *in-tree* volume plugins.

Konvoy supports all CSI volume plugins as long as the volume plugin is conformant to the CSI spec 1.x.

# Storage in Konvoy for AWS environment

Konvoy ships with [AWS EBS CSI][aws_ebs_csi] plugin by default for AWS deployments.
The integration will be turned on by default and does not require any configuration normally.

Konvoy creates a [default storage class][default_storage_class] backed by AWS EBS CSI plugin by default.
This means if the user does not specify a storage class in his/her `PersistentVolumeClaim`, it will default to the AWS EBS CSI plugin.

All the addons installed by Konvoy will use the default storage class.

If a user wants to use a different storage vendor, he/she will need to either disable the AWS EBS CSI plugin (i.e., by disable the `awsebscsiprovisioner` addon), or set the `storageclass.isDefault` field to `false` for the addon.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  addons:
    addonsList:
      - name: awsebscsiprovisioner
        enabled: true
        values: |
          storageclass:
            isDefault: false
```

Then, install the CSI plugin from the third party storage vendor, and set the default storage class to point to the storage class provided by the third party storage vendor.

## Volume cleanup during Konvoy teardown

`konvoy down` will automatically delete any EBS volumes provisioned from the AWS EBS CSI plugin if the [ReclaimPolicy][reclaim_policy] is set to `Delete`.

# Storage in Konvoy for on-premise environment

For on-premise environment, Konvoy provides the following options for storage.

* Use third party storage solutions from storage vendors.
* Use [local persistent volume][local_persistent_volume] support ships with Konvoy by default.

Note that if your stateful workload is using a [local persistent volume][local_persistent_volume], it cannot be moved to a different node.
If the node fails, the stateful workload might lose its data.
If you cannot tolerate this limitation, you should consider third party storage solutions from storage vendors.

## Local volume support

Konvoy uses the [Static local volume provisioner][static_lvp] to support local persistent volumes.

This default storage provisioning option allows operators to mount local volumes at a specific location on each host.
For a Konvoy cluster, the local volume mount point is `/mnt/disks` by default.

Mounted volumes in the `/mnt/disks` location are detected automatically.
Once detected, corresponding [persistent volume][persistent_volume] objects are created in the API server for your stateful workloads.

### Use LVM to create multiple local volumes from a single physical disk

This section walks you through how to use LVM to create multiple local volumes from a single physical disk.

1. Before you start, make sure LVM tooling is installed.

    ```bash
    yum install lvm2
    ```

1. Create a physical volume.

   Assume the physical disk is at device path `/dev/sdb`.

    ```bash
    pvcreate /dev/sdb
    ```

1. Create a volume group from the physical volume.

    ```bash
    vgcreate vg /dev/sdb
    ```

1. Create logical volumes from the volume group.

    ```bash
    lvcreate -n lv1 -L 55G vg
    ```

    The above command will create a 55G logical volume named `lv1` from the volume group `vg` created above.
    Simply repeat this step and the following steps if you want create multiple logical volumes.

1. Install a filesystem on the logical volume.

    ```bash
    mkfs.ext4 /dev/vg/lv1
    ```

1. Mount the logical volumes.

    You need to make sure the mount persists across host reboot.
    As a result, use stable identifiers like device UUID.

    ```bash
    DISK_UUID=$(blkid -s UUID -o value /dev/vg/lv1)
    mkdir -p /mnt/disks/$DISK_UUID
    mount /dev/vg/lv1 /mnt/disks/$DISK_UUID
    echo "UUID=$DISK_UUID /mnt/disks/$DISK_UUID ext4 defaults 0 0" >> /etc/fstab
    ```

1. Verify that logical volumes are discovered and available as persistent volumes.

    ```bash
    kubectl get pv
    ```

    The above command will list new persistent volumes available in the 'localvolumeprovisioner' storage class.

1. Verify that logical volumes stay mounted after the host is rebooted.

### Decommission a local volume

This section describes how to remove the LVM volume created in the last section.

1. Make sure that all pods that are using the persistent volume associated with the local volume are stopped.

1. Remove the logical volume.

    ```bash
    DISK_UUID=$(blkid -s UUID -o value /dev/vg/lv1)
    umount /mnt/disks/$DISK_UUID
    sed -i "/UUID=$DISK_UUID/d" /etc/fstab
    ```

1. Delete persistent volume claims for the persistent volume.

    Once the persistent volume claims has been removed, the provisioner will try to clean-up the volume.
    This will fail, because the volume no longer exists.

1. Delete the persistent volume.

    Assume the persistent volume was named `local-pv-3fe70cc6`.

    ```bash
    kubectl delete pv local-pv-3fe70cc6
    ```

## Third party storage integration

This is similar to that in AWS deployment.
The user will need to either turn off the local volume provisioner addon, or set the `storageclass.isDefault` field to `false` for the addon.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
spec:
  addons:
    addonsList:
      - name: localvolumeprovisioner
        enabled: true
        values: |
          storageclass:
            isDefault: false
```

[emptydir]: https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
[ephemeral_storage_request]: https://kubernetes.io/docs/concepts/configuration/manage-compute-resources-container/#local-ephemeral-storage
[pv]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[pvc]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[csi]: https://github.com/container-storage-interface/spec
[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[default_storage_class]: https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/
[local_persistent_volume]: https://kubernetes.io/docs/concepts/storage/volumes/#local
[static_lvp]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[reclaim_policy]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#reclaiming
