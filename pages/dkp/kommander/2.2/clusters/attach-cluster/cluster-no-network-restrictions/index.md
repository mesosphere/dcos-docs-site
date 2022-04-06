---
layout: layout.pug
navigationTitle: Attach a cluster with no networking restrictions
title: Attach a cluster with no networking restrictions
menuWeight: 5
excerpt: How to attach an existing cluster that has no additional networking restrictions
beta: false
---

<!-- markdownlint-disable MD030 -->

Use this option when you want to attach a cluster that does not require additional access information.

1. From the top menu bar, select your target workspace.

1. On the Dashboard page, select the **Add Cluster** option in the **Actions** dropdown menu at the top right.

1. Select **Attach Cluster**.

1. Select the **No additional networking restrictions** card.

1. In the **Cluster Configuration** section, paste your kubeconfig file into the field, or select the **Upload kubeconfig File** button to specify the file.

1. The **Cluster Name** field will automatically populate with the name of the cluster is in the kubeconfig. You can edit this field with the name you want for your cluster.

1. The **Context** select list is populated from the kubeconfig. Select the desired context with admin privileges from the **Context** select list.

1. Add labels to classify your cluster as needed.

1. Select **Submit** to attach your cluster.
