---
layout: layout.pug
navigationTitle: Creating Konvoy Clusters on Azure
title: Creating Konvoy Clusters on Azure
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on Azure
---

## Before you begin

Configured [Azure Infrastructure Provider](/ksphere/kommander/1.1.0-beta/operations/infrastructure-providers/configure-azure-infrastructure-provider/)

## Simplified Cluster Creation on Azure

![Add Cluster Options](/ksphere/kommander/1.1.0-beta/img/add-cluster.png)

From the **Add Cluster** menu, select the **Create Konvoy Cluster** and provide some basic cluster details:

- **Workspace**: The workspace where this cluster belongs.
- **Kubernetes Version**: The initial version of Kubernetes to install on the cluster.
- **Name**: A display name for referencing the cluster.

Select the preconfigured [Azure Infrastructure Provider](/ksphere/kommander/1.1.0-beta/operations/infrastructure-providers/configure-azure-infrastructure-provider/) to display the options specific to Azure.

- **Region**: Select the datacenter region to reveal selectable Availability Zones. <a href="https://azure.microsoft.com/en-us/global-infrastructure/regions/" target="_blank">Azure maintains multiple datacenters per region</a>.
- **Resource Group**: The resource group where the Azure assets are assigned.
- **VNET Name**: The virtual network name in which to create this cluster.
- **VNET Route Table**: Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. To change any of Azure's default routing, create a <a href="https://docs.microsoft.com/en-us/azure/virtual-network/manage-route-table" target="_blank">route table</a>.
- **Configure Node Pools**: Specify pools of nodes, their size, and quantity. The suggested default is a control plane pool containing 3 Standard_DS3_v2 nodes and a worker pool containing 6 Standard_DS3_v2 nodes. You can also specify labels, node taints, and subnet ID's as part of each pool.
- **Add Infrastructure Provider Tags**: Specify tags on all resources created in your infrastructure provider for this cluster. You can add up to 10 tags in this form. Different infrastructure providers have varying restrictions on their tags. See the <a href="https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources" target="_blank">Azure Tags User Guide</a> for more information about using tags in Azure.
- **Add Labels**: By default, your cluster has some suggested labels that reflect the infrastructure provider provisioning. For example, in Azure your cluster may be labelled with the datacenter region as well as `provider: azure`. Cluster labels are matched to the selectors created for projects. Changing a cluster label may add or remove the cluster from projects.
