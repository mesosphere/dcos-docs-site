---
layout: layout.pug
navigationTitle: Attach a cluster with networking restrictions
title: Attach a cluster with networking restrictions
menuWeight: 10
excerpt: How to attach an existing cluster that has additional networking restrictions
beta: true
---

Use this option when you want to attach a cluster that is in a DMZ, behind a proxy server or a firewall, or that requires additional access information. This procedure gathers the information required to create a kubeconfig file for the network tunnel between Kommander and the cluster you want to attach.

1. Select the **Attach Cluster** option in the **Actions** dropdown menu at the top right to display the **Connection Information** dialog box.

1. Select the **Attach Cluster with Networking Restrictions** card to display the configuration page.

1. Enter the **Cluster Name** and select a **Workspace** from the dropdown list.

1. Create one or more new Labels as needed.

1. Enter the **Load Balancer Hostname** which is the ingress for the cluster, and its related **URL Path Prefix**.

1. (Optional) Enter a value for the **Hostname** field.

1. Select the **Root CA Certificate** from the list of available Secrets, and add any **Extra Annotations** as needed.

1. Select the **Save & Generate kubeconfig** button to generate the kubeconfig file for the network tunnel.

As an alternative procedure, you can follow these instructions to [Use CLI to Add Managed Clusters to Kommander][tunnel-cli].

[tunnel-cli]: pages/dkp/kommander/1.4/clusters/tunnel-cli
