---
layout: layout.pug
navigationTitle: Delete the Cluster
title: Delete the Cluster
menuWeight: 80
excerpt: Delete the Kubernetes cluster and/or the bootstrap cluster
beta: true
enterprise: false
---

## Delete the Kubernetes cluster

If you have a need to remove the Kubernetes cluster, such as for environment cleanup, use this command:

1.  Delete the provisioned Kubernetes cluster with the command:

    ```sh
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

    This command may take a few minutes to complete:

## Delete the Kubernetes cluster and cleanup your environment

After you have moved the workload resources back to a bootstrap cluster and deleted the workload cluster, you no longer need the bootstrap cluster. You can safely delete the bootstrap cluster with this command:

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    dkp delete bootstrap
    ```
