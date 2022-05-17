---
layout: layout.pug
navigationTitle: Create a New Cluster
title: Create a New Cluster
menuWeight: 20
excerpt: Use Konvoy to create a new Kubernetes cluster
enterprise: false
---

## Prerequisites

- Before you begin, make sure you have created a [Bootstrap][bootstrap] cluster.

## Create a new GCP cluster
????????????????????????????
1. Create the cluster:

    ```
    kubectl apply -f $CLUSTER_NAME/cluster.yaml
    ```


7.  Tail the CAPG controller logs:

    ```
    kubectl logs -n capg-system -l cluster.x-k8s.io/provider=infrastructure-gcp -f
    ```

8.  Check the status of the cluster

    ```
    clusterctl describe cluster $CLUSTER_NAME
    ```

## Explore the cluster

1.  Get the kubeconfig:

    ```
    clusterctl get kubeconfig $CLUSTER_NAME > $CLUSTER_NAME/$CLUSTER_NAME.conf
    export KUBECONFIG=$CLUSTER_NAME/$CLUSTER_NAME.conf
    ```

1.  Verify the API server is up (the Nodes will not be ready until CSI is deployed):

    ```
    kubectl get nodes
    ```