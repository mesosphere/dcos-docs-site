---
layout: layout.pug
navigationTitle: OpenEBS
title: OpenEBS
excerpt: OpenEBS Storage Provider
menuWeight: 110
category: Storage
image: img/openebs.png
---
# OpenEBS

OpenEBS is the leading open-source project for container-attached and container-native storage on Kubernetes. OpenEBS adopts a Container Attached Storage (CAS) approach, where each workload is provided with a dedicated storage controller. OpenEBS implements granular storage policies and isolation that enables users to optimize storage for each specific workload. 

OpenEBS runs in user space and does not have any Linux kernel module dependencies.

## Quick Start

The following shows how you can set up `Konvoy` with `OpenEBS`, using `cStor Engine` as the default persistent storage provider. The setup described here is suitable for a development test cluster. For production setup configuration, follow the links in the information section.

### Install

Installing Konvoy with a different persistent storage provider currently requires a three phase install.

1. `konvoy up` with add-ons that don't require persistent storage
1. install storage provider
1. `konvoy up` with add-ons that require persistent storage

#### Run `konvoy up` with Add-Ons not Requiring Persistent Storage

1. Run `konvoy init` so that you get the `cluster.yaml` file.
    ```bash
    konvoy init --provisioner=aws
    ```

1. In the `cluster.yaml` file, `disable` all aws ebs/storage add-ons, and all add-ons that require persistent storage.

    ```yaml
    ...
    addons:
      configVersion: v0.0.45
      addonsList:
      - name: awsebscsiprovisioner
        enabled: false
      - name: awsebsprovisioner
        enabled: false
      - name: dashboard
        enabled: true
      - name: dex
        enabled: true
      - name: dex-k8s-authenticator
        enabled: true
      - name: elasticsearch
        enabled: false
      - name: elasticsearchexporter
        enabled: false
      - name: fluentbit
        enabled: false
      - name: helm
        enabled: true
      - name: kibana
        enabled: false
      - name: kommander
        enabled: true
      - name: konvoy-ui
        enabled: true
      - name: localvolumeprovisioner
        enabled: false
      - name: opsportal
        enabled: true
      - name: prometheus
        enabled: false
      - name: prometheusadapter
        enabled: false
      - name: traefik
        enabled: true
      - name: traefik-forward-auth
        enabled: true
      - name: velero
        enabled: false
    ...
    ```

1. Install the Konvoy cluster.
    ```bash
    konvoy up
    ```

    Once the cluster is up apply the `kubeconfig` and make sure that you can interact with it using `kubectl`.
    ```bash
    konvoy apply kubeconfig
    ```

#### Install Storage Provider

Installing the OpenEBS storage provider requires you to do the following steps:

* install storage provider prerequisites
* install additional worker disks
* install the storage provider operator
* create cstor storage pools
* create default storage class

##### Install Storage Provider Prerequisites

The OpenEBS storage provider requires that the `iSCSI client` runs on all worker nodes. 

1. Use the following script to install and start the iSCSI client.

    <p class="message--note"><strong>NOTE: </strong> The script requires that the <tt>aws cli</tt> and <tt>jq</tt> commands must be installed. On Mac OS X, both can be installed using `brew`.</p>

    ```bsh
    CLUSTER=... # name of your cluster, its the prefix used for worker nodes, check in ec2 console
    REGION=us-west-2
    KEY_FILE=... # path to private key file in folder where you ran konvoy -up


    IPS=$(aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.PublicIpAddress] | join(\" \")")

    for ip in $IPS; do
      echo $ip
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo yum install iscsi-initiator-utils -y
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl enable iscsid
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl start iscsid
      ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip cat /etc/iscsi/initiatorname.iscsi
    done
    ```

##### Install Additional Worker Disks

In this step, we create and attach an `additional disk` to be used by OpenEBS to each worker node. 

1. Use the following script to create and attach the disks.

    <p class="message--note"><strong>NOTE: </strong> The script requires that the <tt>aws cli</tt> and <tt>jq</tt> commands must be installed. On Mac OS X, both can be installed using `brew`.</p>

    ```bash
    export CLUSTER=... # name of your cluster, its the prefix used for worker nodes, check in ec2 console
    export REGION=us-west-2
    export DISK_SIZE=150


    aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.InstanceId, .Placement.AvailabilityZone] | \"\(.[0]) \(.[1])\"" | while read instance zone; do
      echo $instance $zone
      volume=$(aws --region=$REGION ec2 create-volume --size=$DISK_SIZE --volume-type gp2 --availability-zone=$zone --tag-specifications="ResourceType=volume,Tags=[{Key=string,Value=$CLUSTER}, {Key=owner,Value=michaelbeisiegel}]" | jq --raw-output .VolumeId)
      sleep 10
      aws --region=$REGION ec2 attach-volume --device=/dev/xvdc --instance-id=$instance --volume-id=$volume
    done
    ```

##### Install the Storage Provider Operator

1. Get the latest `openebs-operator-x.y.z.yaml` file.

    ```bash
    curl -O https://openebs.github.io/charts/openebs-operator-1.0.0.yaml
    ```

1. Edit the `filter configuration` for the `node device manager` in the `openebs-operator-x.y.z.yaml` file to the following.

    <p class="message--note"><strong>NOTE: </strong> The devices that the worker nodes have attached from the Konvoy install, here <tt>/dev/nvme0n1,/dev/nvme1n1</tt>, may be different in your case. You can find out the device names by SSHing into one of the worker nodes and using the <tt>lsblk</tt> command.</p>

    ```
    ...
    filterconfigs:
      - key: vendor-filter
        name: vendor filter
        state: true
        include: ""
        exclude: "CLOUDBYT,OpenEBS"
      - key: path-filter
        name: path filter
        state: true
        include: ""
        exclude: "loop,/dev/fd0,/dev/sr0,/dev/ram,/dev/dm-,/dev/md,/dev/nvme0n1,/dev/nvme1n1"
    ...    
    ```

1. Install the storage provider operator.
    ```bash
    kubectl apply -f openebs-operator-1.0.0.yaml
    ```

##### Create OpenEBS Cstor Storage Pools

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
    ```

1. Create a `StoragePoolClaim` configuration after replacing the `blockdevice` names listed under `blockDeviceList` section from the output `kubectl get blockdevices -n openebs` command.

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
    EOF
    ```

##### Create a Default Storage Class

1. In this step, we create a `storage class` named `openebs-cstor-default`. This `storage class` will use the `storage pool` created out of `blockdevices` we have specified with an additional annotation that makes it the default storage class for the konvoy cluster.

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

If all things work correctly, the pod created should be up and running, and data should be written to `/data/output` on the volume.

#### Run `konvoy up` with Add-Ons Requiring Persistent Storage

1. In the `cluster.yaml` file, enable all add-ons that require persistent storage.

    ```yaml
    ...
    addons:
      configVersion: v0.0.45
      addonsList:
      - name: awsebscsiprovisioner
        enabled: false
      - name: awsebsprovisioner
        enabled: false
      - name: dashboard
        enabled: true
      - name: dex
        enabled: true
      - name: dex-k8s-authenticator
        enabled: true
      - name: elasticsearch
        enabled: true
      - name: elasticsearchexporter
        enabled: true
      - name: fluentbit
        enabled: true
      - name: helm
        enabled: true
      - name: kibana
        enabled: true
      - name: kommander
        enabled: true
      - name: konvoy-ui
        enabled: true
      - name: localvolumeprovisioner
        enabled: false
      - name: opsportal
        enabled: true
      - name: prometheus
        enabled: true
      - name: prometheusadapter
        enabled: true
      - name: traefik
        enabled: true
      - name: traefik-forward-auth
        enabled: true
      - name: velero
        enabled: true
    ...
    ```

1. Update the Konvoy cluster.
    ```bash
    konvoy up
    ```

When complete you should see in the add-ons listed also those that require persistent storage, e.g prometheus, elasticsearch, ... .

### Verify

1. Check that in the `kubeaddons` and `velero` namespaces all persistent volume claims got created successfully.

1. Launch from the ops portal graphana or kibana and see that you actually get data.

## Information

### Documentation

* [openebs documentation](https://docs.openebs.io/)
* [openebs user guides](https://docs.openebs.io/docs/next/quickstart.html)


### Release Notes

* [OpenEBS release notes](https://github.com/openebs/openebs/releases)

#### Licensing

* [OpenEBS license](https://github.com/openebs/openebs/blob/master/LICENSE)

### Maintenance & Support

* [OpenEBS issues](https://github.com/openebs/openebs/issues)
* [OpenEBS slack](https://openebs.io/join-our-slack-community)
* [OpenEBS enterprise support](https://mayadata.io)
