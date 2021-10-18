---
layout: layout.pug
navigationTitle: Pre-provisioned
title: Pre-provisioned
menuWeight: 30
excerpt: Create a Kubernetes cluster on pre-provisioned infrastructure
enterprise: false
beta: false
---

The following procedure describes creating a Konvoy cluster on a pre-provisioned infrastructure using SSH.

First you will use [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) to ensure that the correct versions of kubeadm, kubelet, and containerd are installed with their relevant configurations to enable Konvoy to run on your infrastructure. Then you use `dkp` CLI to create a Konvoy cluster on your infrastructure.

Completing this procedure results in a Kubernetes cluster, including a [Container Networking Interface (CNI)][calico] and a [Local Persistence Volume Static Provisioner][lvp], that is ready for workload deployment.

Before moving to a production environment, you may want to add applications for logging and monitoring, storage, security, and other functions. You can use [Kommander](/dkp/kommander/2.1/release-notes/) to select and deploy applications, or deploy your own.

To get started, be sure that you have fulfilled the [Prerequisites](./prerequisites).

[calico]: https://docs.projectcalico.org/
[lvp]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
