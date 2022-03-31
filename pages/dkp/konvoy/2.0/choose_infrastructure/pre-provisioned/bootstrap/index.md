---
layout: layout.pug
navigationTitle: Bootstrap
title: Bootstrap
menuWeight: 30
excerpt: Bootstrap a kind cluster
beta: false
enterprise: false
---

A bootstrap cluster refers to a special type of local Kubernetes cluster used to bootstrap other clusters. The bootstrap cluster is required because the controllers that create other Kubernetes clusters require a Kubernetes cluster to run.

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster. The workload cluster then manages its own lifecycle.

## Bootstrap a kind cluster and CAPI controllers

Use the following command to create a bootstrap cluster:

```bash
dkp create bootstrap
```

When the bootstrap cluster is up, [install an SSH key](../install-ssh-key).
