---
layout: layout.pug
navigationTitle: Access a managed cluster
title: Access a managed cluster
menuWeight: 50
excerpt: How to access an attached (managed) cluster with Kommander credentials
beta: false
---

<!-- markdownlint-disable MD030 -->

## Accessing your managed clusters using your Kommander administrator credentials

After the cluster is successfully attached, you can retrieve a custom kubeconfig file from the UI.

1. Select the Kommander username in the top right corner, and then select **Generate Token**.

1. Select the attached cluster name, and follow the instructions to assemble a kubeconfig for accessing its Kubernetes API. If Kommander prompts you to log in, use the credentials used to first login to the UI.

You can also retrieve a custom kubeconfig file by visiting the `/token` endpoint on the Kommander cluster domain (example URL: `https://your-server-name.your-region-2.elb.service.com/token/`. Selecting the attached cluster name displays the instructions to assemble a kubeconfig for accessing its Kubernetes API.
