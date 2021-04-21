---
layout: layout.pug
navigationTitle: Attach a cluster with networking restrictions
title: Attach a cluster with networking restrictions
menuWeight: 10
excerpt: How to attach an existing cluster that has additional networking restrictions
beta: true
---

Use this option when you want to attach a cluster that is in a DMZ, behind a proxy server or a firewall, or that requires additional access information. This procedure gathers the information required to create a kubeconfig file for the network tunnel between Kommander and the cluster you want to attach.

1. In the selected workspace Dashboard, select the **Add Cluster** option in the **Actions** dropdown menu at the top right.

1. In the Add Cluster page, select **Attach Cluster**.

1. Select the **Cluster has networking restrictions** card to display the configuration page.

1. Enter the **Cluster Name** and select a **Workspace** from the dropdown list (if entering the Add Cluster menu from the Global workspace).

1. Create one or more new Labels as needed.

1. Enter the **Load Balancer Hostname** which is the Ingress for the cluster, and its related **URL Path Prefix**.

1. (Optional) Enter a value for the **Hostname** field.

1. Select the **Root CA Certificate** from the list of available Secrets, and add any **Extra Annotations** as needed.

1. Select the **Save & Generate kubeconfig** button to generate the kubeconfig file for the network tunnel.

After the above is complete, [finish attaching the cluster to Kommander][finish-attaching-cluster].

As an alternative procedure, you can follow these instructions to [Use CLI to Add Managed Clusters to Kommander][tunnel-cli].

[finish-attaching-cluster]: /dkp/kommander/1.4/clusters/attach-cluster/finish-attaching-cluster/
[tunnel-cli]: /dkp/kommander/1.4/clusters/tunnel-cli/
