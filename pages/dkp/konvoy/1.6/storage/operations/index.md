---
layout: layout.pug
navigationTitle: Storage Operations for Konvoy Clusters
title: Konvoy Storage Operations
menuWeight: 20
excerpt: Manage storage options including local and mounted persistent volumes
beta: false
enterprise: false
---

This document contains operational information about the following items used in Konvoy clusters:

- Storage Classes (SC)
- Persistent Volumes (PV)
- Persistent Volume Claims (PVC)
- [Container Storage Interface][csi] (CSI)
- Storage Addons

Make sure you have reviewed the supporting [Introduction to Storage](../) and [Introduction to CSI](../intro-csi) documentation first.

## Overview

In Konvoy clusters which are deployed on AWS, Azure or GCP cloud we provide default storage classes using [CSI][csi] [drivers][csi-dev]:

- [AWS CSI Driver][aws-csi-driver]
- [Azure CSI Driver][azure-csi-driver]
- [GCP CSI Driver][gcp-csi-driver]

For configurations where these drivers are not suitable you must manage your own storage. We recommend the storage solutions of our [business partner][portworxpartners] [Portworx][portworx].  They provide additional Kubernetes storage solutions which may better address your use case.

If you have not enabled or deployed your own [default storage class][default-storage-class] Konvoy provides a rudimentary local storage driver.
<p class="message--note"><strong>NOTE: </strong>This is <bold>not supported nor intended for production workloads</bold> and should only be deployed during testing scenarios to <bold>avoid data loss.</bold></p>

## Storage with CSI Drivers

Previously we referenced several "drivers" which are in use by default on various cloud platforms when deploying Konvoy. At a high level, and an operational perspective, using these drivers you can automatically manage  your Persistent Volumes (PV). The PV is created when a Persistent Volume Claim (PVC) is created on the cluster, and the PV is torn down, depending on the configuration, when the PVCs are deleted.

In the following sections we will discuss some of the basic operational characteristics and capabilities of these drivers and how to utilize them to provision storage for your Kubernetes applications.

### Examples

Each of the following example assumes that you have either the AWS, Azure, GCP, Portworx, or Local storage driver deployed to your cluster.

#### Storage Classes

You can verify that you have a default storage class provided by the driver you're using by running the following:

```bash
kubectl get storageclasses
```

```sh
NAME                             PROVISIONER       RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
awsebscsiprovisioner (default)   ebs.csi.aws.com   Delete          WaitForFirstConsumer   true                   10m
```

In this example a testing cluster was used with the AWS storage driver. The upcoming examples also work the same for Azure, GCP and Portworx.

**WARNING**: the `ReclaimPolicy` has a _very direct_ impact on automated operations for your applications storage. Delete will do exactly what it sounds like it will do if you delete the PVC!

#### AWS Driver

These examples specifically use the AWS driver and are AWS implementation specific.

##### Volume Creation

Using storage drivers with Konvoy allows us to abstract away Persistent Volumes some, as we wont need to operationally interact with them under normal circumstances (see our [troubleshooting][troubleshooting] guide for the non-normal circumstances), but instead Persistent Volume Claims become the substrate by which we implement storage for our Kubernetes applications.

In this example we will set up a basic webserver using [NGinx][nginx] with a custom landing page persisted via PVs which are provisioned automatically upon the creation of a PVC. We will follow along with the automated operations for provisioning and mounting created volumes by the driver.

**NOTE**: Ensure sure you have `kubectl` installed and configured to connect to the appropriate Konvoy cluster.

Create the application deployment by running the following:

```yaml
cat << EOF | kubectl apply -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-stateful
  labels:
    app: nginx-stateful
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-stateful
  template:
    metadata:
      labels:
        app: nginx-stateful
    spec:
      volumes:
        - name: nginx-data
          persistentVolumeClaim:
            claimName: nginx-data
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
        volumeMounts:
          - mountPath: "/usr/share/nginx/html"
            name: nginx-data
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
EOF
```

On success the following output will be received:

```sh
deployment.apps/nginx-stateful created
persistentvolumeclaim/nginx-data created
```

If you're fast you may see the PVC in a pending state:

```bash
kubectl get pvc
```

```sh
NAME                               STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
persistentvolumeclaim/nginx-data   Pending                                      default        79s
```

Very quickly automatic processes from your driver will create a PV and bind it to your PVC:

```bash
kubectl get pvc
```

```sh
NAME         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS           AGE
nginx-data   Bound    pvc-8b1118e4-39b7-44ea-84e0-66d509f30658   1Gi        RWO            awsebscsiprovisioner   7s
```

Now this isn't magic, the provisioner (a part of the driver) was responsible for creating the necessary PV and binding it to your PVC:

```bash
kubectl -n kube-system logs ebs-csi-controller-0 csi-provisioner | grep nginx
```

```sh
I0807 17:34:39.244929       1 controller.go:1284] provision "default/nginx-data" class "awsebscsiprovisioner": started
I0807 17:34:39.248874       1 event.go:281] Event(v1.ObjectReference{Kind:"PersistentVolumeClaim", Namespace:"default", Name:"nginx-data", UID:"8b1118e4-39b7-44ea-84e0-66d509f30658", APIVersion:"v1", ResourceVersion:"50952", FieldPath:""}): type: 'Normal' reason: 'Provisioning' External provisioner is provisioning volume for claim "default/nginx-data"
I0807 17:34:45.671303       1 controller.go:726] successfully created PV pvc-8b1118e4-39b7-44ea-84e0-66d509f30658 for PVC nginx-data and csi volume name vol-0de1bf1ebcd1a3710
I0807 17:34:45.671379       1 controller.go:1392] provision "default/nginx-data" class "awsebscsiprovisioner": volume "pvc-8b1118e4-39b7-44ea-84e0-66d509f30658" provisioned
I0807 17:34:45.671401       1 controller.go:1409] provision "default/nginx-data" class "awsebscsiprovisioner": succeeded
I0807 17:34:45.675106       1 controller.go:1284] provision "default/nginx-data" class "awsebscsiprovisioner": started
I0807 17:34:45.675198       1 event.go:281] Event(v1.ObjectReference{Kind:"PersistentVolumeClaim", Namespace:"default", Name:"nginx-data", UID:"8b1118e4-39b7-44ea-84e0-66d509f30658", APIVersion:"v1", ResourceVersion:"50952", FieldPath:""}): type: 'Normal' reason: 'ProvisioningSucceeded' Successfully provisioned volume pvc-8b1118e4-39b7-44ea-84e0-66d509f30658
```

The controller's `csi-provisioner` container above is responsible for making sure the PV gets created, but other containers may be responsible for other components. For example, the `ebs-plugin` container is responsible for making the actual EBS API calls to create and mount volumes and attaching the underlying Linux devices:

```bash
kubectl -n kube-system logs -f ebs-csi-controller-0 ebs-plugin
```

```sh
I0807 18:43:11.932954       1 controller.go:93] CreateVolume: called with args {Name:pvc-848a1291-238b-44c0-81c6-435ee2b7c05d CapacityRange:required_bytes:1073741824  VolumeCapabilities:[mount:<fs_type:"ext4" > access_mode:<mode:SINGLE_NODE_WRITER > ] Parameters:map[type:gp2] Secrets:map[] VolumeContentSource:<nil> AccessibilityRequirements:requisite:<segments:<key:"topology.ebs.csi.aws.com/zone" value:"us-west-2c" > > preferred:<segments:<key:"topology.ebs.csi.aws.com/zone" value:"us-west-2c" > >  XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
I0807 18:43:15.953064       1 controller.go:229] ControllerPublishVolume: called with args {VolumeId:vol-062a1d0e8d8657e29 NodeId:i-0630c41e683f2898f VolumeCapability:mount:<fs_type:"ext4" > access_mode:<mode:SINGLE_NODE_WRITER >  Readonly:false Secrets:map[] VolumeContext:map[storage.kubernetes.io/csiProvisionerIdentity:1596815338056-8081-ebs.csi.aws.com] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
I0807 18:43:16.628669       1 cloud.go:364] AttachVolume volume="vol-062a1d0e8d8657e29" instance="i-0630c41e683f2898f" request returned {
  AttachTime: 2020-08-07 18:43.16.694 +0000 UTC,
  Device: "/dev/xvdbe",
  InstanceId: "i-0630c41e683f2898f",
  State: "attaching",
  VolumeId: "vol-062a1d0e8d8657e29"
}
I0807 18:43:17.827727       1 manager.go:197] Releasing in-process attachment entry: /dev/xvdbe -> volume vol-062a1d0e8d8657e29
I0807 18:43:17.827754       1 controller.go:268] ControllerPublishVolume: volume vol-062a1d0e8d8657e29 attached to node i-0630c41e683f2898f through device /dev/xvdbe
```

After a few moments the relevant `Deployment`, `ReplicaSet`, `Pod` and `PersistentVolumeClaim` for your webserver should be ready:

```bash
kubectl get deployments,replicasets,pods,pvc
```

```sh
NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx-stateful   1/1     1            1           28m

NAME                                        DESIRED   CURRENT   READY   AGE
replicaset.apps/nginx-stateful-5bdc6968df   1         1         1       28m

NAME                                  READY   STATUS    RESTARTS   AGE
pod/nginx-stateful-5bdc6968df-5fqrq   1/1     Running   0          28m

NAME                               STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS           AGE
persistentvolumeclaim/nginx-data   Bound    pvc-8b1118e4-39b7-44ea-84e0-66d509f30658   1Gi        RWO            awsebscsiprovisioner   24m
```

At this point our webserver has storage mounted at `/usr/share/nginx/html` and can be used going forward, and you can see the PV that was created for it by running:

```bash
kubectl get pv $(kubectl get pvc nginx-data -o='go-template={{.spec.volumeName}}')
```

```sh
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                STORAGECLASS           REASON   AGE
pvc-8b1118e4-39b7-44ea-84e0-66d509f30658   1Gi        RWO            Delete           Bound    default/nginx-data   awsebscsiprovisioner            59m
```

##### Volume Deletion

**NOTE**: These examples assume you followed the above creation example and is written from the perspective of using the AWS Driver.

When using a driver the deletion of the Persistent Volumes is often an implicit side effect of deletion of the Persistent Volume Claim, so treat any operations (manual or automatic) as potential risks for data loss in your production strategies.

Similarly to what was seen in the above documentation on creating volumes, deletion follows the same process:

```bash
kubectl delete deployment nginx-stateful && kubectl delete pvc nginx-data
```

```sh
deployment.apps "nginx-stateful" deleted
persistentvolumeclaim "nginx-data" deleted
```

Under the hood deleting the claim removed the binding to the PV and the driver's provisioner triggered deletion of the PV:

```bash
kubectl -n kube-system logs -f ebs-csi-controller-0 ebs-plugin
```

```sh
I0807 18:40:36.259570       1 controller.go:211] DeleteVolume: called with args: {VolumeId:vol-0473776ae2aed3751 Secrets:map[] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
E0807 18:40:36.367028       1 driver.go:109] GRPC error: rpc error: code = Internal desc = Could not delete volume ID "vol-0473776ae2aed3751": DeleteDisk could not delete volume: VolumeInUse: Volume vol-0473776ae2aed3751 is currently attached to i-0630c41e683f2898f status code: 400, request id: bdf9c704-eee0-4817-8e1a-8d6c1c9750c8
I0807 18:40:37.370937       1 controller.go:211] DeleteVolume: called with args: {VolumeId:vol-0473776ae2aed3751 Secrets:map[] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
E0807 18:40:37.445017       1 driver.go:109] GRPC error: rpc error: code = Internal desc = Could not delete volume ID "vol-0473776ae2aed3751": DeleteDisk could not delete volume: VolumeInUse: Volume vol-0473776ae2aed3751 is currently attached to i-0630c41e683f2898f status code: 400, request id: f541f43c-6159-4402-85f3-da8a6b76e590
I0807 18:40:39.448782       1 controller.go:211] DeleteVolume: called with args: {VolumeId:vol-0473776ae2aed3751 Secrets:map[] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
E0807 18:40:39.529649       1 driver.go:109] GRPC error: rpc error: code = Internal desc = Could not delete volume ID "vol-0473776ae2aed3751": DeleteDisk could not delete volume: VolumeInUse: Volume vol-0473776ae2aed3751 is currently attached to i-0630c41e683f2898f status code: 400, request id: f3923f90-02bb-4253-8ce3-30ab1c3c1442
I0807 18:40:42.922691       1 controller.go:275] ControllerUnpublishVolume: called with args {VolumeId:vol-0473776ae2aed3751 NodeId:i-0630c41e683f2898f Secrets:map[] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
I0807 18:40:43.534599       1 controller.go:211] DeleteVolume: called with args: {VolumeId:vol-0473776ae2aed3751 Secrets:map[] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
E0807 18:40:43.567766       1 driver.go:109] GRPC error: rpc error: code = Internal desc = Could not delete volume ID "vol-0473776ae2aed3751": DeleteDisk could not delete volume: VolumeInUse: Volume vol-0473776ae2aed3751 is currently attached to i-0630c41e683f2898f status code: 400, request id: 99c5e2b3-b3b4-4e7f-9239-91daf05d2f78
I0807 18:40:46.289823       1 controller.go:292] ControllerUnpublishVolume: volume vol-0473776ae2aed3751 detached from node i-0630c41e683f2898f
I0807 18:40:51.571642       1 controller.go:211] DeleteVolume: called with args: {VolumeId:vol-0473776ae2aed3751 Secrets:map[] XXX_NoUnkeyedLiteral:{} XXX_unrecognized:[] XXX_sizecache:0}
```

## Critical Operational Considerations

After reviewing the above examples and **before you get started on any _production deployments_** ensure you understand whatever storage classes you are implementing with, and note some of the following key considerations that can help you to avoid downtime and datalass in production.

### AccessModes

Note from the previous PVC created some of the fields on the record:

```bash
kubectl get pvc
```

```sh
NAME         STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS           AGE
nginx-data   Bound    pvc-8b1118e4-39b7-44ea-84e0-66d509f30658   1Gi        RWO            awsebscsiprovisioner   7s
```

Note the `accessModes` for your PVC: in this case the AWS driver is in use and is backed by _block storage_ which has the characteristic of requiring `ReadWriteOnce` mode (RWO).

`ReadWriteOnce` PVCs can not be shared between multiple pods for high availability, and also can pose some fault tolerance concerns related to uptime: if the Kubernetes node where a PVC is bound to a pod gets disconnected from the rest of the cluster, the driver _may not_ be able to automatically reschedule the pod to another node and re-connect the storage quickly to avoid multiple pods writing to the same block device and rendering it corrupted (_some_ of this is driver specific as some drivers may react different to netsplits, but consider this a good rule of thumb to prepare for).

[aws-csi-driver]:https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[azure-csi-driver]:https://github.com/kubernetes-sigs/azuredisk-csi-driver
[csi]:https://github.com/container-storage-interface/spec
[csi-dev]:https://kubernetes-csi.github.io/docs/
[gcp-csi-driver]:https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver
[nginx]:https://www.nginx.com/
[portworx]:https://portworx.com
[portworxpartners]:https://portworx.com/partners/
[troubleshooting]:../troubleshooting
