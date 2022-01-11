---
layout: layout.pug
navigationTitle: Cluster Control
title: Cluster Control
menuWeight: 10
excerpt: Add cluster controllers to set up the cluster control plane.
beta: false
enterprise: false
---

## Adding cluster controllers

1. Get the kubeconfig file.

```sh
./dkp get kubeconfig -c cluster-sbx > cluster-sbx.conf
```

2. Verify the nodes are ‘Ready’.

```sh
kubectl --kubeconfig cluster-sbx.conf get nodes
```

3. Add the ClusterAPI controllers to the cluster
```sh
./dkp create bootstrap controllers --with-aws-bootstrap-credentials=false --kubeconfig cluster-sbx.conf
```
4. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster.

```sh
./dkp move --to-kubeconfig cluster-sbx.conf
```
5. Wait for the cluster control-plane to be ready

```sh
kubectl --kubeconfig cluster-sbx.conf wait --for=condition=ControlPlaneReady "clusters/cluster-sbx" --timeout=20m

// Output
cluster.cluster.x-k8s.io/aws-example condition met
```
