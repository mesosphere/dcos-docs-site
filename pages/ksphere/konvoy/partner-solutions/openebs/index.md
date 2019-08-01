---
layout: layout.pug
navigationTitle: OpenEBS
title: OpenEBS
excerpt: OpenEBS Storage Provider
menuWeight: 110
category: Storage
image: img/openebs.png
---

OpenEBS is the leading open-source project for container-attached and container-native storage on Kubernetes. OpenEBS adopts Container Attached Storage (CAS) approach, where each workload is provided with a dedicated storage controller. OpenEBS implements granular storage policies and isolation that enable users to optimize storage for each specific workload. OpenEBS runs in user space and does not have any Linux kernel module dependencies.

## quick start

The following shows how you can setup `Konvoy` with `OpenEBS` with `cStor Engine` as the default persistent storage provider. The setup described here is suitable for a dev test cluster. For production setup considerations follow the links in the information section.

### install

Installing Konvoy with a different persistent storage provider currently requires a three phase install.

1. `konvoy up` with addons that don't require persistent storage
1. install storage provider
1. `konvoy up` with addons that require persistent storage

#### (1) `konvoy up` with addons that don't require persistent storage

First run `konvoy init` so that you get the `cluster.yaml` file.
```
konvoy init --provisioner=aws
```

In the `cluster.yaml` file `disable` all aws ebs/storage addons, and all addons that require persistent storage.

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

Next, install the Konvoy cluster.
```
konvoy up
```

Once the cluster is up apply the `kubeconfig` and make sure that you can interact with it using `kubectl`.
```
konvoy apply kubeconfig
```

#### (2) install storage provider

Installing the OpenEBS storage provider requires to do the following steps

* install storage provider prerequisites
* install additional worker disks
* install the storage provider operator
* create cstor storage pools
* create default storage class

##### install storage provider prerequisites

The OpenEBS storage provider requires that the `iSCSI client` runs on all worker nodes. Use the following script to install and start the iSCSI client.

**Note:** The script requires the `aws cli` and `jq` commands to be installed. On `Mac OS X` both can be installed using `brew`.

```sh
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

##### install additional worker disks

In this step, we create and attach an `additional disk` to be used by OpenEBS to each worker node. Use the following script to create and attach the disks.

**Note:** The script requires the `aws cli` and `jq` commands to be installed. On `Mac OS X` both can be installed using `brew`.

```sh
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

##### install the storage provider operator

First get the latest `openebs-operator-x.y.z.yaml` file.

```
curl -O https://openebs.github.io/charts/openebs-operator-1.0.0.yaml
```

Edit the `filter configuration` for the `node device manager` in the `openebs-operator-x.y.z.yaml` file to the following.

**Note:** The devices that the worker nodes have attached from the Konvoy install, here `/dev/nvme0n1,/dev/nvme1n1`, maybe different in your case. You can find out the device names by ssh'ing into one of the worker nodes and using the `lsblk` command.

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

Next, we install the storage provider operator.
```
kubectl apply -f openebs-operator-1.0.0.yaml
```

##### create openebs cstor storage pools

Installing the operator in the previous step will also install `ndm` (Node Disk Manager). `ndm` detects the unclaimed storage devices and represents them using the the CR called `blockdevice`.
Get the list of blockdevices in your cluster.

```sh
kubectl get blockdevices -n openebs
```
The output will be similar to the following.

```
NAME                                           SIZE          CLAIMSTATE   STATUS   AGE
blockdevice-1c10eb1bb14c94f02a00373f2fa09b93   42949672960   Unclaimed    Active   1m
blockdevice-77f834edba45b03318d9de5b79af0734   42949672960   Unclaimed    Active   1m
blockdevice-936911c5c9b0218ed59e64009cc83c8f   42949672960   Unclaimed    Active   1m
```

Now, create a `StoragePoolClaim` configuration after replacing the `blockdevice` names listed under `blockDeviceList` section from the output `kubectl get blockdevices -n openebs` command.

```sh
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

##### create a default storage class

In this step, we create a `storage class` named `openebs-cstor-default`. This `storage class` will use the `storage pool` created out of `blockdevices` we have specified with an additional annotation that makes it the default storage class for the konvoy cluster.

```sh
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

Next we can do a quick verification creating a persistent volume claim and a pod using it.

```sh
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

If all things work fine, the pod created should be up and running, and data should be written to `/data/output` on the volume.

#### (3) `konvoy up` with addons that require persistent storage

In the `cluster.yaml` file `enable` all addons that require persistent storage.

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

Next, update the Konvoy cluster.
```
konvoy up
```

When complete you should see in the addons listed also those that require persistent storage, e.g prometheus, elasticsearch, ... .

### verify

First, check that in the `kubeaddons` and `velero` namespaces all persistent volume claims got created successfully.

Next, launch from the ops portal graphana or kibana and see that you actually get data.

## information

#### documentation

* [openebs documentation](https://docs.openebs.io/)
* [openebs user guides](https://docs.openebs.io/docs/next/quickstart.html)


#### release notes

* [openebs release notes](https://github.com/openebs/openebs/releases)

#### license

* [openebs license](https://github.com/openebs/openebs/blob/master/LICENSE)

#### maintenance & support

* [openebs issues](https://github.com/openebs/openebs/issues)
* [openebs slack](https://openebs.io/join-our-slack-community)
* [openebs enterprise support](https://mayadata.io)
