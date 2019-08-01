---
layout: layout.pug
navigationTitle: Portworx
title: Portworx
excerpt: Portworx Storage Provider
menuWeight: 120
category: Storage
image: img/portworx.png
---

Portworx is the solution for running stateful containers in production, designed with DevOps in mind. With Portworx, users can manage any database or stateful service on any infrastructure using Kubernetes. Portworx solves the five most common problems DevOps teams encounter when running stateful services in production: persistence, high availability, data automation, security, and support for multiple data stores and infrastructure.

## quick start

The following shows how you can setup `Konvoy` with `Portworx` as the default persistent storage provider.

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

Also in `cluster.yaml` use one of the following `aws instance types c5, c5d, i3.metal, m5, m5d, r5, r5d, z1d` for `worker nodes (e.g. m5.xlarge)`. An upcoming Portworx release will lift that restriction.

Next install the Konvoy cluster.
```
konvoy up
```

Once the cluster is up apply the `kubeconfig` and make sure that you can interact with it using `kubectl`.
```
konvoy apply kubeconfig
```

#### (2) install storage provider

Installing the Portworx storage provider requires to do the following steps

* install the storage provider yaml manifest
* create default storage class

##### install the storage provider yaml manifest

Portworx comes with a [browser wizard](https://docs.portworx.com/portworx-install-with-kubernetes/cloud/aws/aws-asg/#) to create the yaml manifest.

The wizard has `4 sections` that you have to go through.

* basic
  * specify your kubernetes version
  * select build-in key value store
* storage
  * select cloud and aws
  * select create using a spec, with this option Portworx manages the entire lifecycle of EBS volume storage
* network
  * leave with auto
* settings
  * in customize select none
  * in advanced settings select enable CSI

Finish the wizard with downloading the `spec.yaml`

Next we apply the Portworx spec.yaml.

```
kubectl apply -f spec.yaml
```

##### create default storage class

Here we create the default storage class for the Konvoy cluster.

```sh
cat <<EOF | kubectl apply -f -
kind: StorageClass
apiVersion: storage.k8s.io/v1beta1
metadata:
   name: portworx-sc
   annotations:
     storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/portworx-volume
parameters:
  repl: "2"
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

Use `port-forwarding` to access `lighthouse` the Portworx console via your browser on [localhost:8080](localhost:8080). You should find the volumes create by the persistent volume claims also here.
```
kubectl port-forward service/px-lighthouse 8080:80 -n kube-system
```

## information

#### documentation

* [portworx documentation](https://docs.portworx.com/)

#### release notes

* [portworx release notes](https://docs.portworx.com/reference/release-notes/)

#### license

* [portworx licensing](https://docs.portworx.com/reference/knowledge-base/px-licensing/)

#### maintenance & support

* [portworx support](https://docs.portworx.com/support/)
