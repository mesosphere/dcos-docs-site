---
layout: layout.pug
navigationTitle: Install
title: Install Kaptain
menuWeight: 7
excerpt: Install Kaptain on your cluster
beta: false
enterprise: false
---

<p class="message--important"><strong>IMPORTANT: </strong>Refer to the <a href="../migration">Kaptain migration instructions</a>, if you already have Kaptain and want to move from 1.x to 2.x.</p>

How do you want to deploy Kaptain?

You can install Kaptain:

- On public cloud infrastructure, such as Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
- On a company-internal network with a physical (bare metal) or virtual infrastructure.
- On a company-internal network or VPC (virtual private cloud) without an internet connection: air-gapped/private/offline clusters.

The infrastructure you select determines the specific requirements for a successful installation.

## Before you begin

Kaptain is a DKP Catalog application. To use it, add it to your repository and then deploy it on selected workspaces. No downloads are necessary.

You can deploy Kaptain to single and multi-cluster environments. The difference between these setups is the following: In a single-cluster environment (with an Essential license), you deploy on one Management cluster only. In a multi-cluster environment (with an Enterprise license), Kaptain is deployed to either one or several Managed clusters or to Attached clusters.

You can deploy Kaptain on a per-workspace basis.

<p class="message--warning"><strong>WARNING: </strong>You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.</p>

## Prerequisites

-   A DKP cluster with the following Platform applications enabled:

    - Istio
    - Knative (optional, if KServe is configured to work in `RawDeployment` mode)

-   [`kubectl`][kubectl] on your installation machine

## Install overview

To install and deploy Kaptain for the first time, proceed with these steps:

1.  [Add Kaptain to your DKP Catalog Applications][add_dkp] / [Add Kaptain to your DKP Catalog Application in an air-gapped environment][add_air].

1.  [Deploy Kaptain on a per-Workspace basis and verify the status of deployment][deploy].

[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[on-prem]: ./on-premise
[add_dkp]: dkp/
[add_air]: air-gapped-dkp
[deploy]: deploy-kaptain
