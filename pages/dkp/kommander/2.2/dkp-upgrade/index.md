---
layout: layout.pug
navigationTitle: Upgrade DKP
title: How to upgrade DKP via CLI
menuWeight: 8
excerpt: Upgrade DKP to the latest version
beta: false
---

The DKP upgrade represents an important step of your environment's lifecycle, as it ensures that you are up-to-date with the latest features and can benefit from the latest improvements, enhanced cluster management, and better performance. This section describes how to upgrade your networked, air-gapped or on-prem environment to the latest version of DKP.

<p class="message--warning"><strong>WARNING: </strong>Upgrade your Platform Applications and Catalog Applications before proceeding. Some applications in the previous release do not support the [current version of Kubernetes][release_notes], and upgrading Kubernetes is part of the Konvoy upgrade process.
</p>

## Understand the upgrade process

When upgrading DKP, the process is different depending on if you run a stand-alone Management Cluster, or if you run a multi-cluster environment that includes a combination of a Management Cluster and Workspace Clusters (Attached or Managed Clusters).

The overall process for upgrading to the latest version of DKP must be done on each Workspace or cluster, and has the following high-level steps.

   For **Kommander**, on your Management Cluster:

1.  [**Upgrade Kommander**][upgrade_kommander], which upgrades all Platform Applications.

    If you do not have any Managed or Attached Clusters, skip to upgrading Konvoy on your Management Cluster.
    

   For **Kommander**, on your Workspaces (which include Management and Managed clusters):

1.  [**Upgrade Kommander on your Workspaces**][upgrade_workspaces], which upgrades all Platform Applications on your Workspace Clusters (Workspace Clusters can include Attached and Managed Clusters).

1.  [**Upgrade all DKP Catalog applications**][catalog_apps] deployed to any Workspaces or Projects.

1.  [**Verify any Custom Catalog applications**][custom_apps] and ensure they are compatible with the current Kubernetes version.


   For **Konvoy**, on your Management Cluster:

1.  [**Upgrade Konvoy’s CAPI components**][]. This upgrades the CAPI controllers, which only run on the Management Cluster.

1.  [**Upgrade the Core Addons**][]. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery.

1.  [**Upgrade the Kubernetes version**][]. This upgrades your cluster’s control plane & node pools.

    If you do not have any Managed or Attached Clusters, you have finished the upgrade process and can start testing your environment. If you have Managed Clusters, continue with the next section.
    

   For **Konvoy**, on your Managed Clusters:

1.  [**Upgrade the Core Addons**][]. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery.

1.  [**Upgrade the Kubernetes version**][]. This upgrades your cluster’s control plane & node pools. You may also want to upgrade your Kubernetes version on any Attached clusters.

<!-- [custom_apps]: -->
[catalog_apps]: ../workspaces/applications/catalog-applications/
[upgrade_kommander]: /dkp/kommander/2.2/dkp-upgrade/upgrade-kommander/
[release_notes]: ../release-notes
<!-- [upgrade_workspaces]: -->
