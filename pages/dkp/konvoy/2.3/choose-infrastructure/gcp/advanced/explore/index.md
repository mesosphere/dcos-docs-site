---
layout: layout.pug
navigationTitle: Explore New Cluster
title: Explore New Cluster
menuWeight: 25
excerpt: Learn to interact with your Kubernetes cluster
enterprise: false
---

This guide explains how to use the command line to interact with your newly deployed Kubernetes cluster.

Before you start, make sure you have created a workload cluster, as described in [Create a New Cluster][createnewcluster].

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

[bootstrap]: ../bootstrap
[capi_concepts]: https://cluster-api.sigs.k8s.io/user/concepts.html
[download_aws_cli]: https://aws.amazon.com/cli/
[k8s_custom_resources]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/