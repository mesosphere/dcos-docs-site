---
layout: layout.pug
navigationTitle: Troubleshoot OIDC and Dex
title: Troubleshoot OIDC and Dex
menuWeight: 100
excerpt: How to troubleshoot OpenID Connect (OIDC) and Dex
beta: false
enterprise: false
---

## Get username and group information from a token

## View Dex config

Konvoy stores Dex config in the `dex-kubeaddons` secret in the kubeaddons namespace. To view the current settings run the following kubectl command.

```bash
kubectl get --namespace kubeaddons secrets dex-kubeaddons --output=jsonpath='{.data.config\.yaml}' | base64 --decode
```
