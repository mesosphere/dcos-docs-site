---
layout: layout.pug
navigationTitle: Storage
title: Kubernetes Storage Introduction
menuWeight: 120
excerpt: An introduction to persistent storage in Kubernetes
beta: false
enterprise: false
---

This document describes the model used in Kubernetes for managing persistent, cluster-scoped storage for workloads requiring access to persistent data.

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

The Persistent Volume API objects capture the details of the implementation of the storage, be that NFS, iSCSI, or a cloud-provider-specific storage system.  In order to use a Persistent Volume (PV), your application needs to invoke a Persistent Volume Claim (PVC).

### Persistent Volume Procedures

- [Create a Persistent Volume to access your NFS shared storage](./create-pv)

## Persistent Volume Claim

A PersistentVolumeClaim is a request for storage. For a workload that requires persistent volumes, the workload should use PersistentVolumeClaim (PVC) to express its request on persistent storage. A PersistentVolumeClaim can request specific size and [Access Modes](https://v1-20.docs.kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) (for example, they can be mounted once read/write or many times read-only).

Any workload can specify a PersistentVolumeClaim. For example, a Pod may need a volume that is at least 4Gi large or a volume mounted under `/data` in the container's filesystem. If there is a PersistentVolume (PV) that satisfies the specified requirements in the PersistentVolumeClaim (PVC), it will be bound to the PVC before the Pod starts.

### Persistent Volume Claim Procedures

- [Create a Persistent Volume Claim to access your NFS shared storage](./create-pvc)
- [Configure a Workload to use a Persistent Volume Claim to access your NFS shared storage](./bind-pvc)

## Related Information

- [Kubernetes Storage](https://kubernetes.io/docs/concepts/storage/)
- [Kubernetes persistent storage design document](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/persistent-storage.md)
