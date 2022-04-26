---
layout: layout.pug
navigationTitle: List Node Pools
title: List Node Pools
menuWeight: 20
excerpt: List node pools for a cluster
enterprise: false
---

## Listing Node Pools

Use this command to list the node pools of a given cluster. This returns specific properties of each node pool so that you can see the name of the MachineDeployments.

To list all node pools for a managed cluster, run:

```bash
dkp get nodepools --cluster-name=${CLUSTER_NAME} --kubeconfig=${CLUSTER_NAME}.conf
```

The expected output is similar to the following example, indicating the desired size of the node pool, the number of replicas ready in the node pool, and the Kubernetes version those nodes are running:

```sh
NODEPOOL                           DESIRED               READY               KUBERNETES VERSION               
example                            3                     3                   v1.22.8                          
aws-example-md-0                   4                     4                   v1.22.8
```
