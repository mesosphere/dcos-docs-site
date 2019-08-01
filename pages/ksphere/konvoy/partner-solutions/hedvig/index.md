---
layout: layout.pug
navigationTitle: Hedvig
title: Hedvig
excerpt: Hedvig Storage Provider
menuWeight: 60
category: Storage
image: img/hedvig.png
---

The Hedvig Distributed Storage Platform provides a modern software solution that lets you tailor a flexible and efficient data management system built on industry-standard x86 server hardware to support any application, hypervisor, container, or cloud.

## quick start

The following shows how you can setup `Konvoy` with `Hedvig` as the default persistent storage provider.

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

The `Hedvig daemonset` installed in the following has the following `resources requirements`, set a `worker instance type` in `cluster.yaml` accordingly.

```
resources:
  requests:
    memory: "4Gi"
    cpu: "2"
  limits:
    memory: "8Gi"
    cpu: "4"
```

Next install the Konvoy cluster.
```
konvoy up
```

Once the cluster is up apply the `kubeconfig` and make sure that you can interact with it using `kubectl`.
```
konvoy apply kubeconfig
```

#### (2) install storage provider

Installing the `Hedvig` storage provider requires to do the following steps

* install storage provider prerequisites
* install the storage provider operator
* create default storage class

##### install storage provider prerequisites

Hedvig Storage Cluster (Hedvig 3.0 or later) has to be installed as a peer to Konvoy. Ensure that the Konvoy worker nodes and the Hedvig Storage Cluster Nodes can communicate with each other.

The Hedvig storage provider requires that a bunch of linux native prerequisites run on all worker nodes. Use the following script to install the prerequisites.

**Note:** The script requires the `aws cli` and `jq` commands to be installed. On `Mac OS X` both can be installed using `brew`.

```sh
CLUSTER=... # name of your cluster, its the prefix used for worker nodes, check in ec2 console
REGION=us-west-2
KEY_FILE=... # path to private key file in folder where you ran konvoy -up

cat >/tmp/metacache.service <<'EOL'
[Unit]
Description=Setup Metacache
After=network.target tgt.service hedvigfsc.service
[Service]
Type=oneshot
ExecStart=/bin/bash -c "/bin/mount -t tmpfs -o size=4g tmpfs /hedvig/cache" ExecStartPre=/bin/bash -c "/bin/mkdir -p /hedvig/cache" RemainAfterExit=true
ExecStop=/bin/true
StandardOutput=journal
[Install]
WantedBy=multi-user.target
EOL

IPS=$(aws --region=$REGION ec2 describe-instances |  jq --raw-output ".Reservations[].Instances[] | select((.Tags | length) > 0) | select(.Tags[].Value | test(\"$CLUSTER-worker\")) | select(.State.Name | test(\"running\")) | [.PublicIpAddress] | join(\" \")")

for ip in $IPS; do
  echo $ip
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo yum install iscsi-initiator-utils -y  
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl enable rpcbind
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl start rpcbind  
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo modprobe iscsi_tcp
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo lsmod | grep iscsi_tcp

  scp -o StrictHostKeyChecking=no -i $KEY_FILE scp /tmp/metacache.service centos@$ip:/tmp/metacache.service
  scp -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo mv /tmp/metacache.service /etc/systemd/system/metacache.service
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl enable metacache
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip sudo systemctl start metacache
  ssh -o StrictHostKeyChecking=no -i $KEY_FILE centos@$ip df -kh
done
```

##### install the storage provider yaml manifests

Contact Hedvig to get download access for `hedvig-csi-installer.tar.gz`. Once downloaded unpack it and change to the `hedvig-csi-installer` folder.

Edit the file `manifests/ds/daemonset.yml` to add the `HEDVIG_SEED` nodes (hostname/IP address) of your Hedvig storage cluster (the seeds should be the Hedvig Storage Node hostname, and the `KUBE_CLUSTER_HEDVIG_ID` you chosen (this ID could be anything, but need to be the same as `KubeClusterID` in `setup/backend.json`).

```yaml
...
env:
  - name: HEDVIG_SEED_1
    value: <Hedvig_Seed1>
  - name: HEDVIG_SEED_2
    value: <Hedvig_Seed1>
  - name: HEDVIG_SEED_3
    value: <Hedvig_Seed1>
  - name: KUBE_CLUSTER_HEDVIG_ID
    value: <Kube_Cluster_Id>
...
```

Next we create the `Hedvig IO daemonset`.
```
kubectl create -f manifests/ds/daemonset.yml
```

Edit the file `setup/backend.json`. Specify the name of the Hedvig `StorageCluster`, the `StorageNodes` (hostname/IP address of the seed nodes of the Storage Cluster Nodes), and the `KubeClusterID` you have chosen (this ID should be same as `KUBE_CLUSTER_HEDVIG_ID` setting in `manifests/ds/daemonset.yml`).

```json
{
    "version": 1,
    "StorageCluster": "Hedvig_CLuster_Name",
    "StorageNodes": ["Hedvig_Seed1", "Hedvig_Seed2", "Hedvig_Seed3"],
    "KubeClusterID": "Kube_Cluster_Id"
}
```

Next we create the `Hedvig dynamic provisioner`.

```
./install_hedwig.sh
```

##### create default storage class

Here we create the default storage class for the Konvoy cluster.

```sh
cat <<EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: sc-hedvig-csi-default
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"  
provisioner: io.hedvig.csi
parameters:
  backendType: "hedvig-block"
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

Next update the Konvoy cluster.
```
konvoy up
```

When complete you should see in the addons listed also those that require persistent storage, e.g prometheus, elasticsearch, ... .

### verify

First check that in the `kubeaddons` and `velero` namespaces all persistent volume claims got created successfully.

Next launch from the ops portal graphana or kibana and see that you actually get data.

## information

#### documentation

* [Hedvig Technical Overview](https://go.hedvig.io/WC-TechnicalOverview_LP-Registration-2.html)
* [Hedvig Product Datasheet](https://go.hedvig.io/rs/896-KUY-430/images/Hedvig%20-%20SDS%20Datasheet.pdf)
* [Hedvig with Kubernetes](https://go.hedvig.io/rs/896-KUY-430/images/White%20Paper%20-%20Kubernetes.pdf)
* [Persistent Storage for Kubernetes with Hedvig](https://go.hedvig.io/rs/896-KUY-430/images/Hedvig%20-%20Persistent%20Storage%20for%20Kubernetes.pdf)
* [Hedvig Container-Native Storage Solution Brief ](https://go.hedvig.io/rs/896-KUY-430/images/Hedvig%20-%20Solutions%20Brief%20-%20Containers_v3.0_.pdf)

#### license

Hedvig is available with `two licensing models`:

An annual subscription pricing model based on required capacity that includes software use and support for a 12-month period.A perpetual capacity-based license. (Support added separately).Each are available in primary storage (all features), backup/archive storage, or object-only storage versions that are priced according to the set of features delivered for the given use cases.

#### maintenance & support

* [hedvig support](https://www.hedvig.io/support/)
