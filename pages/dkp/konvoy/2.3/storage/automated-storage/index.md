---
layout: layout.pug
navigationTitle: Default storage options
title: Automated storage options in cloud providers
excerpt: Default storage providers in Konvoy
beta: false
enterprise: false
menuWeight: 20
---

When deploying Konvoy using a supported cloud provisioner, Konvoy automatically configures native storage drivers for the target platform. In addition, Konvoy deploys a default [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) for [dynamic persistent volume (PV)](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) creation. The table below lists the driver and default StorageClass for each supported cloud provisioner.

| Cloud Provisioner |  Driver              | Default Storage Class        |
--------------------|----------------------|----------------------|
| AWS               | aws-ebs-csi-driver   | [awscsiprovisioner](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)    |
| Azure               | azuredisk-csi-driver   | [azurecsiprovisioner](https://github.com/kubernetes-sigs/azuredisk-csi-driver)    |

When a default StorageClass is specified, persistent volume claims (PVCs) can be created without needing to specify the storage class. For instance, to request a volume using the default provisioner, create a PVC with the following:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 4Gi
```

To start the provisioning of a volume, launch a pod which references the PVC:

```yaml
...
    volumeMounts:
    - mountPath: /data
      name: persistent-storage
...
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: my-pv-claim

```

## Multiple Storage Classes

The default `StorageClass` provisioned with Konvoy is acceptable for most workloads and offers a good cost to performance ratio. If your workload has different requirements, you can create additional `StorageClass` types with specific configurations.

In some instances you can change the default `StorageClass`. Refer to this procedure:

- [Changing the default storage class](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)

## Driver Information

All default drivers implement the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)(CSI). The CSI provides a common abstraction to container orchestrators for interacting with storage subsystems of various types. Each driver has specific configuration parameters which effect PV provisioning. This section details the default configuration for drivers used with Konvoy. This section also has links to driver documentation, if further customization is required.

<p class="message--note"><strong>NOTE: </strong><code>StorageClass</code> parameters cannot be changed after creation. To use a different volume configuration, you must create a new <code>StorageClass</code></p>

### Amazon Elastic Block Store (EBS) CSI Driver

Konvoy EBS default `StorageClass`:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  annotations:
    storageclass.kubernetes.io/is-default-class: "true" # This tells kubernetes to make this the default storage class
  name: ebs-sc
provisioner: ebs.csi.aws.com
reclaimPolicy: Delete  # volumes are automatically reclaimed when no longer in use and PVCs are deleted
volumeBindingMode: WaitForFirstConsumer #  Physical volumes will not be created until a pod is created that uses the PVC, required to use CSI's Topology feature
parameters:
  csi.storage.k8s.io/fstype: ext4
  type: gp3 # General Purpose SSD
```

Konvoy deploys with gp3 (general purpose SSDs) EBS volumes.

- Driver documentation: [aws-ebs-csi-driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
- Volume types and pricing: [volume types](https://aws.amazon.com/ebs/features/)

### Azure CSI Driver

Konvoy deploys with StandardSSD_LRS for Azure Virtual Disks.

- Driver documentation: [azure-csi-driver](https://github.com/kubernetes-sigs/azuredisk-csi-driver)
- Volume types and pricing: [volume types](https://azure.microsoft.com/en-us/pricing/details/storage/page-blobs/)

## On Premises and other storage options

In an on premises situation, accessible storage can be used for PV and PVCs. Using the Kubernetes CSI and third party drivers, you can use your local volumes and other storage devices in your data center. Possible storage and third party driver options are:

<p class="message--note"><strong>NOTE: </strong>Support licenses are available for the Portworx and Purestorage products. Refer to their company support sites for more information.</p>

## Related Information

- [Kubernetes Storage](https://kubernetes.io/docs/concepts/storage/)
- [Kubernetes Local Persistent Volumes](https://kubernetes.io/blog/2019/04/04/kubernetes-1.14-local-persistent-volumes-ga/)
