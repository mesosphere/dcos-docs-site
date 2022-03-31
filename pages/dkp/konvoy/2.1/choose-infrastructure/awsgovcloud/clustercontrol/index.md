---
layout: layout.pug
navigationTitle: Cluster Control
title: Cluster Control
menuWeight: 30
excerpt: Add cluster controllers to set up the cluster control plane.
beta: false
enterprise: false
---

## Add cluster controllers

1.  Get the kubeconfig file.

    ```bash
    ./dkp get kubeconfig -c cluster-sbx > cluster-sbx.conf
    ```

1.  Verify the nodes are ‘Ready’.

    ```bash
    kubectl --kubeconfig cluster-sbx.conf get nodes
    ```

1.  Add the ClusterAPI controllers to the cluster

    ```bash
    ./dkp create bootstrap controllers --with-aws-bootstrap-credentials=false --kubeconfig cluster-sbx.conf
    ```

1.  When the workload cluster is ready, move the cluster lifecycle services to the workload cluster.

    ```bash
    ./dkp move --to-kubeconfig cluster-sbx.conf
    ```

1.  Wait for the cluster control-plane to be ready

    ```bash
    kubectl --kubeconfig cluster-sbx.conf wait --for=condition=ControlPlaneReady "clusters/cluster-sbx" --timeout=20m

    // Output
    cluster.cluster.x-k8s.io/aws-example condition met
    ```
