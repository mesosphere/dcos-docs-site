---
layout: layout.pug
navigationTitle: Install
title: Install Kaptain
menuWeight: 7
excerpt: Install Kaptain on your cluster
beta: false
enterprise: false
---

How do you want to deploy Kaptain?

You can install Kaptain:

- On public cloud infrastructure, such as Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
- On a company-internal network with a physical (bare metal) or virtual infrastructure.
- On a company-internal network or VPC (virtual private cloud) without an internet connection: air-gapped/private/offline clusters.

The infrastructure you select determines the specific requirements for a successful installation.

## Prerequisites

- A Konvoy 1.8 / DKP 2.1 cluster with the following addons / platform applications enabled:

  - Istio
  - Knative

  Follow the appropriate Kaptain [networked][networked], [on-premises][on-prem] or [air-gapped][airgap] installation instructions, depending on your environment.

- [`kubectl`][kubectl] on your installation machine
- [KUDO CLI 0.19.0][kudo] plugin (remember to set `VERSION=0.19.0` if you use the instructions to `wget` from GitHub release page).

[airgap]: ./air-gapped
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[kudo]: https://kudo.dev/docs/cli/installation.html#cli-installation
[networked]: ./konvoy-dkp
[on-prem]: ./on-premise
