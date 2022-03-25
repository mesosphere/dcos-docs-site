---
layout: layout.pug
navigationTitle: Upgrade DKP
title: How to upgrade DKP via CLI
menuWeight: 8
excerpt: Upgrade DKP to the latest version 
beta: false
---

The DKP upgrade process represents an important step of your environment's lifecycle, as it ensures that you are up-to-date with the latest features and can benefit from the latest improvements, enhanced cluster management, and better performance. This section describes how to upgrade your environment to the latest version of DKP.

<p class="message--warning"><strong>WARNING: </strong>Upgrade your Platform applications and Catalog applications before proceeding. Some applications in the previous release do not support Kubernetes 1.22, and upgrading Kubernetes to 1.22 is part of the Konvoy upgrade process.
</p>

## Understand the upgrade process

When upgrading DKP, the process is different depending on if you run a stand-alone Management cluster, or if you run a multi-cluster environment that includes a combination of Management clusters and Workspace clusters, which include attached or managed clusters. 

The overall process for upgrading to the latest version of DKP must be done on each cluster, and has the following high-level steps:

On your Management cluster:

1.  [Upgrade Kommander][upgrade_kommander] and all platform applications. If you don't have any managed clusters, skip to Konvoy. 

On your Managed/Attached/Workspace cluster:

1.  [Upgrade Kommander][upgrade_workspaces] and all platform applications on your Workspace clusters, which includes attached or managed clusters.

1.  [Upgrade all DKP Catalog applications][catalog_apps] deployed to any Workspaces or Projects.

1.  [Upgrade/Verify any custom Catalog applications] your DKP custom catalog applications with the new version. 

<p class="message--warning"><strong>WARNING: </strong>You must maintain your custom applications manually. When upgrading DKP, ensure you validate for compatibility issues any custom applications you run against the current version of Kubernetes. We recommend upgrading to the latest compatible application versions as soon as possible.</p>

On your Management cluster:

1.  **Upgrade Konvoy’s CAPI components**. This upgrades the CAPI controllers, which only run on the Management Cluster.

1.  **Upgrade the Core Addons**. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery. If you are running other clusters than the Management cluster

1.  **Upgrade the Kubernetes version**. This upgrades your cluster’s control plane & node pools. 

Single cluster experience ppl are done. 

On your Managed clusters:

1. **Upgrade the Core Addons**. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery. If you are running other clusters than the Management cluster, upgrade the core addons on each additional cluster as well.

1. **Upgrade the Kubernetes version**. This upgrades your cluster’s control plane & node pools. If you are running other clusters than the Management cluster, upgrade the Kubernetes version on each additional cluster as well. You may also want to upgrade your Kubernetes version on any attached clusters. 

[upgrade_kommander]: /dkp/kommander/2.2/dkp-upgrade/upgrade-kommander/
[upgrade_workspaces]:
[catalog_apps]: ../workspaces/applications/catalog-applications/
[upgrade_konvoy]:
