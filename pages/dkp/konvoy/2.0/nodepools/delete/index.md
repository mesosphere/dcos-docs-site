---
layout: layout.pug
Delete: Delete Node Pools
title: Delete Node Pools
menuWeight: 20
excerpt: Delete node pools in a cluster
enterprise: false
---

## Delete Node Pools

To delete a node pool from a managed cluster, run:

```sh
konvoy delete nodepool --cluster-name=${CLUSTER_NAME} demo-cluster-md-0
```

Here `demo-cluster-md-0` is the node pool to be deleted.

The expected output will be similar to the following example, indicating the node pool is being deleted:

```sh
INFO[2021-07-28T17:14:26-07:00] Running nodepool delete command               Nodepool=demo-cluster-md-0 clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/delete.go:80"
```

Deleting an invalid node pool will result in output similar to the following exampe:

```sh
konvoy delete nodepool --cluster-name=${CLUSTER_NAME} demo-cluster-md-invalid

INFO[2021-07-28T17:11:44-07:00] Running nodepool delete command               Nodepool=demo-cluster-md-invalid clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/delete.go:80"
Error: failed to get nodepool with name demo-cluster-md-invalid in namespace default : failed to get nodepool with name demo-cluster-md-invalid in namespace default : machinedeployments.cluster.x-k8s.io "demo-cluster-md-invalid" not found
```
