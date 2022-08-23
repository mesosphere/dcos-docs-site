---
layout: layout.pug
navigationTitle: Upgrade DKP
title: How to upgrade DKP via CLI
menuWeight: 40
excerpt: Upgrade DKP to the latest version
beta: false
---

The DKP upgrade represents an important step of your environment's lifecycle, as it ensures that you are up-to-date with the latest features and can benefit from the most recent improvements, enhanced cluster management, and better performance. This section describes how to upgrade your networked, air-gapped, or on-prem environment to the latest version of DKP.

## Supported upgrade paths

See the [upgrade table in the DKP 2.3 documentation](https://docs.d2iq.com/dkp/2.3/upgrade-dkp#UpgradeDKP-Supportedupgradepaths) for the full upgrade paths supported. 

## Understand the upgrade process

For this release, you perform the upgrade sequentially beginning with DKP Kommander and then moving to DKP Konvoy.

When upgrading DKP, the process is different depending on whether you run a stand-alone Management Cluster, or a multi-cluster environment that includes a combination of a Management cluster and managed or attached workspace clusters.

Start with your Management Cluster in Kommander, and then, if more than one exists, proceed workspace by workspace until complete. You can then move to upgrading Konvoy, cluster by cluster.

The overall process for upgrading to the latest version of DKP is done on each Workspace or cluster, with the following processes:

   For **Kommander**, on your Management Cluster:

1.  [**Upgrade Kommander**][upgrade_kommander], which upgrades all Platform Applications.

    If you do not have any managed or attached clusters, skip to upgrading Konvoy on your Management Cluster.

   For **Kommander**, on your Workspaces (which include Management Cluster and managed or attached clusters):

1.  [**Upgrade Kommander on your Workspaces**][upgrade_workspaces], which upgrades all Platform Applications on your managed or attached workspace clusters.

1.  [**Upgrade all DKP Catalog applications**][catalog_apps_workspaces] deployed to Workspaces.

1.  [**Upgrade all DKP Catalog applications**][catalog_apps_projects] deployed to Projects.

1.  [**Verify any Custom Catalog applications**][custom_apps] and ensure they are compatible with the Kubernetes version included in the [new release][release_notes].

   For **Konvoy**, on your Management Cluster:

1.  [**Upgrade Konvoy’s CAPI components**][upgrade_konvoy_capi]. This upgrades the CAPI controllers, which only run on the Management Cluster.

1.  [**Upgrade the Core Addons**][upgrade_konvoy_core]. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery.

1.  [**Upgrade the Kubernetes version**][upgrade_konvoy_kubernetes]. This upgrades your cluster’s control plane and node pools.

    If you do not have any managed or attached clusters, you have finished the upgrade process and can start testing your environment. If you have managed or attached clusters, continue with the next section.

   For **Konvoy**, on your Managed Clusters:

1.  [**Upgrade the Core Addons**][upgrade_konvoy_core]. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery.

1.  [**Upgrade the Kubernetes version**][upgrade_konvoy_kubernetes]. This upgrades your cluster’s control plane and node pools. We recommend you upgrade your Kubernetes version on any attached clusters.

[custom_apps]: custom-apps
[catalog_apps_projects]: ../../../kommander/2.2/projects/applications/catalog-applications/upgrading-applications/
[catalog_apps_workspaces]: ../../../kommander/2.2/workspaces/applications/catalog-applications/upgrading-applications/
[upgrade_kommander]: upgrade-kommander/
[release_notes]: ../release-notes
[upgrade_workspaces]: ../../../kommander/2.2/cli/dkp/upgrade/workspace
[upgrade_konvoy_capi]: upgrade-konvoy
[upgrade_konvoy_core]: upgrade-konvoy
[upgrade_konvoy_kubernetes]: upgrade-konvoy
