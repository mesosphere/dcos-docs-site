---
layout: layout.pug
navigationTitle: Hedvig
title: Hedvig
excerpt: Hedvig Storage Provider
menuWeight: 60
category: Storage
image: img/hedvig.png
---
# Hedvig
The Hedvig Distributed Storage Platform provides a modern software solution that lets you tailor a flexible and efficient data management system built on industry-standard x86 server hardware to support any application, hypervisor, container, or cloud.

# Quick Start

The following shows how you can set up `Konvoy` with `Hedvig` as the default persistent storage provider.

## Install

Installing Konvoy with a different persistent storage provider currently requires a three phase install.

1. Run `konvoy up` with addons that do not require persistent storage.
1. Install storage provider.
1. Run `konvoy up` with addons that require persistent storage.

### Run `konvoy up` with Addons Not Requiring Persistent Storage

1. Run `konvoy init` so that you get the `cluster.yaml` file.
    ```bash
    konvoy init --provisioner=aws
    ```

1. In the `cluster.yaml` file `disable` all AWS ebs/storage addons, and all addons that require persistent storage.
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

1. The `Hedvig daemonset` installed in the following has the following `resources requirements`. Set a `worker instance type` in `cluster.yaml` accordingly.

    ```bash
    resources:
      requests:
        memory: "4Gi"
        cpu: "2"
      limits:
        memory: "8Gi"
        cpu: "4"
    ```

1. Next install the Konvoy cluster.
    ```bash
    konvoy up
    ```

1. Once the cluster is up, apply the `kubeconfig` and make sure that you can interact with it using `kubectl`.
    ```bash
    konvoy apply kubeconfig
    ```

### Install Storage Provider

Installing the `Hedvig` storage provider requires the following steps

* Install storage provider prerequisites
* Install the storage provider operator
* Create default storage class

#### Install Storage Provider Prerequisites

Hedvig Storage Cluster (Hedvig 3.0 or later) must be installed as a peer to Konvoy. Ensure that the Konvoy worker nodes and the Hedvig Storage Cluster Nodes can communicate with each other.

The Hedvig storage provider requires that a bunch of linux native prerequisites run on all worker nodes. Use the following script to install the prerequisites.

<p class="message--note"><strong>NOTE: </strong>The script requires the <code>aws cli</code> and <code>jq</code> commands to be installed. On Mac OS X, both can be installed using <code>brew</code>.</p>

```bash
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

#### Install the Storage Provider Yaml Manifests

1. Contact Hedvig to get download access for `hedvig-csi-installer.tar.gz`. 
1. Once downloaded, unpack it and change to the `hedvig-csi-installer` folder.

1. Edit the file `manifests/ds/daemonset.yml` to add the `HEDVIG_SEED` nodes (hostname/IP address) of your Hedvig storage cluster (the seeds should be the Hedvig Storage Node hostname, and the `KUBE_CLUSTER_HEDVIG_ID` you chosen (this ID could be anything, but need to be the same as `KubeClusterID` in `setup/backend.json`).

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

1. Create the `Hedvig IO daemonset`.
    ```bash
    kubectl create -f manifests/ds/daemonset.yml
    ```

1. Edit the file `setup/backend.json`. Specify the name of the Hedvig `StorageCluster`, the `StorageNodes` (hostname/IP address of the seed nodes of the Storage Cluster Nodes), and the `KubeClusterID` you have chosen (this ID should be same as `KUBE_CLUSTER_HEDVIG_ID` setting in `manifests/ds/daemonset.yml`).

    ```json
    {
        "version": 1,
        "StorageCluster": "Hedvig_CLuster_Name",
        "StorageNodes": ["Hedvig_Seed1", "Hedvig_Seed2", "Hedvig_Seed3"],
        "KubeClusterID": "Kube_Cluster_Id"
    }
    ```

1. Create the `Hedvig dynamic provisioner`.

    ```bash
    ./install_hedwig.sh
    ```

##### Create Default Storage Class

1. Create the default storage class for the Konvoy cluster.

    ```bash
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

If all things work fine, the pod created should be up and running, and data should be written to `/data/output` on the volume.

#### Rux `konvoy up` with Addons Requiring Persistent Storage

1. In the `cluster.yaml` file, enable all addons that require persistent storage.
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

When complete you should see in the addons listed also those that require persistent storage; for example; prometheus, elasticsearch, and so on.

### Verify

1. Check that in the `kubeaddons` and `velero` namespaces, all persistent volume claims were created successfully.

2. Launch from the ops portal graphana or kibana and see that you actually get data.

## Information

### Documentation

* [Hedvig Technical Overview](https://go.hedvig.io/WC-TechnicalOverview_LP-Registration-2.html)
* [Hedvig Product Datasheet](https://go.hedvig.io/rs/896-KUY-430/images/Hedvig%20-%20SDS%20Datasheet.pdf)
* [Hedvig with Kubernetes](https://go.hedvig.io/rs/896-KUY-430/images/White%20Paper%20-%20Kubernetes.pdf)
* [Persistent Storage for Kubernetes with Hedvig](https://go.hedvig.io/rs/896-KUY-430/images/Hedvig%20-%20Persistent%20Storage%20for%20Kubernetes.pdf)
* [Hedvig Container-Native Storage Solution Brief ](https://go.hedvig.io/rs/896-KUY-430/images/Hedvig%20-%20Solutions%20Brief%20-%20Containers_v3.0_.pdf)

### License

Hedvig is available with `two licensing models`:

* An annual subscription pricing model based on required capacity that includes software use and support for a 12-month period. 
* A perpetual capacity-based license. (Support added separately). 

Each is available in primary storage (all features), backup/archive storage, or object-only storage versions that are priced according to the set of features delivered for the given use cases.

### Maintenance & Support

* [hedvig support](https://www.hedvig.io/support/)
