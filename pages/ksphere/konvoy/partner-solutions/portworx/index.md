---
layout: layout.pug
navigationTitle: Portworx
title: Portworx
excerpt: Portworx Storage Provider
menuWeight: 120
category: Storage
image: img/portworx.png
---
# Portworx

Portworx is the solution for running stateful containers in production, designed with DevOps in mind. With Portworx, you can manage any database or stateful service on any infrastructure using Kubernetes. Portworx solves the five most common problems DevOps teams encounter when running stateful services in production: persistence, high availability, data automation, security, and support for multiple data stores and infrastructure.

## Quick Start

The following shows how you can set up `Konvoy` with `Portworx` as the default persistent storage provider.

### Install

Installing Konvoy with a different persistent storage provider currently requires a three phase install.

1. Run `konvoy up` with add-ons that don't require persistent storage
1. Install storage provider
1. Run `konvoy up` with add-ons that require persistent storage

#### Run `konvoy up` With Add-Ons Not Requiring Persistent Storage

1. Run `konvoy init` so that you get the `cluster.yaml` file.
    ```bash
    konvoy init --provisioner=aws
    ```

1. In the `cluster.yaml` file, disable all AWS ebs/storage add-ons, and all add-ons that require persistent storage.
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

1. Also in `cluster.yaml` use one of the following: `aws instance types c5, c5d, i3.metal, m5, m5d, r5, r5d, z1d` for `worker nodes (e.g. m5.xlarge)`. An upcoming Portworx release will lift that restriction.

1. Install the Konvoy cluster.
    ```bash
    konvoy up
    ```

1. Once the cluster is up, apply the `kubeconfig` and make sure that you can interact with it using `kubectl`.
    ```bash
    konvoy apply kubeconfig
    ```

#### Install Storage Provider

Installing the Portworx storage provider requires you to do the following steps:

* Install the storage provider yaml manifest
* Create default storage class

##### Install the Storage Provider Yaml Manifest

1. Portworx comes with an [install wizard](https://install.portworx.com/) to create the yaml manifest. The wizard has four sections that you must configure.

    * Basic
      * specify your kubernetes version
      * select build-in key value store
    * Storage
      * select cloud and aws
      * select create using a spec, with this option Portworx manages the entire lifecycle of EBS volume storage
    * Network
      * leave with auto
    * Settings
      * in customize select none
      * in advanced settings select enable CSI

1. Finish the wizard by downloading the `spec.yaml`

1. Apply the Portworx `spec.yaml`.

    ```bash
    kubectl apply -f spec.yaml
    ```

##### Create Default Storage Class

1. reate the default storage class for the Konvoy cluster.

    ```bash
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

#### Run `konvoy up` with Add-Ons Not Requiring Persistent Storage

1. In the `cluster.yaml` file,  enable all add-ons that require persistent storage.
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

When complete, you should see in the add-ons listed also those that require persistent storage, e.g prometheus, elasticsearch, and so forth.

### Verify

1. Check that in the `kubeaddons` and `velero` namespaces all persistent volume claims got created successfully.

1. Launch from the ops portal graphana or kibana and see that you actually get data.

1. Use `port-forwarding` to access `lighthouse` the Portworx console via your browser on [localhost:8080](localhost:8080). You should find the volumes create by the persistent volume claims also here.
    ```bash
    kubectl port-forward service/px-lighthouse 8080:80 -n kube-system
    ```

## Information

### Documentation

* [Portworx documentation](https://docs.portworx.com/)

### Release Notes

* [Portworx release notes](https://docs.portworx.com/reference/release-notes/)

### Licensing

* [Portworx licensing](https://docs.portworx.com/reference/knowledge-base/px-licensing/)

### Maintenance & Support

* [Portworx support](https://docs.portworx.com/support/)
