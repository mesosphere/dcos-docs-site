---
layout: layout.pug
navigationTitle: Creating Konvoy Clusters on Azure
title: Creating Konvoy Clusters on Azure
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on Azure
---

## Prerequisites

Configured [Azure Cloud Provider](/ksphere/kommander/latest/operations/cloud-providers/#configuring-an-azure-cloud-provider)

## Simplified Cluster Creation on Azure

![Add Cluster Options](../../../img/add-cluster.png)

From the Add Cluster menu, select the Create Konvoy Cluster and provide some basic cluster details:

- **Workspace**: The workspace to which this cluster belongs
- **Kubernetes Version**: Indicates the initial version of Kubernetes to install on the cluster.
- **Name**: A display name for referencing the cluster

Now select the preconfigured [Azure Cloud Provider](/ksphere/kommander/latest/operations/cloud-providers/#configuring-an-azure-cloud-provider) to display the remaining options that are specific to Azure.

- **Region**: Select the datacenter region to reveal selectable Availability Zones. [Azure maintains multiple datacenters per region](azure-regions) to provide redundancy and availability.
- **VNET Name**: A virtual network name in which to create this cluster.
- **VNET Resource Group**: The resource group to which Azure assets will be assigned
- **VNET Route Table**: HELP NEEDED
- **Configure Node Pools**: Allows you to specify pools of nodes, their size, and quantity. By default, a control plane pool containing 3 Standard_DS3_v2 nodes and a worker pool containing 6 Standard_DS3_v2 nodes are suggested. Additionally, you can specify labels, node taints, and subnet ID's as part of each pool.
- **Add Cloud Provider Tags**: Allows you specify tags to be set on all resources created in your cloud provider for this cluster. You can add up to 10 tags in this form. Different cloud providers have varying restrictions on their tags. See the [AWS Tags User Guide][aws_tags] for more information about using tags in AWS.
- **Add Labels**: By default, your cluster will have some suggested labels applied to it that reflect the cloud provider provisioning. For example, in AWS your cluster may be labelled with the datacenter region as well as `provider: aws`. Cluster labels are matched to the selectors created for projects. Changing a cluster’s labels may add or remove the cluster from projects.

[azure-regions]: https://azure.microsoft.com/en-us/global-infrastructure/regions/
