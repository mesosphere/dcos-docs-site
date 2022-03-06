---
layout: layout.pug
navigationTitle: Delete Cluster
title: Delete Cluster
menuWeight: 40
excerpt: Delete the Kubernetes cluster and cleanup your environment
beta: false
enterprise: false
---

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait several minutes:

    ```sh
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    dkp delete bootstrap
    ```
