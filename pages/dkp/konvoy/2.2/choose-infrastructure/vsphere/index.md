---
layout: layout.pug
navigationTitle: vSphere
title: vSphere
menuWeight: 10
excerpt: Creating DKP clusters in a VMware vSphere environment
beta: true
enterprise: false
---

## Overview of the Process

This diagram illustrates the overall process:

![vSphere Image Creation](/dkp/konvoy/2.2/img/build-vsphere-ova.png)

The workflow on the left shows the creation of a base OS image in the vCenter vSphere client using inputs from Packer. The workflow on the right shows how DKP uses that same base OS image to create CAPI-enabled VM images for your cluster.

After creating the base image, the DKP image builder uses it to create a CAPI-enabled vSpher template that includes the Kubernetes objects for the cluster. You can use that resulting template with the DKP `create cluster` command to create the VM nodes in your cluster directly on a vCenter server. From that point, you can use DKP to provision and manage your cluster.

To get started, fulfill the [prerequisites][prerequisites].

[prerequisites]: prerequisites
