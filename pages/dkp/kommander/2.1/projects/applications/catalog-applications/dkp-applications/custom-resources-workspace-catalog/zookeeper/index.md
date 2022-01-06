---
layout: layout.pug
navigationTitle: ZooKeeper
title: ZooKeeper
menuWeight: 5
excerpt: Deploying ZooKeeper in a project
---

## Getting started

To get started with creating ZooKeeper clusters in your project namespace, you first need to deploy the [ZooKeeper operator](../../../../../../workspaces/applications/catalog-applications/dkp-applications/zookeeper-operator/) in the workspace where the project exists.

After you deploy the ZooKeeper operator, you can create ZooKeeper Clusters by applying a `ZookeeperCluster` custom resource **on each attached cluster** in a project's namespace.

A [Helm chart](https://github.com/pravega/zookeeper-operator/tree/master/charts/zookeeper) exists in the ZooKeeper operator repository that can assist with deploying ZooKeeper clusters.

### Example deployment

<p class="message--note"><strong>NOTE: </strong>The Custom Resources must be applied to each attached cluster in a project.</p>

Follow these steps to deploy a ZooKeeper cluster in a project namespace. This procedure results in a running ZooKeeper cluster, ready for use in your project's namespace.

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

1.  Check the status of your ZooKeeper cluster using `kubectl`:

    ```bash
    kubectl get zk -n ${PROJECT_NAMESPACE}
    ```

    ```text
    NAME        REPLICAS   READY REPLICAS    VERSION   DESIRED VERSION   INTERNAL ENDPOINT    EXTERNAL ENDPOINT   AGE
    zookeeper   3          3                 0.2.13    0.2.13            10.100.200.18:2181   N/A                 94s
    ```

## Deleting ZooKeeper clusters

Follow these steps to delete the Zookeeper clusters.

1.  View `ZookeeperClusters` in all namespaces:

    ```bash
    kubectl get zookeeperclusters -A
    ```

1.  Delete a specific `ZookeeperCluster`:

    ```bash
    kubectl -n ${PROJECT_NAMESPACE} delete zookeepercluster <name of zookeepercluster>
    ```

## Resources

- [ZooKeeper Operator Documentation](https://github.com/pravega/zookeeper-operator)
- [ZooKeeper Cluster Helm Chart](https://github.com/pravega/zookeeper-operator/tree/master/charts/zookeeper)
- [ZooKeeper Documentation](https://zookeeper.apache.org/documentation)
