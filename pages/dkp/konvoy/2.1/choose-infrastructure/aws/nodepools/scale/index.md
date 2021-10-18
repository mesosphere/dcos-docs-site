---
layout: layout.pug
Delete: Scale Node Pools
title: Scale Node Pools
menuWeight: 30
excerpt: Scale node pools in a cluster
enterprise: false
---

## Scaling Node Pools

While you can run [Cluster Autoscaler](../cluster-autoscaler), you can also manually scale your node pools up or down when you need more finite control over your environment. For example, if you require 10 machines to run a process, you can manually set the scaling to run those 10 machines only. However, if also using the Cluster Autoscaler, you must stay within your miniumum and maximum bounds.

### Scaling Up Node Pools

To scale up a node pool in a cluster, run:

```sh
dkp scale nodepools ${NODEPOOL_NAME} --replicas=5 --cluster-name=${CLUSTER_NAME}
```

Your output should be similar to this example, indicating the scaling is in progress:

```sh
INFO[2021-07-26T08:54:35-07:00] Running scale nodepool command                clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:82"
INFO[2021-07-26T08:54:35-07:00] Nodepool example scaled to 5 replicas  clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:94"
```

After a few minutes you can list the node pools to:

```sh
dkp get nodepools --cluster-name=${CLUSTER_NAME} --kubeconfig=${CLUSTER_NAME}.conf
```

Your output should be similar to this example, with the number of DESIRED and READY replicas increased to 5:

```sh
NODEPOOL                        DESIRED               READY               KUBERNETES VERSION
example                         5                     5                   v1.21.3
demo-cluster-md-0               4                     4                   v1.21.3
```

### Scaling Down Node Pools

To scale down a node pool, run:

```sh
dkp scale nodepools ${NODEPOOL_NAME} --replicas=4 --cluster-name=${CLUSTER_NAME}
```

```sh
INFO[2021-07-26T08:54:35-07:00] Running scale nodepool command                clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:82"
INFO[2021-07-26T08:54:35-07:00] Nodepool example scaled to 4 replicas  clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:94"
```

In a default cluster, the nodes to delete are selected at random. This behavior is controller by [CAPI's delete policy][capi_delete_policy]. However, when using the Konvoy CLI to scale down a node pool it is also possible to specifiy the Kubernetes Nodes you want to delete.

To do this, set the flag `--nodes-to-delete` with a list of nodes as below.
This adds an annotation `cluster.x-k8s.io/delete-machine=yes` to the matching Machine object that contain `status.NodeRef` with the node names from `--nodes-to-delete`.

```sh
dkp scale nodepools ${NODEPOOL_NAME} --replicas=3 --nodes-to-delete=<> --cluster-name=${CLUSTER_NAME}
```

```sh
INFO[2021-07-26T08:54:35-07:00] Running scale nodepool command                clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:82"
INFO[2021-07-26T08:54:35-07:00] Nodepool example scaled to 3 replicas  clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:94"
```

### Scaling Node Pools When Using Cluster Autoscaler

If you [configured the cluster autoscaler](../cluster-autoscaler) for the `demo-cluster-md-0` node pool, the value of `--replicas` must be within the minimum and maximum bounds.

For example, assuming you have the these annotations:

```sh
kubectl --kubeconfig=${CLUSTER_NAME}.conf annotate machinedeployment ${NODEPOOL_NAME} cluster.x-k8s.io/cluster-api-autoscaler-node-group-min-size=2
kubectl --kubeconfig=${CLUSTER_NAME}.conf annotate machinedeployment ${NODEPOOL_NAME} cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size=6
```

Try to scale the node pool to 7 replicas with the command:

```sh
dkp scale nodepools ${NODEPOOL_NAME} --replicas=7 -c demo-cluster
```

Which results in an error similar to:

```sh
INFO[2021-07-26T09:46:37-07:00] Running scale nodepool command                clusterName=demo-cluster managementClusterKubeconfig= namespace=default src="nodepool/scale.go:82"
Error: failed to scale nodepool: scaling MachineDeployment is forbidden: desired replicas 7 is greater than the configured max size annotation cluster.x-k8s.io/cluster-api-autoscaler-node-group-max-size: 6
```

Similarly, scaling down to a number of replicas less than the configured `min-size` also returns an error.

[capi_delete_policy]: https://github.com/kubernetes-sigs/cluster-api/blob/v0.4.0/api/v1alpha4/machineset_types.go#L85-L105
