---
layout: layout.pug
beta: false
navigationTitle: Editing Clusters
title: Editing Clusters
menuWeight: 7
excerpt: Edit a cluster
---

## Edit a cluster

![Edit a Cluster Action](/dkp/kommander/1.3/img/edit-cluster-action.png)

### Edit an attached cluster

For an attached cluster, you can only edit labels assigned to that cluster.

![Edit an Attached Cluster](/dkp/kommander/1.3/img/edit-cluster-attached-1-1-0.png)

### Edit a managed cluster

For a managed cluster, you can edit the following:
- Name
- Kubernetes version
- Labels
- Cloud provider tags
- Node pools.

![Edit a Cluster Form](/dkp/kommander/1.3/img/edit-cluster-form-name-1-1-0.png)

#### Edit a node pool

When editing a node pool, you can only increase the number of nodes in the pool. This prevents losing any workloads currently running on the cluster.

You can also add labels and taints to a node pool.

![Edit a Cluster Node Pools](/dkp/kommander/1.3/img/edit-cluster-node-pools.png)

#### Edit labels and cloud provider tags

When editing labels, you can not delete the region or provider labels.

![Edit a Cluster Labels and Cloud Provider Tags](/dkp/kommander/1.3/img/edit-cluster-labels-tags-1-1-0.png)
