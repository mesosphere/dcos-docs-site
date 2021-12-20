---
layout: layout.pug
navigationTitle: Kafka Operator
title: Kafka Operator
menuWeight: 20
excerpt: Information about the Kafka Operator
---

## Overview

[Apache Kafka](https://kafka.apache.org/) is an open-source distributed event streaming platform used for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. The [Kafka Operator](https://banzaicloud.com/docs/supertubes/kafka-operator/) is a Kubernetes operator to automate provisioning, management, autoscaling, and operations of Apache Kafka clusters deployed to Kubernetes. It works by watching custom resources, such as `KafkaClusters`, `KafkaUsers`, and `KafkaTopics`, to provision underlying Kubernetes resources (i.e `StatefulSets`) required for a production-ready Kafka Cluster.

## Install

These install instructions describe how to install the Kafka operator in a workspace. After following the install instructions, you will have the Kafka operator running in a workspace namespace, ready to manage and create Kafka clusters in any project namespaces. See the [Kafka custom resource documentation](../../../../projects/applications/catalog-applications/custom-resources-workspace-catalog/kafka/) for more information on creating Kafka clusters.

1.  Follow the generic installation instructions for workspace catalog applications on the [Application Deployment](../application-deployment/) page.

1.  Within the `AppDeployment`, update the `appRef` to specify the correct `kafka-operator` App. You can find the `appRef.name` by listing the available `Apps` in the workspace namespace:

    ```bash
    kubectl get apps -n ${WORKSPACE_NAMESPACE}
    ```

Refer to the [Kafka operator Helm Chart documentation](https://github.com/banzaicloud/koperator/tree/master/charts/kafka-operator#configuration) for details on custom configuration for the operator.

## Uninstall via the CLI

Uninstalling the Kafka operator does not affect existing `KafkaCluster` deployments. After uninstalling the operator, you must manually remove any remaining Custom Resource Definitions (CRDs) from the operator.

1.  Delete all Kafka custom resources that are deployed (see [Deleting Kafka Custom Resources](../../../../projects/applications/catalog-applications/custom-resources-workspace-catalog/kafka#deleting-kafka-custom-resources)).

1.  Uninstall a Kafka operator `AppDeployment`:

    ```bash
    kubectl -n <workspace namespace> delete AppDeployment <name of AppDeployment>
    ```

1.  Remove Kafka CRDs:
    <p class="message--note"><strong>NOTE: </strong>The CRDs are not finalized for deletion until you delete the associated custom resources.</p>

    ```bash
    kubectl delete crds kafkaclusters.kafka.banzaicloud.io kafkausers.kafka.banzaicloud.io kafkatopics.kafka.banzaicloud.io
    ```

## Resources

- [Kafka Operator Documentation](https://banzaicloud.com/docs/supertubes/kafka-operator/)
- [Kafka Operator GitHub Repository](https://github.com/banzaicloud/koperator)
- [Sample Kafka Operator Custom Resources](https://github.com/banzaicloud/koperator/tree/master/config/samples)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
