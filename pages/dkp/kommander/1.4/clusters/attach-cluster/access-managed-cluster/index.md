---
layout: layout.pug
navigationTitle: Access a managed cluster
title: Access a managed cluster
menuWeight: 50
excerpt: How to access an attached (managed) cluster with Kommander credentials
beta: true
---

## Accessing your managed clusters using your Kommander administrator credentials

After the cluster is successfully attached and you can access the user interface, you can retrieve a custom kubeconfig file.

1. Select the Kommander username in the top right corner, and then select **Generate Token**.

1. Select the attached cluster name, and follow the instructions to assemble a kubeconfig for accessing its Kubernetes API.

You can also retrieve a custom kubeconfig file by visiting the `/token` endpoint on the Kommander cluster domain. Selecting the attached cluster name displays the instructions to assemble a kubeconfig for accessing its Kubernetes API.
