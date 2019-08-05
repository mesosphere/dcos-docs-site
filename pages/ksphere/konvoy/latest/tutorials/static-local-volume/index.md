---
layout: layout.pug
navigationTitle: Provision a static local volume
title: Provision a static local volume
menuWeight: 15
excerpt: Learn how to provision a static local volume for a Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

The `localvolumeprovisioner` addon uses the [local volume static provisioner][localstorage] to manage persistent volumes for pre-allocated disks.
It does this by watching the `/mnt/disks` folder on each host and creating persistent volumes in the `localvolumeprovisioner` storage class for each disk that is discovered in this folder.

- Persistent volumes with a 'Filesystem' volume-mode are discovered if they are mounted under `/mnt/disks`.

- Persistent volumes with a 'Block' volume-mode are discovered if a symbolic link to the block device is created in `/mnt/disks`.

# Before you begin

Before starting this tutorial, you should verify the following:

- You have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You have a provisioned `konvoy` cluster that is configured to use the `localvolumeprovisioner` addon, but have not any addons to the cluster.

  For this tutorial, you **should not deploy** using all of the default settings as described in the [Quick start][quickstart].

  This distinction between provisioning and deployment is important because some addons might depend on the storage class provided by the `localvolumeprovisioner` addon and might fail to start if it isn't configured yet.

## Provision the cluster and a volume

1. Provision the Kubernetes cluster without deploying addons by running the following command:

    ```bash
    konvoy provision
    ```

1. Provision the local volume provisioner to watch for mounts in `/mnt/disks` on each host.

    For example, mount a `tmpfs` volume with `ansible` using the `inventory.yaml` provided by `konvoy` by running the following command:

    ```bash
    ansible -i inventory.yaml node -m shell -a "mkdir -p /mnt/disks/example-volume && mount -t tmpfs example-volume /mnt/disks/example-volume"
    ```

1. Deploy the `konvoy` cluster with addons by running the following command:

    ```bash
    konvoy up
    ```

    When you run this command, the local volume provisioned detects the `example-volume` volume and adds it as a persistent volume to the `localvolumeprovisioner` storage class.

1. Verify the persisten volume by running the following command:

    ```bash
    kubectl get pv
    ```

    The command displays output similar to the following:

    ```bash
    NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS             REASON   AGE
    local-pv-4c7fc8ba   3986Mi     RWO            Delete           Available           localvolumeprovisioner            2s
    ```

1. Claim the persistent volume using PersistentVolumeClaim settings by running the following command:

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

1. Reference the persistent volume claim in pods by running the following command:

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

1. Verify the persistent volume claim by running the following command:

    ```bash
    kubectl get pvc
    ```

    The command displays output similar to the following:

    ```bash
    NAME            STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS             AGE
    example-claim   Bound    local-pv-4c7fc8ba   3986Mi     RWO            localvolumeprovisioner   78s
    $ kubectl get pv
    NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM                   STORAGECLASS             REASON   AGE
    local-pv-4c7fc8ba   3986Mi     RWO            Delete           Bound       default/example-claim   localvolumeprovisioner            15m
    ```

When the resource provider claim is released, the volume is deleted.

[localstorage]:https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[quickstart]:../../quickstart/
