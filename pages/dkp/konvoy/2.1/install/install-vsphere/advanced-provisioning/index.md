---
layout: layout.pug
navigationTitle: Advanced provisioning options VMWare vSphere (vSphere)
title: Advanced provisioning options VMWare vSphere (vSphere)
menuWeight: 5
excerpt: Configure advanced provisioning options for installing Konvoy on VMWare vSphere (vSphere)
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes advanced provisioning and configuration options for deploying Konvoy on VMWare vSphere (vSphere).

This section covers the following topics:

- Generate a generic deployment file
- Customize instance types, volumes, VM templates, network settings
- vSphere Datastore usage

# Generate a generic deployment file for advanced provisioning

Generating a deployment file is the basis for the entire advanced provisioning options section.
It is also good practice to version this `cluster.yaml` file for repeatable and traceable provisioning.

  ```bash
  konvoy init --provisioner vsphere --cluster-name <YOUR_SPECIFIED_NAME>
  ```

This command automatically downloads the Konvoy docker image and generates 3 files:

- `cluster.yaml` file
- Konvoy private / public keys (pem / pub) for reaching out to Kubernetes nodes.

After customizing the `cluster.yaml` with advanced options, start a cluster:

  ```bash
  konvoy up
  ```

Or, tear down the resources:

  ```bash
  konvoy down
  ```

# Customize instance types, volumes, VM templates, network settings

In Konvoy, you can customize instance types, volumes, and OS images for a cluster:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
metadata:
  name: konvoy
spec:
  provider: vsphere
  vsphere:
    server: vcenter.hw.ca1.ksphere-platform.d2iq.cloud
    port: 443
    datacenters:
      - name: dc1
        cluster: zone1
        network: VMs
        datastore: vsanDatastore
        vmFolder: D2iQ
    username: _YOUR_CLOUD_PROVIDER_USER_NAME_
    password: _YOUR_CLOUD_PROVIDER_USER_PASSWORD_
  nodePools:
  - name: worker
    count: 4
    machine:
      imageID: rhel7
      rootVolumeSize: 80
      rootVolumeType: thin
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: thin
      type: 2xlarge
  - name: control-plane
    controlPlane: true
    count: 3
    machine:
      imageID: rhel7
      rootVolumeSize: 80
      rootVolumeType: thin
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: thin
      type: xlarge
```

## Instance types

Using the `type` field, you can customize the instance type for each node in that [node pool][node_pools].

### Override instance type definitions

To override the instance type definitions:

1. Create an `extras/provisioner` directory next to the `cluster.yaml` file.
2. Change any of the following values to override their instance type definition.

```bash
cat <<EOF > extras/provisioner/variables_override.tf
variable "vsphere_instance_types" {
  default = {
    "large" = {
      "cpus"   = 2,
      "memory" = 8192,
    },
    "xlarge" = {
      "cpus"   = 4,
      "memory" = 16384,
    },
    "2xlarge" = {
      "cpus"   = 8,
      "memory" = 32768,
    }
  }
}
EOF
```

## Instance volumes

You can customize the instance volumes attached to the instances in that [node pool][node_pools]. There are two types of instance volumes:

- **Root volume**: The root disk for providing [ephemeral storage][ephemeral_storage] for the Kubernetes node (except container images if imagefs volume is enabled). The `rootVolumeType` must match your vSphere template root volume type. E.g. `thin`, `lazy` or `eagerZeroedThick`.
- **Imagefs volume**: The dedicated disk for providing storage for container image layers. Imagefs volume is optional. If disabled, the root volume stores container image layers. You can customize the volume sizes (in GB) and the type. E.g. `thin`, `lazy` or `eagerZeroedThick`.

## VM Templates

If the default `centos7` template name is not set to the template on the datastore where the VMs get started, you must change the `imageID` to your own template name.

Konvoy is tested with the `CentOS Linux 7`.

## Network settings

You can provide in each `spec.NodePools` child the `vsphere` specific settings you need for your network:

```yaml
nodePools:
- name: worker
  count: 4
  machine:
    imageID: rhel7
    rootVolumeSize: 80
    rootVolumeType: thin
    imagefsVolumeEnabled: true
    imagefsVolumeSize: 160
    imagefsVolumeType: thin
    type: 2xlarge
    vsphere:
      network:
        global:
          searchDomains:
            - vm.ca1.ksphere-platform.d2iq.cloud
          nameservers:
            - 1.1.1.1
            - 1.0.0.1
          ipv4Gateway: 192.168.72.1
        machines:
          - ipv4Address: 192.168.72.100/24
          - ipv4Address: 192.168.72.101/24
          - ipv4Address: 192.168.72.102/24
          - ipv4Address: 192.168.72.103/24
```

The `ipv4Address` notation is **IP/SubnetCIDR**.
If it is needed, you can add also a static `macAddress` per `ipv4Address`.

```yaml
- ipv4Address: 192.168.72.100/24
  macAddress: 00:50:56:0c:6a:bf
- ipv4Address: 192.168.72.101/24
  macAddress: 00:50:56:0c:6a:ff
```

# vSphere Datastore usage

The vSphere CSI driver supports vSAN, as well as NFS and iSCSI shared storage.
For utilizing NFS or iSCSI shared storage, you need to tag these datastores first.
Tag your NFS storage you want to use with `bronze-nfs` in a category named `Storage`, to have an identifier for the `VM Storage Policy` to be created create next.

## Create a `VM Storage Policy`

- Name it `bronze-nfs`
- Set `Datastore specific rules` flag `Enable tag based placement rules`
- Set `Tag category` to `Storage`
- Set `Usage option` to `Use storage tagged with`
- Add the tag `bronze-nfs`

Now you have a `VM Storage Policy` which we can set in the `vsphere-csi-driver` addon.
Change in the `cluster.yaml` the addon `vsphere-csi-driver` to:

```yaml
        - name: vsphere-csi-driver
          enabled: true
          values: |
            storageclass:
              parameters:
                storagepolicyname: bronze-nfs
```

Now with the initial `konvoy up` the default storageclass is configured to
utilize the vSphere storage with the `vsphere-csi-driver`.

# Adding custom Terraform resources for provisioning

You can provide custom `*.tf` resource files when provisioning.
If you create additional resource files, they are used with the default `*.tf` resource files during the provisioning process.

To add custom resource files for provisioning:

1. Create a new directory named `extras/provisioner/` to contain your custom resource files.

    ```bash
    mkdir -p extras/provisioner
    ```

1. Create a file in the `extras/provisioner/` directory to include your custom backend settings.

    ```bash
    cat <<EOF > extras/provisioner/backend.tf
    terraform {
      backend "swift" {
        container         = "my-konvoy-cluster-terraform-state"
        archive_container = "my-konvoy-cluster-archive"
      }
    }
    EOF
    ```

<p class="message--note"><strong>NOTE: </strong>Konvoy merges any files you add to the <code>extras/provisioner</code> directory with the default <code>*.tf</code> resource files during the provisioning process. If you add a file name to the <code>extras/provisioner</code> directory that already exists in the default <code>*.tf</code> resource files, the contents of the default <code>*.tf</code> resource file are replaced with the contents from the custom file you added to the <code>extras/provisioner</code> directory.</p>

1. Run the `konvoy up` command.

    As the command runs, the Terraform program merges the resource files and produces output similar to the following:

    ```text
    Successfully configured the backend "swift"! Terraform will automatically
    use this backend unless the backend configuration changes.
    ```

    The output, in this example, indicates that Terraform has successfully merged content from the `backend.tf` resource file and stores the state file in your [Swift][swift].

[ephemeral_storage]: ../../../storage/
[node_pools]: ../../node-pools/
[swift]: https://docs.openstack.org/swift/latest
