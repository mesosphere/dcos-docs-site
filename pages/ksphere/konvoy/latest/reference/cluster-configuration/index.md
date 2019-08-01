---
layout: layout.pug
navigationTitle: Cluster configuration
title: Cluster configuration
menuWeight: 10
excerpt: Review cluster configuration settings defined in the cluster.yaml file
enterprise: false
---

As discussed in the [Quick start](../../quick-start/) and [Install and upgrade](../../install-upgrade/) sections, the `cluster.yaml` file defines all of the key settings that are used to create and customize a Konvoy cluster.
Therefore, you should be familiar with this file and its configuration options before attempting to modify a deployed cluster or provision a customized cluster.

The `cluster.yaml` file is composed of two different configuration `kinds`.
In Kubernetes, a `kind` identifies the name of a specific Kubernetes resource.
For Konvoy, the `cluster.yaml` file defines the following configuration resource `kinds`:

- `ClusterConfiguration` - This section is **required** because it contains cluster-specific details that must be provided to create a cluster.
- `ClusterProvisioner` - This section is **optional** because it is contains provider-specific details that are dependent on your deployment infrastructure.
  For example, this section is not required if you are installing on an internal (on-prem) network.

In addition to the `cluster.yaml` file, Konvoy clusters require you to have an `inventory.yaml` file.
For information about the format and settings in an `inventory.yaml` file, see [Working with inventory files](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html).

# Sample cluster configuration file

The following example illustrates the contents of a `cluster.yaml` file with both the `ClusterProvisioner` and `ClusterConfiguration` sections defined.
In this example, the `cluster.yaml` file specifies `AWS` as the public cloud provisioner:

```yaml

---
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: konvoy-cluster
  creationTimestamp: "2019-07-09T16:10:20.244749-04:00"
spec:
  provider: aws
  aws:
    region: us-west-2
    availabilityZones:
    - us-west-2c
    tags:
      owner: konvoy-owner
  adminCIDRBlocks:
  - 0.0.0.0/0
  nodePools:
  - name: worker
    count: 4
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      type: t3.xlarge
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      type: t3.large
  - name: bastion
    bastion: true
    count: 0
    machine:
      rootVolumeSize: 10
      rootVolumeType: gp2
      type: t3.small
  sshCredentials:
    user: centos
    publicKeyFile: konvoy-ssh.pub
    privateKeyFile: konvoy-ssh.pem
  version: v0.3.0

---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1alpha1
metadata:
  name: konvoy
  creationTimestamp: "2019-07-09T16:10:19.932534-04:00"
spec:
  kubernetes:
    version: 1.15.0
    controlPlane:
      controlPlaneEndpointOverride: ""
      keepalived:
        enabled: false
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
      httpProxy: ""
      httpsProxy: ""
    cloudProvider:
      provider: aws
    podSecurityPolicy:
      enabled: false
    preflightChecks:
      errorsToIgnore: ""
  containerNetworking:
    calico:
      version: v3.8.0
  containerRuntime:
    containerd:
      version: 1.2.5
      configData:
        data: ""
        replace: false
  nodePools:
  - name: worker
  addons:
    configVersion: v0.0.23
    addonsList:
    - name: awsebscsiprovisioner
      enabled: true
    - name: awsebsprovisioner
      enabled: false
    - name: elasticsearchexporter
      enabled: true
    - name: helm
      enabled: true
    - name: opsportal
      enabled: true
    - name: prometheusadapter
      enabled: true
    - name: velero
      enabled: true
    - name: kommander
      enabled: true
    - name: dashboard
      enabled: true
    - name: elasticsearch
      enabled: true
    - name: fluentbit
      enabled: true
    - name: kibana
      enabled: true
    - name: prometheus
      enabled: true
    - name: traefik
      enabled: true
    - name: dex
      enabled: false
    - name: dex-k8s-authenticator
      enabled: false
  version: v0.3.0
```

# ClusterConfiguration settings

| Parameter               | Description                            | Default                                  |
| ----------------------- | -------------------------------------- | ---------------------------------------- |
| `spec.kubernetes`       | defines Kubernetes specific properties | See [spec.kubernetes](#spec-kubernetes)  |
| `spec.containerRuntime` | container runtime to use               | See [spec.containerRuntime](#spec-containerruntime) |
| `spec.containerNetworking` | container networking to use               | See [spec.containerNetworking](#spec-containernetworking) |
| `spec.imageRegistries`  | container image registries auth details | See [spec.imageRegistries](#spec-imageregistries) |
| `spec.nodePools`        | nodePool configuration                  | See [spec.imageRegistries](#spec-nodepools) |
| `spec.addons`           | list of addons that can be deployed    | See [spec.addons](#spec-addons) |
| `spec.version`          | version of a konvoy cluster            | `v0.0.20`                                |

## spec.kubernetes

| Parameter                      | Description                                                 | Default                 |
| ------------------------------ | ----------------------------------------------------------- | ----------------------- |
| `kubernetes.version`           | version of kubernete to deploy                              | `1.15.0`                |
| `kubernetes.controlPlane`      | object that defines control plane configuration             | See [spec.kubernetes.controlPlane](#spec-kubernetes-controlplane) |
| `kubernetes.networking`        | object that defines cluster networking                      | See [spec.kubernetes.networking](#spec-kubernetes-networking) |
| `kubernetes.cloudProvider`     | object that defines which cloud-provider to enable          | See [spec.kubernetes.clouldProvider](#spec-kubernetes-cloudprovider)  |
| `kubernetes.podSecurityPolicy` | object that defines whether to enable pod security policies | See [spec.kubernetes.podSecurityPolicy](#spec-kubernetes-podsecuritypolicy)    |
| `kubernetes.preflightChecks`   | object that defines what errors to ignore for ansible preflight checks | See [spec.kubernetes.preflightChecks](#spec-kubernetes-preflightchecks)    |

### spec.kubernetes.controlPlane

| Parameter                                  | Description                                                    | Default  |
| ------------------------------------------ | -------------------------------------------------------------- | -------- |
| `controlPlane.controlPlaneEndpointOverride`| overrides the `control_plane_endpoint` from `inventory.yaml`   | `""`      |
| `controlPlane.keepalived`                   | object that defines keepalived configuration                  | See [spec.kubernetes.controlPlane.keepalived](#spec-kubernetes-controlplane-keepalived)  |

### spec.kubernetes.controlPlane.keepalived

| Parameter              | Description                      | Default  |
| -----------------------| ---------------------------------| -------- |
| `keepalived.enabled`   | enable keepalived                | `false`  |
| `keepalived.interface` | interface to run keepalived on   | `omitted("")` |
| `keepalived.vrid`      | virtual router id for keepalived | `omitted ("random")` |

### spec.kubernetes.networking

| Parameter                  | Description                                                                      | Default          |
| -------------------------- | -------------------------------------------------------------------------------- | ---------------- |
| `networking.podSubnet`     | pod layer networking cidr                                                        | `192.168.0.0/16` |
| `networking.serviceSubnet` | service layer networking cidr                                                    | `10.0.0.0/18`    |
| `networking.httpProxy`     | address to the HTTP proxy to set `HTTP_PROXY` env variable during installation   | `""`             |
| `networking.httpsProxy`    | address to the HTTPs proxy to set `HTTPS_PROXY` env variable during installation | `""`             |
| `networking.noProxy`       | list of addresses to pass to `NO_PROXY`, all node addresses, podSubnet, serviceSubnet, controlPlane endpoint and `127.0.0.1` and `localhost` are automatically set | `[]` |

### spec.kubernetes.cloudProvider

| Parameter                | Description                               | Default |
| ------------------------ | ----------------------------------------- | ------- |
| `cloudProvider.provider` | define the provider for cloud services    | `aws`   |

### spec.kubernetes.podSecurityPolicy

| Parameter                   | Description               | Default |
| --------------------------- | ------------------------- | ------- |
| `podSecurityPolicy.enabled` | enable podSecurity policy | `false` |

### spec.kubernetes.preflightChecks

| Parameter                   | Description               | Default |
| --------------------------- | ------------------------- | ------- |
| `preflightChecks.errorsToIgnore` | a comma separated list of errors to ignore for ansible preflight checks, default depends on provider  | `""` |

## spec.nodePools

`spec.nodePools` is comprised of an array of `spec.nodePool`s.

### spec.nodePool

| Parameter       | Description                                                                | Default\[0] |  Default\[1] |
| --------------- | -------------------------------------------------------------------------- | ----------- | ------------ |
| `name`          | the nodePool name corresponding to one in ClusterProvisioner.spec.nodePool | `"worker"`  | "control-plane" |
| `labels`        | user defined `spec.nodePool.label`s to set on all nodes in the nodePool    | See [spec.nodePools.labels](#spec-nodepools-labels) | See \[0]   |
| `taints`        | user defined `spec.nodePool.taints`s to set on all nodes in the nodePool   | See [spec.nodePools.taints](#spec-nodepools-taints) | See \[0]   |

#### spec.nodePools.labels

`spec.nodePools.labels` is comprised of an array of `label`s, the default value is `omitted ([])`.

#### spec.nodePools.label

| Parameter       | Description                                                                | Default    |
| --------------- | ------------ | ---------- |
| `key`           | label key    | `omitted ("")`         |
| `value`         | user defined labels to set on all nodes in the nodePool                    | `omitted ("")`         |

#### spec.nodePools.taints

`spec.nodePools.taints` is comprised of an array of `taint`s, the default value is `omitted ([])`.

#### spec.nodePool.taint

| Parameter       | Description                                                                | Default    |
| --------------- | ------------ | ---------- |
| `key`           | label key    | `omitted ("")`         |
| `value`         | user defined labels to set on all nodes in the nodePool                    | `omitted ("")` |
| `effect`        | the effect of the taint, can be: `"NoSchedule"`, `"PreferNoSchedule"`, `"NoExecute"`    | `omitted ("")` |

## spec.containerRuntime

| Parameter                     | Description                                               | Default  |
| ----------------------------- | --------------------------------------------------------- | -------- |
| `containerRuntime.containerd` | defines the [containerd][containerd] runtime              | See [spec.containerRuntime.containerd](#spec-containerruntime-containerd)    |

### spec.containerRuntime.containerd

| Parameter               | Description                                                    | Default  |
| ----------------------- | -------------------------------------------------------------- | -------- |
| `containerd.version`    | the version of the [containerd][containerd] runtime            | `1.2.5`    |
| `containerd.configData` | contains data for configuring the [containerd][containerd]     | See [spec.containerRuntime.containerd.configData](#spec-containerruntime-containerd-configdata)    |

## spec.containerNetworking

| Parameter                     | Description                                               | Default  |
| ----------------------------- | --------------------------------------------------------- | -------- |
| `containerNetworking.calico` | defines the [containerd][containerd] runtime              | See [spec.containerRuntime.containerd](#spec-containernetworking-calico)  |

### spec.containerNetworking.calico

| Parameter               | Description                                                    | Default  |
| ----------------------- | -------------------------------------------------------------- | -------- |
| `calico.version`    | the version of the [containerd][containerd] runtime            | `v3.8.0`    |

### spec.containerRuntime.containerd.configData

| Parameter            | Description                                                          | Default  |
| -------------------- | -------------------------------------------------------------------- | -------- |
| `configData.data`    | [TOML configuration][containerd_config] of containerd                | `""`     |
| `containerd.replace` | enable to use `configData.data`. otherwise, merge `configData.data` with the internal default. | `false`    |

## spec.imageRegistries

`spec.imageRegistries` is comprised of an array of `imageRegistry`s. The default value of this entire object is `omitted`.

### imageRegistry

| Parameter       | Description                                                             | Default    |
| --------------- | ----------------------------------------------------------------------- | ---------- |
| `server`        | the full address including `https://` or `http://` and an optional port | N/A        |
| `username`      | registry username                                                       | N/A        |
| `password`      | registry password, `username` must also be provided                     | N/A        |
| `auth`          | base64 encoded `username:password`                                      | N/A        |
| `identityToken` | used to authenticate the user and get an access token                   | N/A        |

## spec.addons

| Parameter              | Description                                            | Default    |
| ---------------------- | ------------------------------------------------------ | ---------- |
| `addons.configVersion` | version of the addon configuration files to use        | `v0.0.20`  |
| `addons.addonsList`    | list of addon objects that can be deployed if enabled  | See [spec.addons.addonsList](#spec-addons-addonslist) |

### spec.addons.addonsList

`spec.nodePools` is comprised of an array of `addon`s. The default values vary depending on the `provider` given on generation.

### addon

Properties of an `addon` object.

| Parameter | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `name`    | name of the addon                                             |
| `enabled` | enable to deploy the addon                                    |
| `values`  | overrides to values found in default addon configuration file |

[cidr_blocks]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_blocks
[aws_security_groups]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html
[aws_region]: https://docs.aws.amazon.com/general/latest/gr/rande.html
[aws_tags]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html
[ebs_volume_types]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
[ec2_instance_types]: https://aws.amazon.com/ec2/instance-types/
[containerd]: https://containerd.io
[containerd_config]: https://github.com/containerd/cri/blob/master/docs/config.md
[aws_ami]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html
