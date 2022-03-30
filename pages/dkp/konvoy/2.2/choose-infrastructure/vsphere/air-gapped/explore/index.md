---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 40

excerpt: Explore the new Kubernetes cluster
beta: false
enterprise: false
---

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file with the command:

    ```sh
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    Note: wait for the Status to move to `Ready` while the `calico-node` pods deploy.

1.  List the Pods with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

When you're ready, [delete your cluster and clean up your environment][delete-cluster].

[delete-cluster]: ../delete
