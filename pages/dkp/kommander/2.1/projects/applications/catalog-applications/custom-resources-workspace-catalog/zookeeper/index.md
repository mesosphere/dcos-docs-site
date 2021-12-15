---
layout: layout.pug
navigationTitle: ZooKeeper
title: ZooKeeper
menuWeight: 5
excerpt: Deploying ZooKeeper in a project
---

## Getting Started

To get started with creating ZooKeeper clusters in your project namespace, you first need to deploy the [ZooKeeper operator](../../../../../workspaces/applications/catalog-applications/zookeeper-operator/) in the workspace where the project exists.

Once you have the ZooKeeper operator deployed, you can create ZooKeeper Clusters by applying a `ZookeeperCluster` custom resource in a project's namespace.

A [Helm chart](https://github.com/pravega/zookeeper-operator/tree/master/charts/zookeeper) exists in the ZooKeeper operator repository that can assist with deploying ZooKeeper clusters.

### Example Deployment

1.  Set the `PROJECT_NAMESPACE` environment variable to the name of your project’s namespace:

    ```bash
    export PROJECT_NAMESPACE=<project namespace>
    ```

1.  Create a ZooKeeper Cluster custom resource in your project namespace

    ```yaml
    kubectl apply -f - <<EOF
    apiVersion: zookeeper.pravega.io/v1beta1
    kind: ZookeeperCluster
    metadata:
      name: zookeeper
      namespace: ${PROJECT_NAMESPACE}
    spec:
      replicas: 1
    EOF
    ```

## Deleting ZooKeeper Clusters

1.  View `ZookeeperClusters` in all namespaces:

    ```bash
    kubectl get zookeeperclusters -A
    ```

1.  Deleting a specific `ZookeeperCluster`:

    ```bash
    kubectl delete zookeepercluster <name of zookeepercluster>
    ```
