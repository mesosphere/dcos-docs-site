---
layout: layout.pug
navigationTitle: List Node Pools
title: List Node Pools
menuWeight: 10
excerpt: List node pools for a cluster
enterprise: false
---

## Listing Node Pools

Use this command to list the node pools of a given cluster. This returns specific properties of each node pool so that you can see the name of the machinedeployments.

To list all node pools for a managed cluster, run:

```sh
dkp get nodepools --cluster-name=${CLUSTER_NAME}
```

The expected output is similar to the following example, indicating the desired size of the node pool, the number of replicas ready in the node pool, and the Kubernetes version those nodes are running:

```sh
NODEPOOL                        DESIRED               READY               KUBERNETES VERSION
demo-cluster-md-0               4                     0                   v1.21.3
```
