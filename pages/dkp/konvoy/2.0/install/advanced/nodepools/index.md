---
layout: layout.pug
navigationTitle: Node Pools
title: Node Pools
menuWeight: 28
excerpt: Create and manage node pools for the Konvoy cluster
enterprise: false
---

## Node Pools

In this section, you will learn how to configure multiple node pools for a Konvoy cluster. Node pools allow the cluster administrator to use different configurations for different sets of worker nodes in a heterogeneous environment.

### Node Pool Prerequisites

Complete the following items before adding new Node Pools to your cluster:

- [Bootstrap Cluster Lifecycle][bootstraplifecycle]
- [Create a new Kubernetes Cluster][createnewcluster]

### Listing Node Pools

To list all Node Pools for a managed cluster run:

```sh
konvoy get nodepool --cluseter-name=demo-cluster
```

The expected output will be similar to the following indicating the desired size of the node pool, the number of replicas ready in the node pool, and the Kubernetes version those nodes are running:

```sh
INFO[2021-07-23T09:55:00-07:00] Running get nodepools command                 clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/get.go:77"
NODEPOOL                        DESIRED               READY               KUBERNETES VERSION
demo-cluster-md-0               2                     0                   v1.20.8
```

[bootstraplifecycle]: ../bootstrap
[createnewcluster]: ../new
