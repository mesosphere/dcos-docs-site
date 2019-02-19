---
layout: layout.pug
navigationTitle: Storing Volumes
title: Storing Volumes
menuWeight: 15
excerpt: How MKE leverages the Amazon EBS CSI driver to manage shared volumes
---


The Container Storage Interface (CSI) is an initiative to standardize container storage among different orchestration technologies. CSI drivers conform to the [CSI specification](../https://github.com/container-storage-interface/spec/blob/master/spec) for storage plugin standardization.
The aim of the CSI is so that storage providers (e.g. Amazon EBS) can develop one plugin that can work for any container orchestration system. CSI has now become generally available in Kubernetes 1.13 and is designed to make Kubernetes more extensible through the addition of volume drivers instead of adding storage features directly to the core Kubernetes code.

Accordingly, MKE takes advantage of the [Amazon EBS CSI driver](github.com/kubernetes-sigs/aws-ebs-csi-driver) when managing the lifecycle of [Amazon EBS volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSVolumes.html) across your Kubernetes clusters. The Amazon EBS CSI driver supports management of both [dynamic](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/) and pre-provisioned Kubernetes volumes.

The [basic tutorial that follows](/tutorial-kubernetes-storage-basic) demonstrates how to setup Kubernetes deployments with both types of volumes.
