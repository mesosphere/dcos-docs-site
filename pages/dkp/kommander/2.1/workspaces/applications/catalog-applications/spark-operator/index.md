---
layout: layout.pug
navigationTitle: Spark Operator
title: Spark Operator
menuWeight: 20
excerpt: How to spin up your Spark Operator
---

## Overview

The Kubernetes Operator for Apache Spark aims to make specifying and running Spark applications as easy and idiomatic as running other workloads on Kubernetes. It uses Kubernetes custom resources for specifying, running, and surfacing status of Spark applications. For a complete reference of the custom resource definitions, please refer to the API Definition. For details on its design, please refer to the design documentation. It requires Spark 2.3 and above that supports Kubernetes as a native scheduler backend.

<p class="message--note"><strong>NOTE: </strong>The default installation is basic, please provide your override configmap to enable desired Spark Operator features</p>

## Install

You can find generic installation instructions for workspace catalog applications on the [Application Deployment topic](../application-deployment).

For details on custom configuration for the operator, refer to the [Spark Operator Helm Chart documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/charts/spark-operator-chart/README.md).

## Sample override config

<p class="message--note"><strong>NOTE: </strong>Ensure you configure the AppDeployment with the appropriate override configmap</p>

-   Using UI

    ```yaml
    podLabels:
      owner: john
      team: operations
    ```

-   Using CLI

    See [Application Deployment](../application-deployment#deploy-an-application-with-a-custom-configuration) for details.

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
      name: spark-operator-overrides
    data:
      values.yaml: |
        configInline:
          podLabels:
            owner: john
            team: operations
    EOF
    ```

## Uninstall via the CLI

<p class="message--note"><strong>NOTE: </strong>Uninstalling the Spark Operator does not affect existing <b>SparkApplication</b> and <b>ScheduledSparkApplication</b> custom resources. You need to manually remove any leftover custom resources and CRDs from the operator. Please refer to <a href="../../../../projects/applications/catalog-applications/custom-resources-workspace-catalog/spark-operator-custom-resources#clean-up">deleting Spark Operator custom resources</a>.</p>

1.  Uninstall the Spark Operator `AppDeployment`:

    ```bash
    kubectl -n <your workspace namespace> delete AppDeployment <name of AppDeployment>
    ```

1.  Remove the Spark Operator Service Account:

    ```bash
    # <name of service account> is spark-operator-service-account if you didn't override the RBAC resources.
    kubectl -n <your workspace namespace> delete serviceaccounts <name of service account>
    ```

1.  Remove the Spark Operator CRDs:
    <p class="message--note"><strong>NOTE: </strong>The CRDs are not finalized for deletion until you delete the associated custom resources.</p>

    ```bash
    kubectl delete crds scheduledsparkapplications.sparkoperator.k8s.io sparkapplications.sparkoperator.k8s.io
    ```

## Resources

Here are some resources to learn more about Spark Operator:

- [Spark Operator Documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/README.md)
- [Spark Operator Quick Start Guide](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/quick-start-guide.md)
- [Spark Operator User Guide](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/user-guide.md)
- [Spark Documentation](https://spark.apache.org/docs/latest/)
