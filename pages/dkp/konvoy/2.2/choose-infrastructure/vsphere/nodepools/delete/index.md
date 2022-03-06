---
layout: layout.pug
Delete: Delete Node Pools
title: Delete Node Pools
menuWeight: 40
excerpt: Delete node pools in a cluster
enterprise: false
---

## Delete Node Pools

Deleting a node pool deletes the Kubernetes nodes and the underlying infrastructure. All nodes will be drained prior to deletion and the pods running on those nodes will be rescheduled.

To delete a node pool from a managed cluster, run:

```sh
dkp delete nodepool ${NODEPOOL_NAME} --cluster-name=${CLUSTER_NAME}
```

Here `example` is the node pool to be deleted.

The expected output will be similar to the following example, indicating the node pool is being deleted:

```sh
INFO[2021-07-28T17:14:26-07:00] Running nodepool delete command         Nodepool=example clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/delete.go:80"
```

Deleting an invalid node pool results in output similar to this example:

```sh
%%% need vSphere-specific output
dkp delete nodepool ${CLUSTER_NAME}-md-invalid --cluster-name=${CLUSTER_NAME}

INFO[2021-07-28T17:11:44-07:00] Running nodepool delete command               Nodepool=demo-cluster-md-invalid clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/delete.go:80"
Error: failed to get nodepool with name demo-cluster-md-invalid in namespace default : failed to get nodepool with name demo-cluster-md-invalid in namespace default : machinedeployments.cluster.x-k8s.io "demo-cluster-md-invalid" not found
```
