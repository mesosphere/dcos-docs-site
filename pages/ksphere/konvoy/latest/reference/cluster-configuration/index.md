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
    cloudProvider:
      provider: aws
    admissionPlugins:
      enabled:
      - AlwaysPullImages
      - NodeRestriction
  containerNetworking:
    calico:
      version: v3.13.1
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

## ClusterProvisioner settings

| Parameter              | Description                                                             | Default       |
| ---------------------- | ----------------------------------------------------------------------- | ------------- |
| `spec.provider`        | Defines the provider used to provision the cluster                      | `aws`         |
| `spec.aws`             | Contains AWS specific options                                           | See [spec.aws](#specaws) |
| `spec.docker`          | Contains Docker specific options                                        | See [spec.docker](#specdocker) |
| `spec.nodePools`       | A list of nodes to create, there must be at least one controlPlane pool | See [spec.nodePools](#specnodepools) |
| `spec.sshCredentials`  | Contains credentials information for accessing machines in a cluster    | See [spec.sshCredentials](#specsshcredentials) |
| `spec.version`         | Version of a konvoy cluster                                             | `v1.2.0`     |

### spec.aws

| Parameter               | Description                                                                      | Default               |
| ----------------------- | -------------------------------------------------------------------------------- | --------------------- |
| `aws.region`            | [AWS region][aws_region] where your cluster is hosted                            |  `us-west-2`          |
| `aws.availabilityZones` | Availability zones to deploy a cluster in a region                               | `[us-west-2c]`        |
| `aws.tags`              | Additional [tags][aws_tags] for the resources provisioned through the Konvoy CLI | `[owner: <username>]` |
| `aws.vpc`               | [AWS VPC][aws_vpc_and_subnets] to use when deploying a cluster                   | N/A                   |  
| `aws.elb`               | [AWS ELB][aws_elb] The ELB used by the kube-apiservers                           | N/A                   |

#### spec.aws.iam

| Parameter  | Description                                                                       | Default |
| ---------- | --------------------------------------------------------------------------------- | ------- |
| `iam.role` | [AWS Role][aws_role] information with policies to be used by a kubernetes cluster | N/A     |

##### spec.aws.iam.role

| Parameter   | Description                                                         | Default |
| ----------- | ------------------------------------------------------------------- | ------- |
| `role.name` | Name of the role with policies required to run a kubernetes cluster | `""`    |
| `role.arn`  | ARN of the role  with policies required to run a kubernetes cluster | `""`    |

### spec.vpc

| Parameter               | Description                                                                 | Default |
| ----------------------------- | -------------------------------------------------------------------------------------- | ------- |
| `vpc.ID`                | [AWS VPC][aws_vpc_and_subnets] ID where the cluster should be launched      | `""`    |
| `vpc.routeTableID`      | [AWS RouteTable][aws_route_table] ID that is used by the subnets in the VPC | `""`    |
| `vpc.overrideDefaultRouteTable`  | Override the default route table routes                                             | `true`  |
| `vpc.internetGatewayID` | [AWS Internet Gateway][aws_internet_gateway] ID assigned to the VPC         | `""`    |
| `vpc.enableInternetGateway` | Enable creating an [AWS Internet Gateway][aws_internet_gateway] when creating the VPC | `true` |
| `vpc.enableVPCEndpoints`    | Enable creating [AWS VPC Endpoints][aws_vpc_endpoints] when creating the VPC | `false` |

### spec.elb
| Parameter               | Description                                                                 | Default |
| ----------------------- | ----------------------------------------------------------------------------| ------- |
| `elb.internal`          | Set to true to make the ELB internal                                        | false   |
| `elb.subnetIDs`         | [AWS Subnet][aws_vpc_and_subnets] IDs where ELBs will be launched on        | `[]`    |

### spec.azure

| Parameter               | Description                                                                      | Default               |
| ----------------------- | -------------------------------------------------------------------------------- | --------------------- |
| `azure.location`            | [Azure location][azure_location] where your cluster is hosted                            |  `westus`          |
| `azure.availabilitySet` | [Azure availability sets][availability_set] Availability set define grouping capability for isolating VMs from each other     | `N/A`        |
| `azure.tags`              | Additional [Azure tags][azure_tags] for the resources provisioned through the Konvoy CLI | `[owner: <username>]` |
| `aws.vnet`               | [Azure VNET][azure_vnet] to use when deploying a cluster                   | N/A                   |  
| `azure.loadbalancer`               | [Azure LoadBalancer][azure_loadbalancer] The LoadBalancer used by the kube-apiservers                           | N/A                   |

#### spec.azure.vnet

| Parameter               | Description                                                                      | Default               |
| ----------------------- | -------------------------------------------------------------------------------- | --------------------- |
| `vnet.name`            | Name of the virtual network                            |  `""`          |
| `vnet.resourceGroup` | Resource group for the virtual network     | `""`        |
| `vnet.routeTable`              | RouteTable for the virtual network | `""` |

#### spec.azure.availabilitySet

| Parameter               | Description                                                                      | Default               |
| ----------------------- | -------------------------------------------------------------------------------- | --------------------- |
| `availabilitySet.faultDomainCount`            | Fault domain defines the amount of VMs with common storage as well as a common power source and network switch                            |  `3`          |
| `availabilitySet.updateDomainCount` | Update domain defines the amount of VMs and underlying physical hardware that can be rebooted at the same time     | `3`        |

#### spec.azure.loadbalancer

| Parameter               | Description                                                                      | Default               |
| ----------------------- | -------------------------------------------------------------------------------- | --------------------- |
| `loadbalancer.internal` | Load Balancer to balance internal traffic among VMs               |  `""`          |

### spec.docker

The default value of this entire object is `omitted`.

| Parameter               | Description                                                                                              | Default |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ------- |
| `aws.controlPlaneMappedPortBase`    | The beginning of the port range that will be used for SSH to the control plane nodes         | N/A     |
| `aws.sshControlPlaneMappedPortBase` | The beginning of the port range that will be used for exposing the control plane on the host | N/A     |
| `aws.sshWorkerMappedPortBase`       | The beginning of the port range that will be used for SSH to the worker nodes                | N/A     |

### spec.nodePools

`spec.nodePools` is comprised of an array of `nodePools`.

#### nodePool

| Parameter               | Description                                                                                    | Default Worker    | Default Control-Plane     |
| ----------------------- | ---------------------------------------------------------------------------------------------- | ----------------- | ----------------- |
| `nodePool.name`         | Specifies a unique name that defines a node-pool.                                                           | `"worker"`        | `"control-plane"` |
| `nodePool.controlPlane` | Determines if a node-pool defines a Kubernetes Master node. Only one such `nodePool` can exist. | `omitted (false)` | `true`            |
| `nodePool.count`        | Defines the number of nodes in a node-pool. You should set the `count` to an odd number for `controlPlane` nodes to help keep `etcd` store consistent. A node pool count of 3 is considered “highly available” to protect against failures. | `4`               | `3`               |
| `nodePool.machine`      | Specifies cloud-provider details about the machine types to use.                                          | See [spec.nodePool.machine](#specnodepoolmachine) | See [spec.nodePool.machine](#specnodepoolmachine) |

##### spec.nodePool.machine

`spec.nodePool.machine` varies depending on the `spec.provider`.

###### AWS (machine)

| Parameter                     | Description                                                                                                 | Default Worker | Default Control-Plane  |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| `machine.imageID`             | [AWS AMI][aws_ami] Specifies the image ID that will be used for the instances instead of the default image. | `omitted ("")` | `omitted ("")` |
| `machine.imageName`           | Specifies the Docker image that is used instead of the default image.                                       | `omitted ("")` | `omitted ("")`|
| `machine.rootVolumeSize`      | Specifies the size of root volume to use that is mounted on each machine in a node-pool in GiBs.            | `80`           | `80`    |
| `machine.rootVolumeType`      | Specifies the [volume type][ebs_volume_types] to mount on each machine in a node-pool.                      | `gp2`          | `gp2`    |
| `machine.imagefsVolumeEnabled`| Specifies whether to enable dedicated disk for image filesystem (for example, `/var/lib/containerd`).       |  `true`        | `true`     |
| `machine.imagefsVolumeSize`   | Specifies the size of imagefs volume to use that is mounted on each machine in a node-pool in GiBs.         | `160`          | `160`   |
| `machine.imagefsVolumeType`   | Specifies the [volume type][ebs_volume_types] to mount on each machine in a node-pool.                      | `gp2`          | `gp2`     |
| `machine.imagefsVolumeDevice` | Specifies the [volume's device name][ebs_volume_types] that will be mounted on each machine.                | `xvdb`         | `xvdb`    |
| `machine.type`                | Specifies the [EC2 instance type][ec2_instance_types] to use.                                               | `m5.2xlarge`   | `m5.xlarge`  |
| `machine.aws.subnetIDs`       | Specifies the [AWS Subnet][aws_vpc_and_subnets] to launch instances unto.                                   | `[]`           | `[]`        |
| `machine.aws.iam`             | [AWS IAM][aws_iam] represents access control details                                                        | N/A            |             |

###### Azure (machine)

| Parameter                     | Description                                                                                                 | Default Worker | Default Control-Plane |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------- | ----------- |
| `machine.imageID`             | [Azure ImageID][azure_imageid] Specifies the image ID that will be used for the instances instead of the default image. | `omitted ("")` | `omitted ("")`    |
| `machine.imageName`           | Specifies the Docker image that is used instead of the default image.                                       | `omitted ("")` | `omitted ("")`    |
| `machine.rootVolumeSize`      | Specifies the size of root volume to use that is mounted on each machine in a node-pool in GiBs.            | `80`           | `80`    |
| `machine.rootVolumeType`      | Specifies the [volume type][azure_volume_types] to mount on each machine in a node-pool.                      | `Standard_LRS`          | `Standard_LRS`    |
| `machine.imagefsVolumeEnabled`| Specifies whether to enable dedicated disk for image filesystem (for example, `/var/lib/containerd`).       |  `true`        | `true`    |
| `machine.imagefsVolumeSize`   | Specifies the size of imagefs volume to use that is mounted on each machine in a node-pool in GiBs.         | `160`          | `160`    |
| `machine.imagefsVolumeType`   | Specifies the [volume type][azure_volume_types] to mount on each machine in a node-pool.                      | `Standard_LRS`          | `Standard_LRS`    |
| `machine.imagefsVolumeDevice` | Specifies the [volume's device name][azure_volume_types] that will be mounted on each machine.                | `xvdb`         | `xvdb`    |
| `machine.type`                | Specifies the [Azure instance type][azure_instance_types] to use.                                               | `Standard_DS3_v2`    | `Standard_DS2_v2`  |
| `machine.azure.subnetIDs`       | Specifies the [Azure Subnet][azure_subnet_ids] to launch instances unto.                                   | `[]`           | `[]`        |

### spec.sshCredentials

| Parameter                       | Description                                                                                      | Default                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `sshCredentials.user`           | Specifies the user name to use when accessing a machine throough ssh.                            | `centos`                |
| `sshCredentials.publicKeyFile`  | Specifies the path and name of the public key file to use when accessing a machine through ssh.  | `<clustername>`-ssh.pub |
| `sshCredentials.privateKeyFile` | Specifies the path and name of the private key file to use when accessing a machine through ssh. | `<clustername>`-ssh.pem |

## ClusterConfiguration settings

| Parameter               | Description                            | Default                                  |
| ----------------------- | -------------------------------------- | ---------------------------------------- |
| `spec.kubernetes`       | Defines Kubernetes-specific properties. | See [spec.kubernetes](#speckubernetes)  |
| `spec.containerRuntime` | Specifies the container runtime to use.         | See [spec.containerRuntime](#speccontainerruntime) |
| `spec.containerNetworking` | Specifies the container networking to use.          | See [spec.containerNetworking](#speccontainernetworking) |
| `spec.imageRegistries`  | Specifies the container image registries authentication details. | See [spec.imageRegistries](#specimageregistries) |
| `spec.osPackages`       | Configure OS packages repositories. | See [spec.osPackages](#specosPackages) |
| `spec.nodePools`        | Specifies the nodePool configuration.         | See [spec.nodePools](#specnodepools) |
| `spec.addons`           | Specifies the list of addons that can be deployed.  | See [spec.addons](#specaddons) |
| `spec.version`          | version of a konvoy cluster            | `v1.2.0`                                |

### spec.kubernetes

| Parameter                      | Description                                                 | Default                 |
| ------------------------------ | ----------------------------------------------------------- | ----------------------- |
| `kubernetes.version`           | Specifies the version of Kubernetes to deploy.  | `1.16.8`                |
| `kubernetes.controlPlane`      | Specifies the object that defines control plane configuration.       | See [spec.kubernetes.controlPlane](#speckubernetescontrolplane) |
| `kubernetes.networking`        | Specifies the object that defines cluster networking.          | See [spec.kubernetes.networking](#speckubernetesnetworking) |
| `kubernetes.cloudProvider`     | Specifies the object that defines which cloud-provider to enable.    | See [spec.kubernetes.clouldProvider](#speckubernetescloudprovider)  |
| `kubernetes.podSecurityPolicy` | Specifies the object that defines whether to enable pod security policies. | See [spec.kubernetes.podSecurityPolicy](#speckubernetespodsecuritypolicy)    |
| `kubernetes.preflightChecks`   | Specifies the object that defines what errors to ignore for Ansible pre-flight checks. | See [spec.kubernetes.preflightChecks](#speckubernetespreflightchecks)    |

#### spec.kubernetes.controlPlane

| Parameter                                  | Description                                                    | Default  |
| ------------------------------------------ | -------------------------------------------------------------- | -------- |
| `controlPlane.controlPlaneEndpointOverride`| Overrides the `control_plane_endpoint` from `inventory.yaml`.  | `""`      |
| `controlPlane.certificate`                 | certificate related configurations for the control plane       | see [spec.kubernetes.controlPlane.certificate](#speckubernetescontrolplanecertificate) |
| `controlPlane.keepalived`                  | Specifies the object that defines keepalived configuration.    | See [spec.kubernetes.controlPlane.keepalived](#speckubernetescontrolplanekeepalived)  |

##### spec.kubernetes.controlPlane.certificate

| Parameter                             | Description                                                    | Default  |
| --------------------------------------| ---------------------------------------------------------------| -------- |
| `certificate.subjectAlternativeNames` | Subject Alternative Names (SAN) for the control plane endpoint | `[]`     |

##### spec.kubernetes.controlPlane.keepalived

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

#### spec.kubernetes.kubelet

| Parameter            | Description               | Default |
| -------------------- | ------------------------- | ------- |
| `kubelet.cgroupRoot` | Specifies the`--cgroup-root` flag for the Kubelet. | `""` |

### spec.nodePools

`spec.nodePools` is comprised of an array of `spec.nodePools`.

#### nodePool

| Parameter       | Description                                                                | Default Worker | Default Control-Plane |
| --------------- | -------------------------------------------------------------------------- | ----------- | ------------ |
| `name`          | Specifies the nodePool name corresponding to one in ClusterProvisioner.spec.nodePool. | `"worker"`  | "control-plane" |
| `labels`        | Specifies the user-defined `spec.nodePool.labels` to set on all nodes in the nodePool.   | See [spec.nodePool.labels](#specnodepoolslabels) | See [spec.nodePool.labels](#specnodepoolslabels)   |
| `taints`        | Specifies the user-defined `spec.nodePool.taints` to set on all nodes in the nodePool.  | See [spec.nodePool.taints](#specnodepoolstaints) | See [spec.nodePool.taints](#specnodepoolstaints)   |
| `gpu`           | Specifies configuration for any GPU enabled nodes in the nodePool.  | See [spec.nodePools.gpu](#specnodepoolsgpu) | See [spec.nodePools.gpu](#specnodepoolsgpu)   |

##### spec.nodePools.labels

`spec.nodePools.labels` is comprised of an array of `labels`, the default value is `omitted ([])`.

###### spec.nodePool.label

| Parameter       | Description                                                                | Default    |
| --------------- | ------------ | ---------- |
| `key`           | Specifies the user-defined label key to set on all nodes in the nodePool.    | `omitted ("")`         |
| `value`         | Specifies the user-defined label value to set on all nodes in the nodePool.  | `omitted ("")`         |

##### spec.nodePools.taints

`spec.nodePools.taints` is comprised of an array of `taint`s, the default value is `omitted ([])`.

###### spec.nodePool.taint

| Parameter       | Description                                                                | Default    |
| --------------- | ------------ | ---------- |
| `key`           | Specifies the user-defined taint key to set on all nodes in the nodePool.   | `omitted ("")`         |
| `value`         | Specifies the user-defined taint value to set on all nodes in the nodePool.                | `omitted ("")` |
| `effect`        | Determines the effect of the taint. The valid settings are: `"NoSchedule"`, `"PreferNoSchedule"`, `"NoExecute"`    | `omitted ("")` |

##### spec.nodePools.gpu

| Parameter       | Description               | Default    |
| --------------- | ------------ | ---------- |
| `nvidia`        | Specifies the [NVIDIA][nvidia] specific configuration. | See [spec.nodePools.gpu.nvidia](#specnodepoolsgpunvidia) |

##### spec.nodePools.gpu.nvidia

| Parameter        | Description               | Default    |
| ---------------- | ------------ | ---------- |
| `nvidia.enabled` | Enable to install required [NVIDIA][nvidia] OS packages. | `false` |

### spec.containerRuntime

| Parameter                     | Description                                               | Default  |
| ----------------------------- | --------------------------------------------------------- | -------- |
| `containerRuntime.containerd` | Defines the [containerd][containerd] runtime.          | See [spec.containerRuntime.containerd](#speccontainerruntimecontainerd)    |

#### spec.containerRuntime.containerd

| Parameter               | Description                                                    | Default  |
| ----------------------- | -------------------------------------------------------------- | -------- |
| `containerd.version`    | Specifies the version of the [containerd][containerd] runtime.      | `1.2.5`    |
| `containerd.configData` | Contains data for configuring the [containerd][containerd].    | See [spec.containerRuntime.containerd.configData](#speccontainerruntimecontainerdconfigdata)    |

##### spec.containerRuntime.containerd.configData

| Parameter            | Description                                                          | Default  |
| -------------------- | -------------------------------------------------------------------- | -------- |
| `configData.data`    | Specifies the [TOML configuration][containerd_config] of containerd.             | `""`     |
| `containerd.replace` | Enable to use `configData.data`. otherwise, merge `configData.data` with the internal default. | `false`    |

### spec.containerNetworking

| Parameter                     | Description                                               | Default  |
| ----------------------------- | --------------------------------------------------------- | -------- |
| `containerNetworking.calico`  | Defines the [calico][calico] CNI plugin.                   | See [spec.containerNetworking.calico](#speccontainernetworkingcalico)  |

#### spec.containerNetworking.calico

| Parameter               | Description                                                    | Default  |
| ----------------------- | -------------------------------------------------------------- | --------- |
| `calico.version`        | Specifies the version of the [calico][calico] CNI plugin.      | `v3.13.1` |
| `calico.encapsulation`  | Specifies the encapsulation mode. The supported modes are [ipip](https://docs.projectcalico.org/v3.8/getting-started/kubernetes/installation/config-options#configuring-ip-in-ip) and [vxlan](https://docs.projectcalico.org/v3.8/getting-started/kubernetes/installation/config-options#switching-from-ip-in-ip-to-vxlan) | `ipip` |
| `calico.mtu`            | Specifies the MTU to use for the veth interfaces.              | Depends on `calico.encapsulation` and provisioner |

### spec.osPackages

| Parameter                   | Description               | Default |
| --------------------------- | ------------------------- | ------- |
| `osPackages.enableAdditionalRepositories` | enable the installation of Mesosphere, Kubernetes and Docker OS repositories  | `true` |

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

| Parameter                 | Description                                            | Default       |
| ------------------------- | ------------------------------------------------------ | ------------- |
| `addons.configRepository` | Specifies the git repo of the addon configuration files to use.        | `https://github.com/mesosphere/kubernetes-base-addons` |
| `addons.configVersion`    | Specifies the version of the addon configuration files to use.         | `master`  |
| `addons.helmRepository`   | Specifies in-cluster helm configuration used during air-gapped installations. | See [spec.addons.helmRepository](#specaddonshelmrepository) |
| `addons.addonsList`       | Specifies the list of addon objects that can be deployed, if enabled.  | See [spec.addons.addonsList](#specaddonsaddonslist) |

#### spec.addons.helmRepository

| Parameter                 | Description                                            | Default       |
| ------------------------- | ------------------------------------------------------ | ------------- |
| `addons.helmRepository.image` | Specifies the image of the Helm chart to deploy in the cluster used during air-gapped installations. | N/A |

#### spec.addons.addonsList

`spec.addons.addonsList` is comprised of an array of `addon`s. The default values vary depending on the `provider` given on generation.

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
[calico]: https://www.projectcalico.org/
[aws_ami]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html
[aws_iam]: https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html
[aws_role]: https://docs.aws.amazon.com/IAM/latest/APIReference/API_Role.html
[aws_vpc_and_subnets]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html
[aws_route_table]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html
[aws_internet_gateway]: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
[aws_vpc_endpoints]: https://docs.aws.amazon.com/vpc/latest/userguide/vpce-interface.html
[aws_elb]: https://aws.amazon.com/elasticloadbalancing/
[nvidia]: https://docs.nvidia.com/datacenter/kubernetes/kubernetes-upstream/index.html
[azure_imageiD]: https://azure.microsoft.com/en-in/blog/vm-image-blog-post/
[azure_location]: https://azure.microsoft.com/en-us/global-infrastructure/locations/
[azure_vnet]: https://docs.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview
[azure_loadbalancer]: https://docs.microsoft.com/en-us/azure/load-balancer/load-balancer-overview
[availability_set]: https://docs.microsoft.com/en-us/azure/virtual-machines/windows/manage-availability
[azure_tags]: https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources
[azure_volume_types]: https://docs.microsoft.com/en-us/rest/api/compute/disks/createorupdate#diskstorageaccounttypes
