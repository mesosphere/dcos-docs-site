---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 90
excerpt: Delete the Kubernetes cluster and clean up your environment
beta: false
enterprise: false
---

Use this procedure only when you no longer need your cluster, or the bootstrap cluster.

## Delete the Kubernetes cluster

1.  Delete the provisioned Kubernetes cluster and wait several minutes:

    ```sh
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

## Delete the KIND bootstrap cluster

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    dkp delete bootstrap
    ```
