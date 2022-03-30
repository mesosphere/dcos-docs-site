---
layout: layout.pug
navigationTitle: Create a Base OS VM Image
title: Create a Base OS VM Image
menuWeight: 30
excerpt: Create a Base OS VM Image in the VMware vSphere Client
enterprise: false
---

### Create a base OS image in the vSphere client

Creating a base OS image from DVD ISO files is a one-time process. Building a base OS image creates a base vSphere template. You use this base image template in DKP to create CAPI Kubernetes images for your cluster as an OVA template.

Refer to the vCenter and vSphere Client documentation for details.

The next step is to [create a vSphere VM template][create-vsphere-template] that contains the CAPI and Kubernetes objects.]

[vsphere-doc-base-image]: https://docs.vmware.com/en/VMware-vSphere/index.html
[create-vsphere-template]: ../create-capi-vm-image/
