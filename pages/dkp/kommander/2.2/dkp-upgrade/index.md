---
layout: layout.pug
navigationTitle: Upgrade DKP
title: How to upgrade DKP via CLI
menuWeight: 8
excerpt: Upgrade DKP to the latest version
beta: false
---

The DKP upgrade represents an important step of your environment's lifecycle, as it ensures that you are up-to-date with the latest features and can benefit from the latest improvements, enhanced cluster management, and better performance. This section describes how to upgrade your networked, air-gapped or on-prem environment to the latest version of DKP.

<p class="message--warning"><strong>WARNING: </strong>Upgrade your Platform applications and Catalog applications before proceeding. Some applications in the previous release do not support Kubernetes 1.22, and upgrading Kubernetes to 1.22 is part of the Konvoy upgrade process.
</p>

## Understand the upgrade process

When upgrading DKP, the process is different depending on if you run a stand-alone Management cluster, or if you run a multi-cluster environment that includes a combination of a Management cluster and Workspace clusters, which include Attached or Managed clusters.

The overall process for upgrading to the latest version of DKP must be done on each cluster, and has the following high-level steps:

### For Kommander

* On your Management cluster:

1.  [Upgrade Kommander][upgrade_kommander], which upgrades all Platform applications.

    If you don't have any Managed or Attached clusters, skip to upgrading Konvoy.

* On your Workspaces (which include Management and Managed clusters):

1.  [Upgrade Kommander on your Workspaces][upgrade_workspaces], which upgrades all Platform applications on your Workspace clusters (Workspace clusters can include Attached and Managed clusters).

1.  [Upgrade all DKP Catalog applications][catalog_apps] deployed to any Workspaces or Projects.

1.  [Verify any Custom Catalog applications][custom_apps] and ensure they are compatible with the current Kubernetes version.

### For Konvoy

* On your Management cluster:

1.  [**Upgrade Konvoy’s CAPI components**][]. This upgrades the CAPI controllers, which only run on the Management Cluster.

1.  [**Upgrade the Core Addons**][]. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery.

1.  [**Upgrade the Kubernetes version**][]. This upgrades your cluster’s control plane & node pools.

    If you don't have any Managed or Attached clusters, you have finished the upgrade process and can start testing your environment. If you have Managed clusters, continue with the next section.

* On your Managed clusters:

1.  [**Upgrade the Core Addons**][]. This upgrades multiple addons such as CSI, CNI, Cluster Autoscaler, and Node Feature Discovery.

1.  [**Upgrade the Kubernetes version**][]. This upgrades your cluster’s control plane & node pools. You may also want to upgrade your Kubernetes version on any Attached clusters.

[upgrade_kommander]: /dkp/kommander/2.2/dkp-upgrade/upgrade-kommander/
[upgrade_workspaces]:
[catalog_apps]: ../workspaces/applications/catalog-applications/
[custom_apps]:
