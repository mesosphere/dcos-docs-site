---
layout: layout.pug
navigationTitle: Use OpenEBS for persistent volumes
title: Use OpenEBS for persistent volumes
menuWeight: 22
excerpt: Learn how to use OpenEBS for persistent volume storage
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

OpenEBS is the leading open-source project for container-attached and container-native storage on Kubernetes. OpenEBS adopts Container Attached Storage (CAS) approach, where each workload is provided with a dedicated storage controller. OpenEBS implements granular storage policies and isolation that enable users to optimize storage for each specific workload. OpenEBS runs in user space and does not have any Linux kernel module dependencies.

This tutorial demonstrates how to leverage OpenEBS to provide persistent volumes for applications running on a Konvoy cluster.

## Before you begin

Before starting this tutorial, you should verify the following:

- You must have access to a Linux, macOS, or Windows computer with a supported operating system version.

- You must have `aws cli` and `jq` commands installed. On `Mac OS X` both can be installed using `brew`.

- You must have a properly deployed and running cluster. For information about deploying Kubernetes with default settings, see the [Quick start][quickstart].

## Set environment variables

1. Update the following environment variables:

    ```bash
    export CLUSTER=... # name of your cluster, its the prefix used for worker nodes, check in ec2 console
    export REGION=us-west-2
    export KEY_FILE=... # path to private key file in folder where you ran konvoy -up
    export DISK_SIZE=50
    ```

## Install OpenEBS prerequisites

The OpenEBS storage provider requires that the `iSCSI client` runs on all worker nodes. Use the following script to install and start the iSCSI client.

1. Execute the script to install and run `iSCSI client` on all worker nodes:

    ```bash
    IPS=$(aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.PublicIpAddress] | join(\" \")")
    
    for ip in $IPS; do
      echo $ip
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo yum install iscsi-initiator-utils -y
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl enable iscsid
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl start iscsid
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip cat /etc/iscsi/initiatorname.iscsi
    done
    ```

## Add additional worker disks

1. Execute the script to create and attach `50GB` Amazon Elastic Block Storage (EBS) volume to each Kubelet.

    ```bash
    aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.InstanceId, .Placement.AvailabilityZone] | \"\(.[0]) \(.[1])\"" | while read instance zone; do
      echo $instance $zone
      volume=$(aws --region=$REGION ec2 create-volume --size=$DISK_SIZE --volume-type gp2 --availability-zone=$zone --tag-specifications="ResourceType=volume,Tags=[{Key=string,Value=$CLUSTER}, {Key=owner,Value=michaelbeisiegel}]" | jq --raw-output .VolumeId)
      sleep 10
      aws --region=$REGION ec2 attach-volume --device=/dev/xvdc --instance-id=$instance --volume-id=$volume
    done
    ```

## Deploy OpenEBS

Before you can use OpenEBS to provide persistent volume storage for pods running on your Kubernetes cluster, you must deploy it.

1. Deploy OpenEBS on the Kubernetes cluster by running the following command:

    ```bash
    kubectl apply -f https://openebs.github.io/charts/openebs-operator.yaml
    ```

1. Verify the list of pods available in the `openebs` namespace by running the following command:

    ```bash
    kubectl get pods --n openebs 
    ```

### Create OpenEBS cStor storage pools

OpenEBS provides multiple storage engines such as Jiva, cStor and LocalPV Provisioner for different use cases. If you want use additional disks (local disks or EBS) and create pools out of disks attached to your worker nodes it is recommended to use cStor Storage Engine.

Installing the operator in the previous step will also install `ndm` (Node Disk Manager). `ndm` detects the unclaimed storage devices and represents them using the the CR called `blockdevice`.

1. Get the list of blockdevices in your cluster.

    ```bash
    kubectl get blockdevices -n openebs
    ```
   The output will be similar to the following.

    ```bash
    NAME                                           SIZE          CLAIMSTATE   STATUS   AGE
    blockdevice-1c10eb1bb14c94f02a00373f2fa09b93   42949672960   Unclaimed    Active   1m
    blockdevice-77f834edba45b03318d9de5b79af0734   42949672960   Unclaimed    Active   1m
    blockdevice-936911c5c9b0218ed59e64009cc83c8f   42949672960   Unclaimed    Active   1m
    blockdevice-47383318d9de53294d59e64009318d9d   42949672960   Unclaimed    Active   1m
    ```

1. Now, create a `StoragePoolClaim` configuration after replacing the `blockdevice` names listed under `blockDeviceList` section from the output `kubectl get blockdevices -n openebs` command.

    ```bash
    cat <<EOF | kubectl apply -f -
    kind: StoragePoolClaim
    apiVersion: openebs.io/v1alpha1
    metadata:
      name: cstor-disk-pool
      annotations:
        cas.openebs.io/config: |
          - name: PoolResourceRequests
            value: |-
                memory: 2Gi
          - name: PoolResourceLimits
            value: |-
                memory: 4Gi
    spec:
      name: cstor-disk-pool
      type: disk
      poolSpec:
        poolType: striped
      blockDevices:
        blockDeviceList:
        - blockdevice-936911c5c9b0218ed59e64009cc83c8f
        - blockdevice-77f834edba45b03318d9de5b79af0734
        - blockdevice-1c10eb1bb14c94f02a00373f2fa09b93
        - blockdevice-47383318d9de53294d59e64009318d9d
    EOF
    ```

## Create the OpenEBS storage class

In this step, we create a `storage class` named `openebs-cstor-default`. This `storage class` will use the `storage pool` created out of `blockdevices` we have specified with an additional annotation that makes it the default storage class for the Konvoy cluster.

1. Create the Kubernetes `StorageClass` by running the following command:

    ```bash
    cat <<EOF | kubectl apply -f -
    kind: StorageClass
    apiVersion: storage.k8s.io/v1
    metadata:
      name: openebs-cstor-default
      annotations:
        openebs.io/cas-type: cstor    
        cas.openebs.io/config: |
          - name: StoragePoolClaim
            value: "cstor-disk-pool"
          - name: ReplicaCount
            value: "3"
        storageclass.kubernetes.io/is-default-class: 'true'
    provisioner: openebs.io/provisioner-iscsi
    EOF
    ```
    
    This command creates a volume on OpenEBS with three replicas.

## Verify storage provider

1. Do a quick verification creating a persistent volume claim and a pod using it.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: pvc-test
    spec:
      accessModes:
        - ReadWriteOnce
      resources:
        requests:
          storage: 1Gi
    ---
    kind: Pod
    apiVersion: v1
    metadata:
      name: pod-pv-test
    spec:
      volumes:
        - name: pv-test
          persistentVolumeClaim:
            claimName: pvc-test
      containers:
       - name: test
         image: centos
         command: ["/bin/sh"]
         args: ["-c", "while true; do echo \">>> \"$(date) >> /data/output; sleep 10; done"]
         volumeMounts:
           - mountPath: "/data"
             name: pv-test
    EOF
    ```

1. Check the status of the `PersistentVolumeClaim` by running the following command:

    ```bash
    kubectl describe pvc pv-test
    ```

[quickstart]:../../quick-start/
