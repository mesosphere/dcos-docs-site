---
layout: layout.pug
navigationTitle: Create a Base OS VM Image
title: Create a Base OS VM Image
menuWeight: 30
excerpt: Create a Base OS VM Image in the VMware vSphere Client
enterprise: false
---

## Create a base OS image in the vSphere client

Creating a base OS image from DVD ISO files is a one-time process. Building a base OS image creates a base vSphere template in your vSphere environment. The base OS image is used by Konvoy Image Builder (KIB) to create a VM template to configure Kubernetes nodes by the DKP vSphere provider afterwards.

While creating the base OS image, it is important to take into consideration the following elements:

1. Storage configuration: we recommend customizing disk partitions and do not configure a SWAP partition.

2. Network configuration: as KIB needs to download and install packages, activating the network is required. 

3. Connect to Red Hat: if using RHEL, registering with Red Hat is required to configure software repositories and install software packages. 

4. Software selection: we recommend choosing "Minimal Install".

5. Create User: In the packer template, a user "builder" with password "builder" is configured by default, so creating this user with administration privileges is a requirement. Please note that, it is possible to configure a custom user and password when building the OS image, however, that requires the Konvoy Image Builder (KIB) configuration to be overridden. To override the default credentials in KIB, a file (overrides.yaml) with the following content should be created:
```
---
packer:  
  ssh_username: "<USERNAME>"    
  ssh_password: "<PASSWORD>"
```

The next step is to [create a vSphere VM template][create-vsphere-template] that contains the CAPI and Kubernetes objects.

[vsphere-doc-base-image]: https://docs.vmware.com/en/VMware-vSphere/index.html
[create-vsphere-template]: ../create-capi-vm-image/
