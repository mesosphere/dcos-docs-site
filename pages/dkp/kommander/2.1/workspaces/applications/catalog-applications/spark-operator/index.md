---
layout: layout.pug
navigationTitle: Spark Operator
title: Spark Operator
menuWeight: 20
excerpt: How to spin up your Spark Operator
---

## Overview

The Kubernetes Operator for Apache Spark aims to make specifying and running Spark applications as easy and idiomatic as running other workloads on Kubernetes. It uses Kubernetes custom resources for specifying, running, and surfacing status of Spark applications. For a complete reference of the custom resource definitions, please refer to the API Definition. For details on its design, please refer to the design doc. It requires Spark 2.3 and above that supports Kubernetes as a native scheduler backend.

Note: the default installation is bare-bone, please provide your override configmap to enable desired Spark Operator features

## Installation

<!-- Need to add link to the application deployment page in PR -->
You can find generic installation instructions for workspace catalog applications on the Application Deployment page.

For details on custom configuration for the operator, please refer to the [Spark Operator Helm Chart documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/charts/spark-operator-chart/README.md).

## Uninstall via the CLI

<p class="message--note"><strong>NOTE: </strong>Uninstalling the Spark Operator will not affect existing <b>SparkApplication</b> and <b>ScheduledSparkApplication</b> custom resources. You need to manually remove any leftover custom resources and CRDs from the operator. Please refer to <a href="../../../../projects/applications/catalog-applications/custom-resources-workspace-catalog/spark-operator-custom-resources#clean-up">deleting Spark Operator custom resources</a>.</p>

1.  Uninstalling a Spark Operator `AppDeployment`:

    ```bash
    kubectl -n <your workspace namespace> delete AppDeployment <name of AppDeployment>
    ```

1.  Removing Spark Operator CRDs:
    <p class="message--note"><strong>NOTE: </strong>the CRDs are not finalized for deletion until you delete the associated custom resources.</p>

    ```bash
    kubectl delete crds scheduledsparkapplications.sparkoperator.k8s.io sparkapplications.sparkoperator.k8s.io
    ```

## Resources

Here are some resources to learn more about Spark Operator:

- [Spark Operator Documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/README.md)
- [Spark Operator Quick Start Guide](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/quick-start-guide.md)
- [Spark Operator User Guide](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/user-guide.md)
- [Spark Documentation](https://spark.apache.org/docs/latest/)
