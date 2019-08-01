---
layout: layout.pug
navigationTitle: Provision a static local volume
title: Provision a static local volume
menuWeight: 15
excerpt: Learn how to provision a static local volume for a Konvoy cluster
enterprise: false
---

The `localvolumeprovisioner` addon uses the [local volume static provisioner](https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner) to manage persistent volumes for pre-allocated disks.
It does this by watching the `/mnt/disks` folder on each host and creating persistent volumes in the `localvolumeprovisioner` storage class for each disk that is discovered in this folder.
Persistent volumes with a 'Filesystem' volume-mode are discovered if they are mounted under `/mnt/disks`, persistent volumes with a 'Block' volume-mode are discovered if a symbolic link to the block device is created in `/mnt/disks`.

# Prerequisites

A provisioned `konvoy` cluster that is configured to use the `localvolumeprovisioner` addon.
I.e., `konvoy provision` have been run, but Kubernetes and the addons aren't deployed yet.
This is important, because other addons might depend on the storage class provided by the `localvolumeprovisioner` addon and might fail to start if it isn't configured yet.

```bash
konvoy provision
```

# 1. Provision a volume

The local volume provisioner watches for mounts in `/mnt/disks` on each host.
For this example we'll mount a `tmpfs` volume with `ansible`, using the inventory provided by `konvoy`:

```bash
ansible -i inventory.yaml node -m shell -a "mkdir -p /mnt/disks/example-volume && mount -t tmpfs example-volume /mnt/disks/example-volume"
```

The `konvoy` installation can be completed now.

```bash
konvoy up
```

This volume is detected by the provisioner and added as persistent volume to the `localvolumeprovisioner` storage class.

```bash
$ kubectl get pv
NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS             REASON   AGE
local-pv-4c7fc8ba   3986Mi     RWO            Delete           Available           localvolumeprovisioner            2s
```

# 2. Claim the available persistent volume

This persistent volume can be claimed with a persistent volume claim.

```bash
$ cat <<EOF | kubectl create -f -
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: example-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 100Mi
  storageClassName: localvolumeprovisioner
EOF
```

This claim can then get referenced in pods.

```bash
$ cat <<EOF | kubectl create -f -
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-persistent-volume
spec:
  containers:
    - name: frontend
      image: nginx
      volumeMounts:
        - name: data
          mountPath: "/var/www/html"
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: example-claim
EOF
```

```bash
$ kubectl get pvc
NAME            STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS             AGE
example-claim   Bound    local-pv-4c7fc8ba   3986Mi     RWO            localvolumeprovisioner   78s
$ kubectl get pv
NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM                   STORAGECLASS             REASON   AGE
local-pv-4c7fc8ba   3986Mi     RWO            Delete           Bound       default/example-claim   localvolumeprovisioner            15m
```

Once the resource provider claim is released, the volume will be deleted.
