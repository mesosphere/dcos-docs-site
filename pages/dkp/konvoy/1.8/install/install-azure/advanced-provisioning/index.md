---
layout: layout.pug
navigationTitle: Advanced provisioning options (Azure)
title: Advanced provisioning options (Azure)
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on Azure
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

The topics in this section describe advanced provisioning and configuration options for Konvoy when deploying on Azure.

# Customize region and availability zones

Konvoy supports provisioning hosts across fault and update domains in an Azure location.
For instance, the following configuration will instruct Konvoy to provision hosts across the three fault and update domains in `eastus2` location.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: azure
  azure:
    location: eastus2
    availabilitySet:
      faultDomainCount: 3
      updateDomainCount: 3
```

# Customize instance types, volumes and OS Image

Konvoy allows users to customize instance types, volumes and OS images for their clusters like the following:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: azure
  azure:
    location: eastus2
    availabilitySet:
      faultDomainCount: 3
      updateDomainCount: 3
  nodePools:
  - name: worker
    count: 6
    machine:
      imageID: OpenLogic:CentOS:7_9-gen2:7.9.2021020401
      rootVolumeSize: 80
      rootVolumeType: Standard_LRS
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: Standard_LRS
      type: Standard_D8s_v3
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      imageID: OpenLogic:CentOS:7_9-gen2:7.9.2021020401
      rootVolumeSize: 80
      rootVolumeType: StandardSSD_LRS
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: Standard_LRS
      type: Standard_D4s_v3
```

## Instance types

For each [node pool][node_pools], the user can customize the instance type for instances in that node pool (that is, `type` field).

All the available virtual machine sizes can be found [in the Microsoft Azure documentation][virtual_machine_sizes].

## Instance volumes

For each [node pool][node_pools], the user can customize the instance volumes attached to the instances in that node pool.
These are the two types of instance volumes:

* Root volume: this is the root disk for providing [ephemeral storage][ephemeral_storage] for the Kubernetes node (except container images if imagefs volume is enabled).
* Imagefs volume: this is the dedicated disk for providing storage for container image layers.

Imagefs volume is optional.
If disabled, the root volume will be used to storage container image layers.

Users can customize the sizes (in GB) and [types][disk_sku] of those volumes.

## Azure VM Images

In Azure, you can define existing `URN` for the `imageID` field or use your own images from an available VM Disk Image.

The following Azure Image is used by default for Konvoy cluster deployments:

```text
os_image = {
  publisher = "OpenLogic"
  offer     = "CentOS"
  sku       = "7_9-gen2"
  version   = "7.9.2021020401"
}
```

Konvoy is tested with the `CentOS Linux 7` image.

# Adding custom Terraform resources for provisioning

It is possible to provide custom `*.tf` resource files when provisioning.
If you create additional resource files, they are used along with the default `*.tf` resource files during the provisioning process.

To add custom resource files for provisioning:

1. Create a new directory named `extras/provisioner/` to contain your custom resource files.

    ```bash
    mkdir -p extras/provisioner
    ```

1. Create a file in the `extras/provisioner/` directory to include your custom backend settings.

    ```bash
    cat <<EOF > extras/provisioner/backend.tf
    terraform {
      backend "azurerm" {
        resource_group_name  = "StorageAccount-ResourceGroup"
        storage_account_name = "abcd1234"
        container_name       = "konvoy.tfstate"
        key                  = "${local.cluster_name}.terraform.tfstate"
      }
    }
    EOF
    ```

    Set the `resource_group_name` and `storage_account_name` to the one you already have in use or create a new one beforehand.

    Keep in mind that Konvoy merges any files you add to the `extras/provisioner` directory with the default `*.tf` resource files during the provisioning process.
    If you add a file name to the `extras/provisioner` directory that already exists in the default `*.tf` resource files, the contents of the default `*.tf` resource file are replaced with the contents from the custom file you added to the `extras/provisioner` directory.

1. Run the `konvoy up` command.

    As the command runs, the Terraform program merges the resource files and produces output similar to the following:

    ```text
    Successfully configured the backend "azurerm"! Terraform will automatically
    use this backend unless the backend configuration changes.
    ```

    This output in this example indicates that Terraform has successfully merged content from the `backend.tf` resource file and will store the state file in an Azure Storage Account.

## VNET

It is possible to use an existing VNET if so desired.
To do so, you must modify the `cluster.yaml` file and change the `ProvisionerConfig` in the following way:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: azure
  azure:
    location: eastus2
    vnet:
      name: existing-vnet
      resourceGroup: existing-resource-group
      routeTable: existing-route-table
...
```

It is necessary to define the `vnet.name`, `vnet.resourceGroup` and the `vnet.routeTable`.

The default VNET CIDR block that is created by Konvoy is `10.0.0.0/16`, however you may choose to set that to any appropriate block.

It is also possible to set the kube-apiserver load balancer (LB) to be `internal`.
Depending on how your addons are configured, you may also need to add an annotation to use an `internal` LB.

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: azure
  azure:
    location: eastus2
    vnet:
      name: existing-vnet
      resourceGroup: existing-resource-group
      routeTable: existing-route-table
    lb:
      internal: true
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  ...
  addons:
    addonsList:
    - name: traefik
      enabled: true
      values: |
        service:
          annotations:
            service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    - name: velero
      enabled: true
      values: |
        minioBackendConfiguration:
          service:
            annotations:
              service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    - enabled: true
      name: istio
      values: |
        gateways:
          istio-ingressgateway:
            serviceAnnotations:
              service.beta.kubernetes.io/azure-load-balancer-internal: "true"
    ...
```

### Subnets

An existing VNET may already contain `subnets` for use, you may define them in the following way:

```yaml
...
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  provider: azure
  azure:
    location: eastus2
    vnet:
      name: existing-vnet
      resourceGroup: existing-resource-group
      routeTable: existing-route-table
  nodePools:
  - name: worker
    count: 8
    machine:
      rootVolumeSize: 80
      rootVolumeType: Standard_LRS
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: Standard_LRS
      type: Standard_D8S_v3
      azure:
        subnetIDs:
        - existing-subnet-for-konvoy
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      rootVolumeSize: 80
      rootVolumeType: StandardSSD_LRS
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
       imagefsVolumeType: Standard_LRS
      type: Standard_D4S_v3
      azure:
        subnetIDs:
        - existing-subnet-for-control-plane-konvoy
  - name: bastion
    bastion: true
    count: 1
    machine:
      rootVolumeSize: 80
      rootVolumeType: Standard_LRS
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: Standard_LRS
      type: Standard_DS2_v2
      azure:
        subnetIDs:
        - other-subnet
...
```

Failure to define any subnets will mean that Konvoy will attempt to create subnets to cover missing node pools.
That could lead to collisions in CIDR blocks and failure to deploy; in that case we recommend a full list of subnets be known along with the node pools desired.

For the most part the node pools created should exist in a private network configuration, which is Konvoy's default approach.
Bastion hosts allow for secure access to your cluster, but since they do need to be accessed externally they should be deployed with a subnet where public IPs are created.

The default Subnet CIDR that is created by Konvoy is `10.0.64.0/18`

Similarly to the VNET, you may choose to use these blocks or define any other appropriate blocks.

<p class="message--note"><strong>NOTE: </strong>Keep in mind that the default value of <tt>spec.kubernetes.networking.serviceSubnet</tt> is set to <tt>10.0.0.0/18</tt> and the default value of <tt>spec.kubernetes.networking.podSubnet</tt> is set to <tt>10.0.128.0/18</tt>.The blocks you choose must not overlap with the <tt>serviceSubnet</tt> and <tt>podSubnet</tt>.</p>

# Deploying Additional Kubernetes Resources

It is possible to provide additional Kubernetes resources that will be deployed after the base cluster is provisioned but before any of the addons are deployed.

To add custom resource files:

1. Create a new directory named `extras/kubernetes/` to contain your custom resource files.

    ```bash
    mkdir -p extras/kubernetes
    ```

1. Create the desired Kubernetes resource files in the `extras/kubernetes/` directory.

1. Run the `konvoy up`, `konvoy deploy` or `konvoy deploy kubernetes` command.

    After the `[Deploying Kubernetes]` and `[Adding Node Labels and Taints]` phases, a phase will run that will deploy all the resource files provided in `extras/kubernetes/`:

    ```bash
    STAGE [Deploying Additional Kubernetes Resources]

    secrets/my-secret created
    ...
    ```

[node_pools]: ../../node-pools/
[virtual_machine_sizes]: https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes
[ephemeral_storage]: ../../../storage/
[disk_sku]: https://docs.microsoft.com/en-us/rest/api/compute/disks/createorupdate#disksku
