---
layout: layout.pug
navigationTitle: Create a Base OS VM Image
title: Create a Base OS VM Image
menuWeight: 30
excerpt: Create a Base OS VM Image in the VMware vSphere Client
enterprise: false
---

## Create a base OS image in the vSphere client

Creating a base OS image from DVD ISO files is a one-time process. Building a base OS image creates a base vSphere template in your vSphere environment. You can use the base OS image template to create a Kubernetes node vSphere template for your cluster.

Refer to the vCenter and vSphere Client documentation for details.

The next step is to [create a vSphere VM template][create-vsphere-template] that contains the CAPI and Kubernetes objects.

[vsphere-doc-base-image]: https://docs.vmware.com/en/VMware-vSphere/index.html
[create-vsphere-template]: ../create-capi-vm-image/
