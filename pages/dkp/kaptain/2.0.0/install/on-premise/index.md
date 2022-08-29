---
layout: layout.pug
navigationTitle: Install on-premises
title: Install Kaptain on an on-premises cluster
menuWeight: 3
excerpt: Install Kaptain on an on-premises cluster
beta: false
enterprise: false
---
## Prerequisites

Ensure you meet all [prerequisites](../prerequisites/).

## On-Premise Installation

Kaptain natively supports the installation on an on premise cluster. Before installing Kaptain, please follow the [Konvoy On Premises Installation Guide][konvoy-on-prem] or [Kommander Installation Guide in a networked environment][dkp-install] to set up the on premise cluster. The cluster admin is responsible for configuring the cluster correctly and ensuring the requisite cluster-level applications are enabled.

Please note that the IP address of the Kaptain UI will come from the IP address range that is configured in the [MetalLB load balancer][metallb-load-balancer].

## Install Kaptain

When your cluster is ready, [install Kaptain](../) by adding Kaptain to your DKP Catalog Applications and deploying it to your clusters.

[konvoy-on-prem]: ../../../../konvoy/2.2/choose-infrastructure/on-prem/
[dkp-install]: /dkp/kommander/latest/networking/load-balancing#on-premises
[metallb-load-balancer]: ../../../../konvoy/2.2/choose-infrastructure/pre-provisioned/metal-lb/
