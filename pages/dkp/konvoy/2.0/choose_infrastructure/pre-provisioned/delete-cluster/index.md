---
layout: layout.pug
navigationTitle: Delete the Cluster
title: Delete the Cluster
menuWeight: 80
excerpt: Delete the Kubernetes cluster and/or the bootstrap cluster
beta: true
enterprise: false
---

<!-- markdownlint-disable MD030 MD034 -->

## Delete the Kubernetes cluster

If you need to clean up the workload cluster where the controllers are running, you need first to create a bootstrap cluster, if one doesn’t already exist. You then move the the Kubernetes cluster resources to the bootstrap cluster, and then delete the workload cluster.

If you have a need to remove the Kubernetes cluster, such as for environment cleanup, use this command:

1.  Delete the provisioned Kubernetes cluster awith the command:

    ```sh
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

    This command make take a few minutes to complete its processing:

## Delete the Kubernetes cluster and cleanup your environment

Konvoy deploys all cluster lifecycle services to a bootstrap cluster, which deploys a workload cluster. When the workload cluster is ready, move the cluster lifecycle services to the workload cluster. The workload cluster then manages its own lifecycle. You can use the self-managing cluster to create other clusters, if desired. At the point at which you have a self-managed cluster, you can safely delete the bootstrap cluster with this command:

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    dkp delete bootstrap
    ```
