---
layout: layout.pug
navigationTitle: Attach a cluster with no networking restrictions
title: Attach a cluster with no networking restrictions
menuWeight: 5
excerpt: How to attach an existing cluster that has no additional networking restrictions
beta: true
---

Use this option when you want to attach a cluster that does not require additional access information.

1.  Select the **Attach Cluster** option in the **Actions** dropdown menu at the top right to display the **Connection Information** dialog box.

1.  Paste a kubeconfig file into the field, or select the upload link below the field to specify a file.

1.  Select the intended context or change the display name provided with the config in the **Context** select list

1.  Add labels to classify your cluster as needed.

<!--
1.  Select the platform services to install. Platform services extend the functionality of Kubernetes and allow you to deploy ready-to-use logging and monitoring stacks by federating platform services when attaching a cluster to Kommander. For more information, refer to [workspace platform services](/dkp/kommander/2.0/workspaces/workspace-platform-services/).
-->

1. Select **Submit** to begin the cluster attachment processing.
