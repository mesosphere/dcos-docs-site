---
layout: layout.pug
navigationTitle: Manage Node Pools
title: Manage Node Pools
menuWeight: 85
excerpt: Manage Node Pools
beta: false
enterprise: false
---

Node pools are part of a cluster and managed as a group, and you can use a node pool to manage a group of machines using the same common properties. When Konvoy creates a new default cluster, there is one node pool for the worker nodes, and all nodes in that new node pool have the same configuration.

You can create additional node pools for more specialized hardware or configuration. For example, if you want to tune your memory usage on a cluster where you need maximum memory for some machines and minimal memory on other machines, you would create a new node pool with those specific resource needs.

Konvoy implements node pools using Cluster API [MachineDeployments][machine_deployment].

[machine_deployment]: https://cluster-api.sigs.k8s.io/developer/architecture/controllers/machine-deployment.html
