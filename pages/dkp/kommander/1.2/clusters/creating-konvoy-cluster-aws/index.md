---
layout: layout.pug
beta: false
navigationTitle: Creating Konvoy Clusters on AWS
title: Creating Konvoy Clusters on AWS
menuWeight: 7
excerpt: A guide for creating Konvoy clusters on AWS
---

## Before you begin

- Configured [AWS Infrastructure Provider](/dkp/kommander/1.2/operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials/), or adding credentials using [AWS role credentials](/dkp/kommander/1.2/operations/infrastructure-providers/configure-aws-infrastructure-provider-roles/).

## Simplified Cluster Creation on AWS

![Add Cluster Options](/dkp/kommander/1.2/img/add-cluster.png)

From the **Add Cluster** menu, select the **Create Konvoy Cluster** and provide some basic cluster details:

- **Workspace**: The workspace where this cluster belongs.
- **Kubernetes Version**: The initial version of Kubernetes to install on the cluster.
- **Name**: A display name for referencing the cluster.

Select the preconfigured [AWS infrastructure provider](/dkp/kommander/1.2/operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials/) (or [AWS role credentials](/dkp/kommander/1.2/operations/infrastructure-providers/configure-aws-infrastructure-provider-roles/)) to display the remaining options specific to AWS.

- **Region**: Select the datacenter region to reveal selectable Availability Zones.
- **Availability Zones**: Indicates the availability zones to use for cluster provisioning.
- **Configure Node Pools**: Specify pools of nodes, their size, and quantity. The default suggests a control plane pool containing 3 m5.xlarge nodes and a worker pool containing 4 m5.2xlarge nodes. You can also specify labels, node taints, and subnet ID's as part of each pool.
- **Add Infrastructure Provider Tags**: Specify tags to be set on all resources created in your infrastructure provider for this cluster. You can add up to 10 tags in this form. Different infrastructure providers have varying restrictions on their tags. See the [AWS Tags User Guide](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html) for more information on using tags in AWS.
- **Add Labels**: By default, your cluster has suggested labels that reflect the infrastructure provider provisioning. For example, your AWS cluster may be labelled with the datacenter region and `provider: aws`. Cluster labels are matched to the selectors created for projects. Changing a cluster label may add or remove the cluster from projects.

Select **Continue** to begin provisioning the Konvoy cluster.
