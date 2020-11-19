---
layout: layout.pug
navigationTitle: Local Volume Storage
title: Kubernetes Local Storage
menuWeight: 9
excerpt: An introduction to Kubernetes local volumes
beta: false
enterprise: false
---

<!-- markdownlint-disable MD007 MD030 -->

This document describes what a local volume is and how you can use it in Kubernetes.

## Local Storage Volume

A local volume represents a device such as a disk, partition or directory available on a node. Local persistent volumes allows users to access local storage through the standard Kubernetes Persistent Volume Claim (PVC) interface in a simple and portable way.

The system is aware of the volume's node constraints by looking at the node affinity on the `PersistentVolume`. This means local volumes can be used in a durable and portable manner without manually scheduling Pods to nodes. However, local volumes are subject to the availability of the node and are not suitable for all applications. If a node becomes unhealthy, then the local volume will also become inaccessible, and a Pod using it can not run. Applications using local volumes must be able to tolerate this reduced availability, and potential data loss, depending on the durability characteristics of the underlying disk.
Currently, local volumes can only be used as statically created `PersistentVolumes` because Dynamic provisioning for local storage is not yet supported in Kubernetes.

The following is an example of a `PersistentVolume` using a local volume and nodeAffinity:

 ```yaml
 apiVersion: v1
 kind: PersistentVolume
 metadata:
   name: local-storage
 spec:
   capacity:
     storage: 100Gi
   volumeMode: Filesystem # Mount volume into Pod as a directory.
   accessModes:
   - ReadWriteOnce
   persistentVolumeReclaimPolicy: Delete
   storageClassName: local-storage
   local:
     path: /mnt/volume/disk1 # Path to the directory this PV refers to.
   nodeAffinity: # nodeAffinity is required when using local volumes.
     required:
       nodeSelectorTerms:
       - matchExpressions:
         - key: kubernetes.io/hostname
           operator: In
           values:
           - node-hostname
 ```

  - `volumeMode` can be set to `Block`, instead of the default value `Filesystem`, to expose the local volume as a raw block device. Volume in `Block` mode is mounted into a Pod as a block device, without any filesystem on it. A volume in `Filesystem` mode is mounted into Pods into a directory. If the block device that backs the volume is empty, Kubernetes creates a filesystem on the device before mounting it for the first time.

  - Configure `path` with the directory this `PersistentVolume` refers to.

  - `nodeAffinity` is required when using local volumes. It enables the Kubernetes scheduler to correctly schedule Pods using local volumes to the correct node.

For more details on the options available to create a `PersistentVolume` please check [Kubernetes PersistentVolume documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes).

To ensure the PVC binding decision also evaluates other node constraints the Pod may have, create a [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) with `volumeBindingMode` set to `WaitForFirstConsumer`.

To improve the local volume lifecycle management, Konvoy ships an external [local volume static provisioner](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner). The local volume static provisioner manages the `PersistentVolume` lifecycle for local disks by detecting and creating PVs for each local disk found on the host, and cleaning up the disks when released. Note that this provisioner does not support dynamic provisioning yet.

## Related Information

- [Kubernetes local storage](https://kubernetes.io/docs/concepts/storage/volumes/#local)
- [Kubernetes PersistentVolumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistent-volumes)
- [Local volume static provisioner](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner)
