---
layout: layout.pug
navigationTitle: On Premises
title: On Premises
menuWeight: 15
excerpt: Configure a cluster for On Premises operation
enterprise: false
beta: false
---

To create a cluster on your on premises infrastructure, follow the procedure that describes creating a Konvoy cluster on a [pre-provisioned infrastructure](../pre-provisioned) using SSH access.

Cluster API (CAPI) has a concept of an [Infrastructure Providers][infrastructure-provider], a set of controllers tasked with managing provider-specific resources for cluster infrastructure and machines via an API. In an on premises environments, there may not be a programmatic API to create and delete infrastructure, or other teams or departments may be responsible for pre-provisioning this infrastructure. In these cases, Konvoy uses its own pre-provisioned infrastructure provider that relies on having SSH access to the machines and executes the bootstrap steps through SSH.

To use the pre-provisioned infrastructure provider, use [Konvoy Image Builder](https://github.com/mesosphere/konvoy-image-builder/releases) to ensure that the correct versions of kubeadm, kubelet, and containerd are installed with their relevant configurations to enable Konvoy to run on your infrastructure. Then use the `dkp` CLI to create a Konvoy cluster on your infrastructure.

Completing this procedure produces a Kubernetes cluster, including a [Container Networking Interface (CNI)][calico] and a [Local Persistence Volume Static Provisioner][lvp], that is ready for workload deployment.

Before moving to a production environment, you may want to add applications for logging and monitoring, storage, security, and other functions. You can use [Kommander](https://docs.d2iq.com/dkp/kommander/2.0/release-notes/) to select and deploy applications, or deploy your own.

To get started, follow the procedure that describes creating a Konvoy cluster on a [pre-provisioned infrastructure](../pre-provisioned).

[calico]: https://docs.projectcalico.org/
[lvp]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[infrastructure-provider]: https://cluster-api.sigs.k8s.io/reference/glossary.html#infrastructure-provider
