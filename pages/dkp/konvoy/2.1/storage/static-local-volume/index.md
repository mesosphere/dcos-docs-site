---
layout: layout.pug
navigationTitle: Provision a static local volume
title: Provision a static local volume
menuWeight: 15
excerpt: Learn how to provision a static local volume for a Konvoy cluster
beta: false
enterprise: false
---

The `localvolumeprovisioner` component uses the [local volume static provisioner][localstorage] to manage persistent volumes for pre-allocated disks.
It does this by watching the `/mnt/disks` folder on each host and creating persistent volumes in the `localvolumeprovisioner` storage class for each disk that it discovers in this folder.

-   Persistent volumes with a 'Filesystem' volume-mode are discovered if you mount them under `/mnt/disks`.

-   Persistent volumes with a 'Block' volume-mode are discovered if you create a symbolic link to the block device in `/mnt/disks`.

## Before you begin

Before starting this tutorial, verify the following:

-   You have access to a Linux, macOS, or Windows computer with a supported operating system version.

-   You have a provisioned `dkp` cluster that uses the `localvolumeprovisioner` platform application, but have not added any other Kommander applications to the cluster yet.

For this tutorial, you **do not deploy** using all the default settings as described in the [Quick start guide][quickstart].

This distinction between provisioning and deployment is important because some applications depend on the storage class provided by the `localvolumeprovisioner` component and can fail to start if it is not configured yet.

### Provision the cluster and a volume

1.  Create a pre-provisioned cluster by following the steps outlined [in the choose pre-provisioned infrastructure topic][preprovision].

    As volumes are created/mounted on the nodes, the local volume provisioner detects each volume in the `/mnt/disks` directory and adds it as a persistent volume with the `localvolumeprovisioner` storage class.

1.  Create at least one volume in `/mnt/disks` on each host.

    For example, mount a `tmpfs` volume:

    ```bash
    mkdir -p /mnt/disks/example-volume && mount -t tmpfs example-volume /mnt/disks/example-volume
    ```

1.  Verify the persistent volume by running the following command:

    ```bash
    kubectl get pv
    ```

    The command displays output similar to the following:

    ```sh
    NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS             REASON   AGE
    local-pv-4c7fc8ba   3986Mi     RWO            Delete           Available           localvolumeprovisioner            2s
    ```

1.  Claim the persistent volume using a PersistentVolumeClaim, by running the following command:

    ```yaml
    cat <<EOF | kubectl create -f -
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

1.  Reference the persistent volume claim in a pod by running the following command:

    ```yaml
    cat <<EOF | kubectl create -f -
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

1.  Verify the persistent volume claim by running the following command:

    ```bash
    kubectl get pvc
    ```

    The command displays output similar to the following:

    ```sh
    NAME            STATUS   VOLUME              CAPACITY   ACCESS MODES   STORAGECLASS             AGE
    example-claim   Bound    local-pv-4c7fc8ba   3986Mi     RWO            localvolumeprovisioner   78s
	```
	       
	```sh
	NAME                CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM                   STORAGECLASS             REASON   AGE
    local-pv-4c7fc8ba   3986Mi     RWO            Delete           Bound       default/example-claim   localvolumeprovisioner            15m
    ```

Upon deletion of the persistent volume claim, the corresponding persistent volume resource uses the "Delete" reclaim policy, which removes all data on the volume.

[localstorage]:https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[preprovision]: ../../choose-infrastructure/pre-provisioned
[quickstart]:../../choose-infrastructure/aws/quick-start-aws/
