---
layout: layout.pug
navigationTitle: Default storage options
title: Automated storage options in cloud providers
menuWeight: 20
excerpt: Default storage providers in Konvoy
enterprise: false
---

When deploying Konvoy using a supported cloud provisioner (AWS, Azure, or GCP), Konvoy automatically configures native storage drivers for the target platform. In addition, Konvoy deploys a default [StorageClass](https://kubernetes.io/docs/concepts/storage/storage-classes/) for [dynamic persistent volume (PV)](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) creation.

| Cloud Provisioner |  Driver              | Default Storage Class |
--------------------|----------------------|----------------------|
| AWS               | aws-ebs-csi-driver   | awscsiprovisioner    |
| Azure             | azuredisk-csi-driver | azurediskprovisioner |
| GCP               | gcpdisk-csi-driver   | gcpdiskprovisioner   |

When a default StorageClass is specified, persistent volume claims (PVCs) can be created without needing to specify the storage class. For instance, to allocate storage using the default provisioner, simply create a PVC with the following:

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

The default `StorageClass` provisioned with Konvoy is acceptable for most workloads and offers a good cost to performance ratio. If your workload has different requirements, you can create additional `StorageClass` types  with specific configurations.

In some instances you can change the default `StorageClass`. Refer to this procedure:

- [Changing the default storage class](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/)

## Driver Information

All default drivers implement the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md)(CSI). The CSI provides a common abstraction to container orchestrators for interacting with storage subsystems of various types. Each driver has specific configuration parameters which effect PV provisioning. This section details the default configuration used with Konvoy with links to driver documentation, if further customization is required.

<p class="message--note"><strong>NOTE: </strong><code>StorageClass</code> parameters cannot be changed after creation. To use a different volume configuration, you must create a new <code>StorageClass</code></p>

### Amazon Elastic Block Store (EBS) CSI Driver

Konvoy EBS default `StorageClass`:

```yaml
allowVolumeExpansion: true
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    kubernetes.io/description: AWS EBS CSI provisioner StorageClass
    storageclass.kubernetes.io/is-default-class: "true"  # This tells kubernetes to make this the default storage class
  name: awsebscsiprovisioner
parameters:
  type: gp2  # General Purpose SSD
provisioner: ebs.csi.aws.com
reclaimPolicy: Delete  # volumes are automatically reclaimed when no longer in use and PVCs are deleted
volumeBindingMode: WaitForFirstConsumer  #  Physical volumes will not be created until a pod is created that uses the PVC
```

Konvoy deploys with gp2 (general purpose SSDs) EBS volumes.

- Driver documentation: [aws-ebs-csi-driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
- Volume types and pricing: [volume types](https://aws.amazon.com/ebs/features/)

### Azure CSI Driver

Konvoy Azure default `StorageClass`:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  annotations:
    kubernetes.io/description: Azure Disk Storage class
    storageclass.kubernetes.io/is-default-class: "true"
  name: azurediskprovisioner
parameters:
  cachingMode: ReadOnly # hypervisor local, RO caching
  kind: managed
  skuname: "StandardSSD_LRS"  # Standard (lower cost) SSDs with local redundancy
provisioner: disk.csi.azure.com
reclaimPolicy: Delete
volumeBindingMode: WaitForFirstConsumer
```

- Driver documentation: [azure-disk-storage](https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-disk-storage-class)
- Additional information: [azure-disk-dynamic-provisioning](https://docs.microsoft.com/en-us/azure/aks/azure-disks-dynamic-pv)
- Azure storage pricing: [azure-storage](https://azure.microsoft.com/en-us/pricing/details/managed-disks/)

### Google Compute Engine CSI Driver (Beta)

The GCE driver is still in beta but has been tested with Konvoy native workloads, such as Elasticsearch and Prometheus.

Konvoy GCE default `StorageClass`:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: gcpdiskprovisioner
  annotations:
    kubernetes.io/description: Google Compute Engine Persistent Disk (GCE PD) Storage class
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: pd.csi.storage.gke.io
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Delete
parameters:
  type: pd-ssd
  replication-type: none
```

- Driver documentation: [gcp-compute-persistent-disk-csi-driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)
- Disk pricing: [gcp-disk-pricing](https://cloud.google.com/compute/disks-image-pricing#disk)
