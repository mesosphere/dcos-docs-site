---
layout: layout.pug
beta: false
navigationTitle: Creating Konvoy Clusters on AWS
title: Creating Konvoy Clusters on AWS
menuWeight: 30
excerpt: A guide for creating Konvoy clusters on AWS
---

## Before you begin

- Configure an [AWS Infrastructure Provider](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials/), or add credentials using [AWS role credentials](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-roles/).

## Simplified Cluster Creation on AWS

1. In the selected workspace Dashboard, select the **Add Cluster** option in the **Actions** dropdown menu at the top right.

1. On the Add Cluster page, select the **Create Konvoy Cluster**.

1. Provide some basic cluster details within the form:

    - **Workspace**: The workspace where this cluster belongs (if within the Global workspace).
    - **Kubernetes Version**: The initial version of Kubernetes to install on the cluster.
    - **Name**: A valid Kubernetes name for the cluster.
    - **Add Labels**: By default, your cluster has labels that reflect the infrastructure provider provisioning. For example, your AWS cluster may have a label for the data center region and `provider: aws`. Cluster labels are matched to the selectors created for [projects][projects]. Changing a cluster label may add or remove the cluster from projects.

1. Select the pre-configured [AWS infrastructure provider](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-static-credentials/) (or [AWS role credentials](../../operations/infrastructure-providers/configure-aws-infrastructure-provider-roles/)) to display the remaining options specific to AWS.

    -   **Region**: Select a data center region or specify a custom region.
    -   **Configure Node Pools**: Specify pools of nodes, their machine types, quantity, and the IAM instance profile.
        - **Machine Type**: Machine instance type.
        - **Quantity**: Number of nodes. The control plane must be an odd number.
        - **IAM instance profile**: Name of the IAM instance profile to assign to the machines.
    -   **AMI Image Lookup**: You can also specify the base OS, lookup format, and owner ID of the AMI Image, or the AMI ID as part of each pool. Clicking 'Show Advanced' within the Configure Node Pools section will show these options.
        - **Base OS**: Base OS for Lookup search.
        - **Lookup Format**: Lookup Format string to generate AMI search name from.
        - **Owner ID**: Owner ID for AMI Lookup search.
        - **AMI ID**: AMI ID to use for all nodes.
    -   **Add Infrastructure Provider Tags**: Specify tags applied on all resources created in your infrastructure for this cluster. Different infrastructure providers have varying restrictions on the usable tags. See the [AWS Tags User Guide][aws-tags] for more information on using tags in AWS.

1. Click **Create** to begin provisioning the Konvoy cluster. This step may take a few minutes, taking time for the cluster to be ready and fully deploy its components. The cluster will retry to join automatically and should resolve once it is fully provisioned.

[aws-tags]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Using_Tags.html
[projects]: ../../projects/
