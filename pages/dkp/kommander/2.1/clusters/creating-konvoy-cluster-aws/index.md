---
layout: layout.pug
beta: false
navigationTitle: Creating Konvoy Clusters on AWS
title: Creating Konvoy Clusters on AWS
menuWeight: 30
excerpt: A guide for creating Konvoy clusters on AWS
---

## Before you begin

- Configured [AWS Infrastructure Provider](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials/), or adding credentials using [AWS role credentials](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-roles/).

## Simplified Cluster Creation on AWS

From the **Add Cluster** menu, select the **Create Konvoy Cluster** and provide some basic cluster details:

- **Workspace**: The workspace where this cluster belongs.
- **Kubernetes Version**: The initial version of Kubernetes to install on the cluster.
- **Name**: A valid Kubernetes name for the cluster.
- **Add Labels**: By default, your cluster has labels that reflect the infrastructure provider provisioning. For example, your AWS cluster may have a label for the data center region and `provider: aws`. Cluster labels are matched to the selectors created for [projects][projects]. Changing a cluster label may add or remove the cluster from projects.

Select the pre-configured [AWS infrastructure provider](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials/) (or [AWS role credentials](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-roles/)) to display the remaining options specific to AWS.

- **Region**: Select the data center region to reveal selectable Availability Zones.
- **Add Infrastructure Provider Tags**: Specify tags to be set on all resources created in your infrastructure provider for this cluster. You can add up to 10 tags in this form. Different infrastructure providers have varying restrictions on their tags. See the [AWS Tags User Guide][aws-tags] for more information on using tags in AWS.

Click **Create** to begin provisioning the Konvoy cluster. This step may take a few minutes, and the cluster may fail to join initially if it tries to join before the cluster is fully ready. It will retry to join automatically and should resolve once the cluster is fully provisioned.

[aws-tags]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html
[projects]: ../../projects/
