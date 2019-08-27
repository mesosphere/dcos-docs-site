---
layout: layout.pug
navigationTitle: Cluster provisioning
title: Cluster provisioning
menuWeight: 15
excerpt: Review cluster provisioner settings defined in the cluster.yaml file
enterprise: false
---

As discussed in the [Quick start](../../quick-start/) and [Install and upgrade](../../install-upgrade/) sections, the `cluster.yaml` file defines all of the key settings that are used to create and customize a Konvoy cluster.
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
    version: 1.15.3
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

## ClusterProvisioner settings

| Parameter              | Description                                                             | Default       |
| ---------------------- | ----------------------------------------------------------------------- | ------------- |
| `spec.provider`        | defines the provider used to provision the cluster                      | `aws`         |
| `spec.aws`             | contains AWS specific options                                           | See [spec.aws](#spec-aws) |
| `spec.docker`          | contains Docker specific options                                        | See [spec.docker](#spec-docker) |
| `spec.nodePools`       | a list of nodes to create, there must be at least one controlPlane pool | See [spec.nodePools](#spec-nodepools) |
| `spec.sshCredentials`  | contains credentials information for accessing machines in a cluster    | See [spec.sshCredentials](#spec-sshcredentials) |
| `spec.version`         | version of a konvoy cluster                                             | `v0.0.20`     |

### spec.aws

| Parameter               | Description                                                                      | Default               |
| ----------------------- | -------------------------------------------------------------------------------- | --------------------- |
| `aws.region`            | [AWS region][aws_region] where your cluster is hosted                            |  `us-west-2`          |
| `aws.availabilityZones` | availability zones to deploy a cluster in a region                               | `[us-west-2c]`        |
| `aws.tags`              | additional [tags][aws_tags] for the resources provisioned through the Konvoy CLI | `[owner: <username>]` |
| `aws.vpc`               | [AWS VPC][aws_vpc_and_subnets] to use when deploying a cluster                   | N/A                   |  
| `aws.elb`               | [AWS ELB][aws_elb] The ELB used by the kube-apiservers                           | N/A                   |

### spec.aws.iam

| Parameter  | Description                                                                       | Default |
| ---------- | --------------------------------------------------------------------------------- | ------- |
| `iam.role` | [AWS Role][aws_role] information with policies to be used by a kubernetes cluster | N/A     |

### spec.aws.iam.role

| Parameter   | Description                                                         | Default |
| ----------- | ------------------------------------------------------------------- | ------- |
| `role.name` | name of the role with policies required to run a kubernetes cluster | `""`    |
| `role.arn`  | ARN of the role  with policies required to run a kubernetes cluster | `""`    |

### spec.vpc

| Parameter               | Description                                                                 | Default |
| ----------------------- | ----------------------------------------------------------------------------| ------- |
| `vpc.ID`                | [AWS VPC][aws_vpc_and_subnets] ID where the cluster should be launched      | `""`    |
| `vpc.routeTableID`      | [AWS RouteTable][aws_route_table] ID that is used by the subnets in the VPC | `""`    |
| `vpc.internetGatewayID` | [AWS Internet Gateway][aws_internet_gateway] ID assigned to the VPC         | `""`    |

### spec.elb
| Parameter               | Description                                                                 | Default |
| ----------------------- | ----------------------------------------------------------------------------| ------- |
| `elb.internal`          | Set to true to make the ELB internal                                        | false   |
| `elb.subnetIDs`         | [AWS Subnet][aws_vpc_and_subnets] IDs where ELBs will be launched on        | `[]`    |

### spec.docker

The default value of this entire object is `omitted`.

| Parameter               | Description                                                                                              | Default |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------- |
| `aws.controlPlaneMappedPortBase`    | the beginning of the port range that will be used for SSH to the control plane nodes         | N/A     |
| `aws.sshControlPlaneMappedPortBase` | the beginning of the port range that will be used for exposing the control plane on the host | N/A     |
| `aws.sshWorkerMappedPortBase`       | the beginning of the port range that will be used for SSH to the worker nodes                | N/A     |

### spec.nodePools

`spec.nodePools` is comprised of an array of `nodePool`s.

#### nodePool

| Parameter               | Description                                                                                    | Default\[0]       | Default\[1]       |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ----------------- | ----------------- |
| `nodePool.name`         | Specifies a unique name that defines a node-pool.                                                           | `"worker"`        | `"control-plane"` |
| `nodePool.controlPlane` | Determines if a node-pool defines a Kubernetes Master node. Only one such `nodePool` can exist. | `omitted (false)` | `true`            |
| `nodePool.count`        | Defines the number of nodes in a node-pool. You should set the `count` to an odd number for `controlPlane` nodes to help keep `etcd` store consistent. A node pool count of 3 is considered “highly available” to protect against failures. | `4`               | `3`               |
| `nodePool.machine`      | Specifies cloud-provider details about the machine types to use.                                          | See [spec.nodePool.machine](#spec-nodepool-machine) | See \[0] |

#### spec.nodePool.machine

`spec.nodePool.machine` varies depending on the `spec.provider`.

##### AWS (machine)

| Parameter                     | Description                                                                                                 | Default\[0]    | Default\[1] |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| `machine.imageID`             | [AWS AMI][aws_ami] Specifies the image ID that will be used for the instances instead of the default image. | `omitted ("")` | See \[0]    |
| `machine.imageName`           | Specifies the Docker image that is used instead of the default image.                                       | `omitted ("")` | See \[0]    |
| `machine.rootVolumeSize`      | Specifies the size of root volume to use that is mounted on each machine in a node-pool in GiBs.            | `80`           | See \[0]    |
| `machine.rootVolumeType`      | Specifies the [volume type][ebs_volume_types] to mount on each machine in a node-pool.                      | `gp2`          | See \[0]    |
| `machine.imagefsVolumeEnabled`| Specifies whether to enable dedicated disk for image filesystem (for example, `/var/lib/containerd`).       |  `true`        | See \[0]    |
| `machine.imagefsVolumeSize`   | Specifies the size of imagefs volume to use that is mounted on each machine in a node-pool in GiBs.         | `160`          | See \[0]    |
| `machine.imagefsVolumeType`   | Specifies the [volume type][ebs_volume_types] to mount on each machine in a node-pool.                      | `gp2`          | See \[0]    |
| `machine.type`                | Specifies the [EC2 instance type][ec2_instance_types] to use.                                               | `t3.xlarge`    | `t3.large`  |
| `machine.aws.subnetIDs`       | Specifies the [AWS Subnet][aws_vpc_and_subnets] to launch instances unto.                                   | `[]`           | `[]`        |
| `machine.aws.iam`             | [AWS IAM][aws_iam] represents access control details                                                        | N/A            |             |

### spec.sshCredentials

| Parameter                       | Description                                                                                      | Default                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `sshCredentials.user`           | Specifies the user name to use when accessing a machine throough ssh.                            | `centos`                |
| `sshCredentials.publicKeyFile`  | Specifies the path and name of the public key file to use when accessing a machine through ssh.  | `<clustername>`-ssh.pub |
| `sshCredentials.privateKeyFile` | Specifies the path and name of the private key file to use when accessing a machine through ssh. | `<clustername>`-ssh.pem |

## ClusterConfiguration settings

| Parameter               | Description                            | Default                                  |
| ----------------------- | -------------------------------------- | ---------------------------------------- |
| `spec.kubernetes`       | Defines Kubernetes-specific properties. | See [spec.kubernetes](#spec-kubernetes)  |
| `spec.containerRuntime` | Specifies the container runtime to use.         | See [spec.containerRuntime](#spec-containerruntime) |
| `spec.containerNetworking` | Specifies the container networking to use.          | See [spec.containerNetworking](#spec-containernetworking) |
| `spec.imageRegistries`  | Specifies the container image registries authentication details. | See [spec.imageRegistries](#spec-imageregistries) |
| `spec.nodePools`        | Specifies the nodePool configuration.         | See [spec.imageRegistries](#spec-nodepools) |
| `spec.addons`           | Specifies the list of addons that can be deployed.  | See [spec.addons](#spec-addons) |
| `spec.version`          | version of a konvoy cluster            | `v0.0.20`                                |

### spec.kubernetes

| Parameter                      | Description                                                 | Default                 |
| ------------------------------ | ----------------------------------------------------------- | ----------------------- |
| `kubernetes.version`           | Specifies the version of kubernete to deploy.  | `1.15.3`                |
| `kubernetes.controlPlane`      | Specifies the object that defines control plane configuration.       | See [spec.kubernetes.controlPlane](#spec-kubernetes-controlplane) |
| `kubernetes.networking`        | Specifies the object that defines cluster networking.          | See [spec.kubernetes.networking](#spec-kubernetes-networking) |
| `kubernetes.cloudProvider`     | Specifies the object that defines which cloud-provider to enable.    | See [spec.kubernetes.clouldProvider](#spec-kubernetes-cloudprovider)  |
| `kubernetes.podSecurityPolicy` | Specifies the object that defines whether to enable pod security policies. | See [spec.kubernetes.podSecurityPolicy](#spec-kubernetes-podsecuritypolicy)    |
| `kubernetes.preflightChecks`   | Specifies the object that defines what errors to ignore for Ansible pre-flight checks. | See [spec.kubernetes.preflightChecks](#spec-kubernetes-preflightchecks)    |

#### spec.kubernetes.controlPlane

| Parameter                                  | Description                                                    | Default  |
| ------------------------------------------ | -------------------------------------------------------------- | -------- |
| `controlPlane.controlPlaneEndpointOverride`| Overrides the `control_plane_endpoint` from `inventory.yaml`.   | `""`      |
| `controlPlane.keepalived`                   | Specifies the object that defines keepalived configuration.     | See [spec.kubernetes.controlPlane.keepalived](#spec-kubernetes-controlplane-keepalived)  |

#### spec.kubernetes.controlPlane.keepalived

| Parameter              | Description                      | Default  |
| -----------------------| ---------------------------------| -------- |
| `keepalived.enabled`   | Enables keepalived.              | `false`  |
| `keepalived.interface` | Specifies the interface to run keepalived on.  | `omitted("")` |
| `keepalived.vrid`      | Specifies the virtual router id for keepalived. | `omitted ("random")` |

#### spec.kubernetes.networking

| Parameter                  | Description                                                                      | Default          |
| -------------------------- | -------------------------------------------------------------------------------- | ---------------- |
| `networking.podSubnet`     | Specifies the pod layer networking cidr.                                                      | `192.168.0.0/16` |
| `networking.serviceSubnet` | Specifies the service layer networking cidr.                                       | `10.0.0.0/18`    |
| `networking.httpProxy`     | Specifies the address to the HTTP proxy to set `HTTP_PROXY` env variable during installation.  | `""`             |
| `networking.httpsProxy`    | Specifies the address to the HTTPs proxy to set `HTTPS_PROXY` env variable during installation. | `""`             |
| `networking.noProxy`       | Specifies the list of addresses to pass to `NO_PROXY`, all node addresses, podSubnet, serviceSubnet, controlPlane endpoint and `127.0.0.1` and `localhost` are automatically set. | `[]` |

#### spec.kubernetes.cloudProvider

| Parameter                | Description                               | Default |
| ------------------------ | ----------------------------------------- | ------- |
| `cloudProvider.provider` | Defines the provider for cloud services.  | `aws`   |

#### spec.kubernetes.podSecurityPolicy

| Parameter                   | Description               | Default |
| --------------------------- | ------------------------- | ------- |
| `podSecurityPolicy.enabled` | Enables podSecurity policy. | `false` |

#### spec.kubernetes.preflightChecks

| Parameter                   | Description               | Default |
| --------------------------- | ------------------------- | ------- |
| `preflightChecks.errorsToIgnore` | Specifies a comma separated list of errors to ignore for ansible preflight checks, default depends on provider.  | `""` |

### spec.nodePools

`spec.nodePools` is comprised of an array of `spec.nodePool`s.

#### spec.nodePool

| Parameter       | Description                                                                | Default\[0] |  Default\[1] |
| --------------- | -------------------------------------------------------------------------- | ----------- | ------------ |
| `name`          | Specifies the nodePool name corresponding to one in ClusterProvisioner.spec.nodePool. | `"worker"`  | "control-plane" |
| `labels`        | Specifies the user-defined `spec.nodePool.label`s to set on all nodes in the nodePool.   | See [spec.nodePools.labels](#spec-nodepools-labels) | See \[0]   |
| `taints`        | Specifies the user-defined `spec.nodePool.taints`s to set on all nodes in the nodePool.  | See [spec.nodePools.taints](#spec-nodepools-taints) | See \[0]   |

### spec.nodePools.labels

`spec.nodePools.labels` is comprised of an array of `label`s, the default value is `omitted ([])`.

### spec.nodePool.label

| Parameter       | Description                                                                | Default    |
| --------------- | ------------ | ---------- |
| `key`           | label key    | `omitted ("")`         |
| `value`         | Specifies the user-defined labels to set on all nodes in the nodePool.               | `omitted ("")`         |

### spec.nodePools.taints

`spec.nodePools.taints` is comprised of an array of `taint`s, the default value is `omitted ([])`.

### spec.nodePool.taint

| Parameter       | Description                                                                | Default    |
| --------------- | ------------ | ---------- |
| `key`           | label key    | `omitted ("")`         |
| `value`         | Specifies the user=defined labels to set on all nodes in the nodePool.                | `omitted ("")` |
| `effect`        | Determines the effect of the taint. The vallid settings are: `"NoSchedule"`, `"PreferNoSchedule"`, `"NoExecute"`    | `omitted ("")` |

#### spec.containerRuntime

| Parameter                     | Description                                               | Default  |
| ----------------------------- | --------------------------------------------------------- | -------- |
| `containerRuntime.containerd` | Defines the [containerd][containerd] runtime.          | See [spec.containerRuntime.containerd](#spec-containerruntime-containerd)    |

#### spec.containerRuntime.containerd

| Parameter               | Description                                                    | Default  |
| ----------------------- | -------------------------------------------------------------- | -------- |
| `containerd.version`    | Specifies the version of the [containerd][containerd] runtime.      | `1.2.5`    |
| `containerd.configData` | Contains data for configuring the [containerd][containerd].    | See [spec.containerRuntime.containerd.configData](#spec-containerruntime-containerd-configdata)    |

#### spec.containerNetworking

| Parameter                     | Description                                               | Default  |
| ----------------------------- | --------------------------------------------------------- | -------- |
| `containerNetworking.calico` | Defines the [containerd][containerd] runtime.          | See [spec.containerRuntime.containerd](#spec-containernetworking-calico)  |

#### spec.containerNetworking.calico

| Parameter               | Description                                                    | Default  |
| ----------------------- | -------------------------------------------------------------- | -------- |
| `calico.version`    | Specifies the version of the [containerd][containerd] runtime.     | `v3.8.0`    |

#### spec.containerRuntime.containerd.configData

| Parameter            | Description                                                          | Default  |
| -------------------- | -------------------------------------------------------------------- | -------- |
| `configData.data`    | Specifies the [TOML configuration][containerd_config] of containerd.             | `""`     |
| `containerd.replace` | enable to use `configData.data`. otherwise, merge `configData.data` with the internal default. | `false`    |

### spec.imageRegistries

`spec.imageRegistries` is comprised of an array of `imageRegistry`s. The default value of this entire object is `omitted`.

#### imageRegistry

| Parameter       | Description                                                             | Default    |
| --------------- | ----------------------------------------------------------------------- | ---------- |
| `server`        | Specifies the full address including `https://` or `http://` and an optional port. | N/A        |
| `username`      | Specifies the registry user name.                                                     | N/A        |
| `password`      | Specifies the registry password. This setting requires you to provide a value for the `username` setting.             | N/A        |
| `auth`          | Contains the base64 encoded `username:password`.                                    | N/A        |
| `identityToken` | Used to authenticate the user and get an access token.          | N/A        |

### spec.addons

| Parameter              | Description                                            | Default    |
| ---------------------- | ------------------------------------------------------ | ---------- |
| `addons.configVersion` | Specifies the version of the addon configuration files to use.       | `v0.0.20`  |
| `addons.addonsList`    | Specifies the list of addon objects that can be deployed, if enabled.  | See [spec.addons.addonsList](#spec-addons-addonslist) |

#### spec.addons.addonsList

`spec.addonsList` is comprised of an array of `addon`s. The default values vary depending on the `provider` given on generation.

#### addon

Properties of an `addon` object.

| Parameter | Description                                                   |
| --------- | ------------------------------------------------------------- |
| `name`    | Specifies the name of the addon.                                            |
| `enabled` | Enables the addon to be deployed.                                    |
| `values`  | Overrides the values found in default addon configuration file. |

[cidr_blocks]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing#CIDR_blocks
[aws_security_groups]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html
[aws_region]: https://docs.aws.amazon.com/general/latest/gr/rande.html
[aws_tags]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html
[ebs_volume_types]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumeTypes.html
[ec2_instance_types]: https://aws.amazon.com/ec2/instance-types/
[containerd]: https://containerd.io
[containerd_config]: https://github.com/containerd/cri/blob/master/docs/config.md
[aws_ami]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html
[aws_iam]: https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html
[aws_role]: https://docs.aws.amazon.com/IAM/latest/APIReference/API_Role.html
[aws_vpc_and_subnets]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html
[aws_route_table]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html
[aws_internet_gateway]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
[aws_elb]: https://aws.amazon.com/elasticloadbalancing/
