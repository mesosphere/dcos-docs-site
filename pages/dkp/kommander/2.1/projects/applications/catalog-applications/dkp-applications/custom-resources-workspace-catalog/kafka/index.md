---
layout: layout.pug
navigationTitle: Kafka
title: Kafka
menuWeight: 5
excerpt: Deploying Kafka in a project
---

## Getting started

To get started with creating and managing a Kafka Cluster in a project, you first need to deploy the [Kafka operator](../../../../../../workspaces/applications/catalog-applications/dkp-applications/kafka-operator/) and the [ZooKeeper operator](../../../../../../workspaces/applications/catalog-applications/dkp-applications/zookeeper-operator/) in the workspace where the project exists.

After deploying the Kafka operator, create Kafka Clusters by applying a `KafkaCluster` custom resource in a project's namespace. Refer to the [Kafka operator repository](https://github.com/banzaicloud/koperator/tree/master/config/samples) for examples of the custom resources and their configurations.

## Example deployment

This example deployment walks you through first deploying a ZooKeeper cluster and then a Kafka cluster in a project namespace. The result of this procedure is a running ZooKeeper cluster and Kafka cluster ready for use in your project's namespace.

1.  Set the `PROJECT_NAMESPACE` environment variable to the name of your project’s namespace:

    ```bash
    export PROJECT_NAMESPACE=<project namespace>
    ```

1.  Create a ZooKeeper Cluster custom resource in your project's namespace:

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
    kubectl -n ${PROJECT_NAMESPACE} get zookeeper
    ```

1.  Download the [sample Kafka Cluster](https://raw.githubusercontent.com/banzaicloud/koperator/master/config/samples/simplekafkacluster.yaml) file.

1.  Update the following attribute `zkAddresses`, replacing `zookeeper-client.zookeeper:2181` with `zookeeper-client.<project namespace>:2181`. You can use `sed` to update the file:

    -   MacOS sed

        ```bash
        # If you are using sed that comes installed on macOS
        sed -i '' "s/zookeeper-client.zookeeper:2181/zookeeper-client.${PROJECT_NAMESPACE}:2181/g" simplekafkacluster.yaml
        ```

    -   GNU sed

        ```bash
        # If you are using GNU sed
        sed -i "s/zookeeper-client.zookeeper:2181/zookeeper-client.${PROJECT_NAMESPACE}:2181/g" simplekafkacluster.yaml
        ```

1.  Verify the file contains the following line:

    ```yaml
    ...
    zkAddresses:
        - “zookeeper-client.<project namespace>:2181”
    ...
    ```

1.  Apply the `KafkaCluster` to your project's namespace:

    ```bash
    kubectl apply -n ${PROJECT_NAMESPACE} -f simplekafkacluster.yaml
    ```

1.  Check the status of your Kafka cluster using `kubectl`:

    ```bash
    kubectl -n ${PROJECT_NAMESPACE} get kafkaclusters 
    ```

With both the ZooKeeper cluster and Kafka cluster running in your project's namespace, refer to the [Kafka Operator documentation](https://banzaicloud.com/docs/supertubes/kafka-operator/test/) for information on how to test and verify they are working as expected in. When performing those steps, ensure you substitute: `zookeeper-client.<project namespace>:2181` anywhere that the zookeeper client address is mentioned.

## Deleting Kafka custom resources

Follow these steps to delete the Kafka custom resources.

1.  View all Kafka resources in the cluster:

    ```bash
    kubectl get kafkaclusters -A
    kubectl get kafkausers -A
    Kubectl get kafkatopics -A
    ```

1.  Delete a `KafkaCluster` example:

    ```bash
    kubectl -n ${PROJECT_NAMESPACE} delete kafkacluster <name of KafkaCluster>
    ```

## Resources

- [Kafka Operator Documentation](https://banzaicloud.com/docs/supertubes/kafka-operator/)
- [Kafka Operator GitHub Repository](https://github.com/banzaicloud/koperator)
- [Sample Kafka Operator Custom Resources](https://github.com/banzaicloud/koperator/tree/master/config/samples)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
