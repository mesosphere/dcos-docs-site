---
layout: layout.pug
navigationTitle: DKP Upgrade
title: How to upgrade DKP via CLI
menuWeight: 8
excerpt: Upgrade DKP to the latest version and benefit from the full DKP experience.
beta: false
---

This section describes how to upgrade your environment to the latest version of DKP.

The upgrade process represents an important step of your environment's lifecycle, as it ensures that you benefit from the latest improvements, enhanced management of clusters, and better performance.

When upgrading DKP, you must follow several steps that differ depending on your setup. The following indications specify which steps to follow if you are running a stand-alone cluster (Management cluster only) or a multi-cluster environment (Management Cluster with Attached or Managed Clusters).

<p class="message--warning"><strong>WARNING: </strong>Upgrade your Platform and Catalog Applications before upgrading Konvoy. Some applications in the previous release do not support Kubernetes 1.22, and upgrading Kubernetes to 1.22 is part of the Konvoy upgrade process.
</p>

## Understand the upgrade process

The overall process for upgrading to the latest version of DKP has the following high-level steps:

1.  [Upgrade Kommander][upgrade_kommander]. This takes place in your Management Cluster and includes the upgrade of your Platform Applications in that cluster.

1.  [Upgrade your Workspaces][upgrade-workspaces] on a per-Workspace basis, if your environment has additional Workspaces (with Managed or Attached clusters).

1.  [Upgrade all DKP Catalog applications][catalog_apps] that may be deployed to any Workspaces or Projects.

    <p class="message--warning"><strong>WARNING: </strong>Ensure your <strong>Custom</strong> Catalog Applications are compatible with Kubernetes 1.22. If not, upgrade them before continuing with the Konvoy upgrade process. Refer to your Custom Catalog Application provider for information on how to upgrade. 
</p>

1.  [Upgrade Konvoy][upgrade_konvoy]:

    - **Upgrade Konvoy’s CAPI components**. This upgrades the CAPI controllers, which only run on the Management Cluster.
    - **Upgrade the Core Addons**. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery. If you are running other clusters than the Management cluster, upgrade the core addons on each additional cluster as well.
    - **Upgrade the Kubernetes version**. This upgrades your cluster’s control plane & node pools. If you are running other clusters than the Management cluster, upgrade the Kubernetes version on each additional cluster as well.

[upgrade_kommander]: /dkp/kommander/2.2/dkp-upgrade/upgrade-kommander/
[upgrade_workspaces]:
[catalog_apps]: ../workspaces/applications/catalog-applications/
[upgrade_konvoy]:
