---
layout: layout.pug
navigationTitle: Node Pools
title: Node Pools
menuWeight: 30
excerpt: Manage Node Pools
beta: true
enterprise: false
---

A node pool is a group of nodes that belong to the same cluster. In a default cluster created by Konvoy, there is one node pool for the worker nodes. All nodes in a node pool have the same configuration. Create additional node pools for more specialized hardware or configuration.

Use [MachineDeployements][machine_deployment] in [CAPI][capi] to implement Node pools.

[machine_deployment]: https://cluster-api.sigs.k8s.io/developer/architecture/controllers/machine-deployment.html
[capi]: https://github.com/kubernetes-sigs/cluster-api
