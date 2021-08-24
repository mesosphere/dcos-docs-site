---
layout: layout.pug
navigationTitle: Pre-provisioned
title: Pre-provisioned
menuWeight: 30
excerpt: Create a Kubernetes cluster on pre-provisioned infrastructure
enterprise: false
beta: true
---

<!-- markdownlint-disable MD030 MD034 -->

The following procedure describes installing Konvoy on a pre-provisioned infrastructure using SSH.

First you will use [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) to ensure that the correct versions of kubeadm, kubelet, and containerd are installed with their relevant configurations to enable Konvoy to run on your infrastructure. Then you use `dkp` CLI to install Konvoy on your infrastructure.

Completing this procedure results in a Kubernetes cluster, including a Container Networking Interface (CNI), that is ready for workload deployment.

Before moving to a production environment, you may want to add applications for logging and monitoring, storage, security, and other functions. You can use [Kommander](https://docs.d2iq.com/dkp/kommander/2.0/release-notes/) to select and deploy applications, or deploy your own.

To get started, be sure that you have fulfilled the [Prerequisites](./prereq-preprov).
