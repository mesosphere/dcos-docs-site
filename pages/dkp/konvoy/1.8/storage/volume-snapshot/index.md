---
layout: layout.pug
navigationTitle: Volume Snapshots
title: Volume Snapshots
menuWeight: 14
excerpt: Create Persistent Volume Snapshots
beta: false
enterprise: false
---

<!-- markdownlint-disable MD030 -->

This procedure shows how to create Persistent Volume Snapshots. Read more about this feature in the [official Kubernetes documentation][volume-snapshots].

## Before you begin

The following items and configurations are required for this procedure:

- Kubernetes version 1.19.x or higher

- Konvoy version 1.7.x or higher

- [CSI driver](../intro-csi) that supports volume snapshots

## Limitations

- Only some CSI drivers support snapshots if underlying platform supports it

## Setup Volume Snapshot Class

As `StorageClass` provides a way for administrators to describe the "classes" of storage they offer when provisioning a volume, `VolumeSnapshotClass` provides a way to describe the "classes" of storage when provisioning a volume snapshot.
You can read more about the different options in [this document][volume-snapshot-classes].

The `VolumeSnapshotClass` depends on the infrastructure provider you are using. Refer to the sections below for the appropriate one.

### AWS

Refer to the AWS EBS CSI [documentation][aws-ebs-snapshots].

```yaml
cat << EOF | kubectl apply -f -
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: csi-vsc
driver: ebs.csi.aws.com
deletionPolicy: Delete
EOF
```

### Azure

Refer to the Azure CSI [documentation][azure-snapshots].

```yaml
cat << EOF | kubectl apply -f -
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: csi-vsc
driver: disk.csi.azure.com
deletionPolicy: Delete
parameters:
  incremental: "true"  # available values: "true", "false" ("true" by default)
EOF
```

### GCP

Refer to the GCP CSI [documentation][gcp-snapshots].

```yaml
cat << EOF | kubectl apply -f -
apiVersion: snapshot.storage.k8s.io/v1beta1
kind: VolumeSnapshotClass
metadata:
  name: csi-vsc
driver: pd.csi.storage.gke.io
deletionPolicy: Delete
EOF
```

## Test Volume Snapshots

1.  Create a new `PersistentVolumeClaim`:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: snapshot-claim
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 4Gi
    EOF
    ```

1.  Create a sample app using the `persistentVolumeClaim`:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
      name: app
    spec:
      containers:
      - name: app
        image: centos
        command: ["/bin/sh"]
        args: ["-c", "while true; do echo \$(date -u) >> /data/out.txt; sleep 5; done"]
        volumeMounts:
        - name: persistent-storage
          mountPath: /data
      volumes:
      - name: persistent-storage
        persistentVolumeClaim:
          claimName: snapshot-claim
    EOF
    ```

1.  Validate the pod successfully wrote data to the volume. Note the timestamp of the first entry:

    ```bash
    kubectl exec -it app -- cat /data/out.txt
    ```

    The output should look similar to:

    ```text
    Tue Aug 18 15:00:58 UTC 2020
    Tue Aug 18 15:01:03 UTC 2020
    Tue Aug 18 15:01:08 UTC 2020
    ```

1.  Create a `VolumeSnapshot` referencing the `PersistentVolumeClaim` name:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: snapshot.storage.k8s.io/v1beta1
    kind: VolumeSnapshot
    metadata:
      name: volume-snapshot
    spec:
      volumeSnapshotClassName: csi-vsc
      source:
        persistentVolumeClaimName: snapshot-claim
    EOF
    ```

1.  Wait for the `READYTOUSE: true` attribute of the `VolumeSnapshot`:

    ```bash
    kubectl get volumesnapshot volume-snapshot -w
    ```

1. Delete the existing app and `PersistentVolumeClaim`:

   ```bash
   kubectl delete pod app && kubectl delete pvc snapshot-claim
   ```

1. Restore a volume from the snapshot with a `PersistentVolumeClaim` referencing the `VolumeSnapshot` in its `dataSource`:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: snapshot-restored-claim
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 4Gi
      dataSource:
        name: volume-snapshot
        kind: VolumeSnapshot
        apiGroup: snapshot.storage.k8s.io
    EOF
    ```

1.  Create another sample app using the restored `persistentVolumeClaim`:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: v1
    kind: Pod
    metadata:
      name: app
    spec:
      containers:
      - name: app
        image: centos
        command: ["/bin/sh"]
        args: ["-c", "while true; do echo \$(date -u) >> /data/out.txt; sleep 5; done"]
        volumeMounts:
        - name: persistent-storage
          mountPath: /data
      volumes:
      - name: persistent-storage
        persistentVolumeClaim:
          claimName: snapshot-restored-claim
    EOF
    ```

1.  Validate the new pod has the restored data by comparing the timestamp of the first entry to that of in step 3:

    ```bash
    kubectl exec -it app -- cat /data/out.txt
    ```

    The output should look similar to:

    ```text
    Tue Aug 18 15:00:58 UTC 2020
    Tue Aug 18 15:01:03 UTC 2020
    Tue Aug 18 15:01:08 UTC 2020
    ...
    Tue Aug 18 15:05:40 UTC 2020
    Tue Aug 18 15:05:45 UTC 2020
    ```

1.  Delete the app, `PersistentVolumeClaim` and `VolumeSnapshot` :

    ```bash
    kubectl delete pod app && kubectl delete pvc snapshot-restored-claim && kubectl delete volumesnapshot volume-snapshot
    ```

1.  Delete the `VolumeSnapshotClass`:

    ```bash
    kubectl delete volumesnapshotclass csi-vsc
    ```

[volume-snapshots]: https://kubernetes.io/docs/concepts/storage/volume-snapshots/
[volume-snapshot-classes]: https://kubernetes.io/docs/concepts/storage/volume-snapshot-classes/
[aws-ebs-snapshots]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver/blob/master/examples/kubernetes/snapshot/README.md
[azure-snapshots]: https://github.com/kubernetes-sigs/azuredisk-csi-driver/tree/master/deploy/example/snapshot
[gcp-snapshots]: https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver/blob/master/docs/kubernetes/user-guides/snapshots.md
