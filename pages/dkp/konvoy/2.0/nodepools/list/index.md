---
layout: layout.pug
navigationTitle: List Node Pools
title: List Node Pools
menuWeight: 10
excerpt: List node pools for a cluster
enterprise: false
---

## Listing Node Pools

To list all node pools for a managed cluster, run:

```sh
konvoy get nodepools --cluseter-name=${CLUSTER_NAME}
```

The expected output is similar to the following example, indicating the desired size of the node pool, the number of replicas ready in the node pool, and the Kubernetes version those nodes are running:

```sh
NODEPOOL                        DESIRED               READY               KUBERNETES VERSION
demo-cluster-md-0               2                     0                   v1.20.8
```
