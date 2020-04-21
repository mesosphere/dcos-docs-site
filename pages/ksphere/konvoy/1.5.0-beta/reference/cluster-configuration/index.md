---
layout: layout.pug
navigationTitle: Cluster configuration
title: Cluster configuration
menuWeight: 10
excerpt: Review cluster configuration settings defined in the cluster.yaml file
enterprise: false
---

As discussed in the [Quick start](../../quick-start/) and [Install](../../install) and [Upgrade](../../upgrade/) sections, the `cluster.yaml` file defines all of the key settings that are used to create and customize a Konvoy cluster.
Therefore, you should be familiar with this file and its configuration options before attempting to modify a deployed cluster or provision a customized cluster.

The `cluster.yaml` file is composed of two different configuration `kinds`.
In Kubernetes, a `kind` identifies the name of a specific Kubernetes resource.
For Konvoy, the `cluster.yaml` file defines the following configuration resource `kinds`:

- `ClusterConfiguration` - This section is **required** because it contains cluster-specific details that must be provided to create a cluster.
- `ClusterProvisioner` - This section is **optional** because it is contains provider-specific details that are dependent on your deployment infrastructure. For example, this section is not required if you are installing on an internal (on-prem) network.

In addition to the `cluster.yaml` file, Konvoy clusters require you to have an `inventory.yaml` file.
For information about the format and settings in an `inventory.yaml` file, see [Working with inventory files](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html).

## Sample cluster configuration file

The following example illustrates the contents of a `cluster.yaml` file with both the `ClusterProvisioner` and `ClusterConfiguration` sections defined.
In this example, the `cluster.yaml` file specifies `AWS` as the public cloud provisioner:

```yaml

---
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy-cluster
  creationTimestamp: "2019-09-27T22:13:00.2129454Z"
spec:
  provider: aws
  aws:
    region: us-west-2
    vpc:
      overrideDefaultRouteTable: true  
      enableInternetGateway: true
      enableVPCEndpoints: false
    availabilityZones:
    - us-west-2c
    tags:
      owner: konvoy-owner
  nodePools:
  - name: worker
    count: 4
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: m5.2xlarge
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: io1
      rootVolumeIOPS: 1000
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: m5.xlarge
  - name: bastion
    bastion: true
    count: 0
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      imagefsVolumeEnabled: false
      type: m5.large
  sshCredentials:
    user: centos
    publicKeyFile: konvoy-owner-ssh.pub
    privateKeyFile: konvoy-owner-ssh.pem
  version: v1.3.0

---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
metadata:
  name: konvoy-cluster
  creationTimestamp: "2019-09-27T22:13:00.2129454Z"
spec:
  kubernetes:
    version: 1.16.8
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
      iptables:
        addDefaultRules: false
    cloudProvider:
      provider: aws
    admissionPlugins:
      enabled:
      - AlwaysPullImages
      - NodeRestriction
  containerNetworking:
    calico:
      version: v3.13.2
      encapsulation: ipip
      mtu: 1480
  containerRuntime:
    containerd:
      version: 1.2.6
  osPackages:
    enableAdditionalRepositories: true
  nodePools:
  - name: worker
  addons:
    configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16-1.2.0
    addonsList:
    - name: awsebscsiprovisioner
      enabled: true
    - name: awsebsprovisioner
      enabled: false
      values: |
        storageclass:
          isDefault: false
    - name: cert-manager
      enabled: true
    - name: dashboard
      enabled: true
    - name: defaultstorageclass-protection
      enabled: true
    - name: dex
      enabled: true
    - name: dex-k8s-authenticator
      enabled: true
    - name: elasticsearch
      enabled: true
    - name: elasticsearchexporter
      enabled: true
    - name: external-dns
      enabled: true
      values: |
        aws:
          region:
        domainFilters: []
    - name: flagger
      enabled: false
    - name: fluentbit
      enabled: true
    - name: gatekeeper
      enabled: true
    - name: istio # Istio is currently in Preview
      enabled: false
    - name: kibana
      enabled: true
    - name: konvoyconfig
      enabled: true
    - name: kube-oidc-proxy
      enabled: true
    - name: localvolumeprovisioner
      enabled: false
      values: |
        # Multiple storage classes can be defined here. This allows to, e.g.,
        # distinguish between different disk types.
        # For each entry a storage class '$name' and
        # a host folder '/mnt/$dirName' will be created. Volumes mounted to this
        # folder are made available in the storage class.
        storageclasses:
          - name: localvolumeprovisioner
            dirName: disks
            isDefault: false
            reclaimPolicy: Delete
            volumeBindingMode: WaitForFirstConsumer
    - name: nvidia
      enabled: false
    - name: opsportal
      enabled: true
    - name: prometheus
      enabled: true
    - name: prometheusadapter
      enabled: true
    - name: reloader
      enabled: true
    - name: traefik
      enabled: true
    - name: traefik-forward-auth
      enabled: true
    - name: velero
      enabled: true
  - configRepository: https://github.com/mesosphere/kubeaddons-dispatch
    configVersion: stable-1.16-1.0.0
    addonsList:
    - name: dispatch # Dispatch is currently in Beta
      enabled: false
  - configRepository: https://github.com/mesosphere/kubeaddons-kommander
    configVersion: stable-1.16-1.0.0
    addonsList:
    - name: kommander
      enabled: true
  version: v1.3.0

```
