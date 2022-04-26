---
layout: layout.pug
navigationTitle: Kubernetes Container Storage Interface (CSI)
title: Kubernetes Container Storage Interface (CSI)
menuWeight: 9
excerpt: Introduction to Kubernetes Container Storage Interface (CSI)
beta: false
enterprise: false
---

<!-- markdownlint-disable MD030 -->

The Container Storage Interface (CSI) is an industry standard that enables storage vendors to develop plugins for exposing block and filesystem storage systems to containers. The goal of CSI is to provide an extensible layer to manage Kubernetes volumes.

CSI replaces earlier Kubernetes attempts to manage storage such as in-tree volume plugins and FlexVolume plugins. These plugins were hosted in the Kubernetes codebase and were shipped with the core Kubernetes binaries. This meant storage providers were forced to follow the Kubernetes release process to release bug fixes and new functionality.

## CSI Architecture

The CSI standard defines a set of services to reduce coupling with storage drives and provide more flexibility. These services are deployed along side a storage driver as sidecar containers. The sidecar containers are responsible for interacting with the Kubernetes API.

[Konvoy will automatically configure native storage drivers][automated-storage] for the supported cloud provisioners (AWS, Azure, or GCP) which deploy the following sidecar containers:

<table>
  <tr>
   <td><strong>Sidecar container</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td>external-attacher
   </td>
   <td>Watches Kubernetes <code>VolumeAttachment</code> objects and triggers <code>ControllerPublish</code> and <code>ControllerUnpublish</code> operations against a CSI endpoint.
   </td>
  </tr>
  <tr>
   <td>external-provisioner
   </td>
   <td>Watches Kubernetes <code>PersistentVolumeClaim</code> objects and triggers <code>CreateVolume</code> and <code>DeleteVolume</code> operations against a CSI endpoint.
   </td>
  </tr>
  <tr>
   <td>node-driver-registrar
   </td>
   <td>Registers the CSI driver with the Kubelet using the Kubelet device plugin registration mechanism.
   </td>
  </tr>
  <tr>
   <td>external-snapshotter
   </td>
   <td>Watches Kubernetes <code>VolumeSnapshot</code> CRD objects and triggers <code>CreateSnapshot</code> and <code>DeleteSnapshot</code> operations against a CSI endpoint.
   </td>
  </tr>
  <tr>
   <td>livenessprobe
   </td>
   <td>Optional CSI plugin to enable the Kubernetes Liveness Probe mechanism.
   </td>
  </tr>
</table>

## Using a CSI volume with Konvoy on AWS

In Konvoy, you can use CSI volumes through the Kubernetes storage API objects like PersistentVolumeClaims (PVCs), PersistentVolumes (PVs), and StorageClasses.

Here's an example of a StorageClass for the [AWS EBS CSI driver][aws-ebs-csi-driver]. Save it in file named `ebs-sc.yaml`:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: ebs-storage-class # The name of the StorageClass.
provisioner: ebs.csi.aws.com # The name of the AWS CSI driver.
volumeBindingMode: WaitForFirstConsumer
parameters:
  csi.storage.k8s.io/fstype: xfs # The filesystem type to format the volume.
  type: io1 # The type of AWS EBS volume.
  iopsPerGB: "50"
  encrypted: "true"
allowedTopologies:
- matchLabelExpressions:
  - key: topology.ebs.csi.aws.com/zone
    values:
    - us-east-1a
```

Next, apply the file.

```bash
kubectl apply -f ebs-sc.yaml
```

Ensure that it is applied.

```bash
kubectl get storageclass
```

The output should be similar to:

```sh
NAME               PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
ebs-storageclass   ebs.csi.aws.com   Delete          WaitForFirstConsumer   true                   10s
```

This is an example of a PVC configured to use the StorageClass. Save it in a file named `ebs-pvc.yaml`.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-pvc # The name of the PersistentVolumeClaim.
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ebs-storage-class # The storage class that it should use.
  resources:
    requests:
      storage: 4Gi # The size of the volume.
```

Next, apply the file.

```bash
kubectl apply -f ebs-pvc.yaml
```

Ensure that it is applied.

```bash
kubectl get pvc
```

The output should be similar to:

```sh
NAMESPACE    NAME      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS        AGE
default      ebs-pvc   Bound    pvc-c0dff51c-a8c1-48b7-97f0-01b56fabca08   30Gi       RWO            ebs-storage-class   50s
```

The following sample Kubernetes Pod specification has the EBS volume created by the AWS EBS CSI driver and mounted in the container:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-application
spec:
  containers:
  - name: app
    image: centos
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo $(date -u) >> /data/out.txt; sleep 5; done"]
    volumeMounts:
    - name: persistent-storage
      mountPath: /data # The path inside the container where the volume is mounted.
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: ebs-claim # The PVC that it should use.
```

## Related Information

- [Kubernetes CSI specification][k8s-csi]
- [Konvoy automated storage options in cloud providers][automated-storage]

[automated-storage]:../automated-storage
[aws-ebs-csi-driver]:https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[k8s-csi]:https://kubernetes-csi.github.io/
