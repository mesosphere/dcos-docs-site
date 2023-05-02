---
layout: layout.pug
navigationTitle: Create a Base OS VM Image
title: Create a Base OS VM Image
menuWeight: 30
excerpt: Create a Base OS VM Image in the VMware vSphere Client
enterprise: false
---

## Create a base OS image in the vSphere client

Creating a base OS image from DVD ISO files is a one-time process. Building a base OS image creates a base vSphere template in your vSphere environment. The base OS image is used by Konvoy Image Builder (KIB) to create a VM template to configure Kubernetes nodes by the DKP vSphere provider.

While creating the base OS image, it is important to take into consideration the following elements:

1.  Storage configuration: D2iQ recommends customizing disk partitions and not configuring a SWAP partition.

1.  Network configuration: as KIB must download and install packages, activating the network is required.

1.  Connect to Red Hat: if using RHEL, registering with Red Hat is required to configure software repositories and install software packages.

1.  Software selection: D2iQ recommends choosing **Minimal Install**.

1.  Create User: Depending on the cluster-api provider, a packer user configuration will vary. For vSphere, a password is [required by default by packer][kib-packer-info]. This user should have administrator privileges. It is possible to configure a custom user and password when building the OS image. However, that requires the Konvoy Image Builder (KIB) configuration to be overridden. DKP advises not to use static usernames and passwords for security reasons, but instead passwords should be generated and a minimum of 20 characters long. To override the default credentials in KIB, a file (`overrides.yaml`) with the following content should be created:

```yaml
---
packer:
  ssh_username: "<USERNAME>"
  ssh_password: "<PASSWORD>"
```

Next, [create a vSphere VM template][create-vsphere-template] that contains the CAPI and Kubernetes objects.

[create-vsphere-template]: ../create-capi-vm-image/
[kib-packer-info]: https://github.com/mesosphere/konvoy-image-builder/blob/eecdd73ec9a1ca07c24962e2637bbab01a44d347/pkg/packer/manifests/vsphere/packer.json.tmpl#L15-L17
[vsphere-doc-base-image]: https://docs.vmware.com/en/VMware-vSphere/index.html
