---
layout: layout.pug
navigationTitle: On Premises
title: On Premises
menuWeight: 15
excerpt: Configure a cluster for On Premises operation
enterprise: false
beta: true
---

To create a cluster on your on premises infrastructure, follow the procedure that describes installing Konvoy on a [pre-provisioned infrastructure](../pre-provisioned) using SSH access.

This is an infrastructure provider - tasked with managing provider-specific resources for clusters and machines.

Cluster API (CAPI) uses an Infrastructure Providers concept. For on premises environments, there may not be a programmatic API to create and delete infrastructure, or other teams or departments may be responsible for pre-provisioning this infrastructure. In these cases, Konvoy uses its own pre-provisioned infrastructure provider that relies on having SSH access to the machines and executes the bootstrap steps through SSH.

To use the pre-provisioned infrastructure provider, use [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) to ensure that the correct versions of kubeadm, kubelet, and containerd are installed with their relevant configurations to enable Konvoy to run on your infrastructure. Then use the `dkp` CLI to install Konvoy on your infrastructure.

Completing this procedure produces a Kubernetes cluster, including a Container Networking Interface (CNI), that is ready for workload deployment.

Before moving to a production environment, you may want to add applications for logging and monitoring, storage, security, and other functions. You can use [Kommander](https://docs.d2iq.com/dkp/kommander/2.0/release-notes/) to select and deploy applications, or deploy your own.
