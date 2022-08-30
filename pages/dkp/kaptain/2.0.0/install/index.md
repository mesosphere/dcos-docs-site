---
layout: layout.pug
navigationTitle: Install
title: Install Kaptain
menuWeight: 7
excerpt: Install Kaptain on your cluster
beta: false
enterprise: false
---

<p class="message--important"><strong>IMPORTANT: </strong>Refer to the <a href="../fresh-install">Kaptain fresh install instructions</a>, if you already have Kaptain and want to move from 1.x to 2.x. Note that it is not possible to migrate your data.</p>

<p class="message--important"><strong>IMPORTANT: </strong>Ensure the cluster that you want to use to deploy Kaptain is the only cluster in its workspace. <bold>Kaptain is meant to be deployed on workspaces with a single cluster**</bold>.</p>

How do you want to deploy Kaptain?

You can install Kaptain:

- On public cloud infrastructure, such as Amazon Web Services (AWS), Microsoft Azure, or Google Cloud Platform (GCP).
- On a company-internal network with a physical (bare metal) or virtual infrastructure.
- On a company-internal network or VPC (virtual private cloud) without an internet connection: air-gapped/private/offline clusters.

The infrastructure you select determines the specific requirements for a successful installation.

## Installation overview

To install and deploy Kaptain for the first time, proceed with these steps:

1.  Ensure you have reviewed all [prerequisites](../install/prerequisites/). If you are installing Kaptain on premises, also review the [on-premise prerequisites](../install/on-premise/) page.

1.  Add Kaptain to your DKP Catalog Applicationd according to your set-up: 

    a. [Networked environment][add_dkp]

    b. [Air-gapped environment for DKP 2.1][add_air_2.1]

    c. [Air-gapped environment for DKP 2.2][add_air_2.2]

1.  [Deploy Kaptain on a per-Workspace basis and verify the status of deployment][deploy].

## Before you begin

Kaptain is a DKP Catalog application. To use it, add it to your repository and then deploy it on selected workspaces. No downloads are necessary for networked environments. For users deploying to air-gapped environments, refer to the [download][download] page.

You can deploy Kaptain to single and multi-cluster environments. The difference between these setups is the following: In a single-cluster environment (with an Essential license), you deploy on one Management cluster only. In a multi-cluster environment (with an Enterprise license), Kaptain is deployed to either one or several Managed clusters or to Attached clusters.

You can deploy Kaptain on a per-workspace basis.

<p class="message--warning"><strong>WARNING: </strong>You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.</p>

[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[add_dkp]: dkp/
[add_air_2.1]: air-gapped-2.1/
[add_air_2.2]: air-gapped-2.2/
[deploy]: deploy-kaptain
[download]: ../download/
