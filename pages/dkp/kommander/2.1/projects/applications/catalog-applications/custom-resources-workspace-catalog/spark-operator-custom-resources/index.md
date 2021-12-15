---
layout: layout.pug
navigationTitle: Deploy Custom Resources with Spark Operator
title: Deploy Custom Resources with Spark Operator
menuWeight: 20
excerpt: Get Started on Spark Operator Custom Resources
---

To run your Spark workloads with Spark Operator, you need to apply Spark Operator specific custom resources. Spark Operator will work with the following  kinds of custom resources:

- `SparkApplication`
- `ScheduledSparkApplication`

See [Spark Operator API documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/api-docs.md) for more details.

## Prerequisites

1.  You need to deploy your Spark Operator first. See [this documentation](../../../../../workspaces/applications/catalog-applications/spark-operator) for more information about Spark Operator installation.

2.  You need to ensure the necessary RBAC resources referenced in your custom resources exist, otherwise the your custom resources will fail. See [this Spark Operator documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/quick-start-guide.md#about-the-spark-job-namespace) for details.
    -   This is an example of commands you need to create RBAC resources needed in your project namespace:

        ```bash
        export PROJECT_NAMESPACE=<project namespace>
        kubectl apply -f - <<EOF
        apiVersion: v1
        kind: ServiceAccount
        metadata:
        name: spark-service-account
        namespace: ${PROJECT_NAMESPACE}
        ---
        apiVersion: rbac.authorization.k8s.io/v1
        kind: Role
        metadata:
        namespace: ${PROJECT_NAMESPACE}
        name: spark-role
        rules:
        - apiGroups: [""]
        resources: ["pods"]
        verbs: ["*"]
        - apiGroups: [""]
        resources: ["services"]
        verbs: ["*"]
        ---
        apiVersion: rbac.authorization.k8s.io/v1
        kind: RoleBinding
        metadata:
        name: spark-role-binding
        namespace: ${PROJECT_NAMESPACE}
        subjects:
        - kind: ServiceAccount
        name: spark-service-account
        namespace: ${PROJECT_NAMESPACE}
        roleRef:
        kind: Role
        name: spark-role
        apiGroup: rbac.authorization.k8s.io
        EOF
        ```

## Deploy a simple SparkApplication

1.  Create your [Project](../../../../../projects) if you don’t already have one.
1.  Set the `PROJECT_NAMESPACE` environment variable to the name of your project’s namespace:

    ```bash
    export PROJECT_NAMESPACE=<project namespace>
    ```

1.  Set the SPARK_SERVICE_ACCOUNT environment variable to one of the following:
    1.  `${PROJECT_NAMESPACE}`, if you skipped the step in [Prerequisites](#prerequisites) to create RBAC resources.

        ```bash
        # This service account is automatically created when you create a project and has access to everything in the project namespace. 
        export SPARK_SERVICE_ACCOUNT=${PROJECT_NAMESPACE}
        ```

    1.  `spark-service-account`

       ```bash
       export SPARK_SERVICE_ACCOUNT=spark-service-account
       ```

1.  Now apply the SparkApplication custom resource in your project namespace

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: "sparkoperator.k8s.io/v1beta2"
    kind: SparkApplication
    metadata:
    name: pyspark-pi
    namespace: ${PROJECT_NAMESPACE}
    spec:
    type: Python
    pythonVersion: "3"
    mode: cluster
    image: "gcr.io/spark-operator/spark-py:v3.1.1"
    imagePullPolicy: Always
    mainApplicationFile: local:///opt/spark/examples/src/main/python/pi.py
    sparkVersion: "3.1.1"
    restartPolicy:
    type: OnFailure
    onFailureRetries: 3
    onFailureRetryInterval: 10
    onSubmissionFailureRetries: 5
    onSubmissionFailureRetryInterval: 20
    driver:
    cores: 1
    coreLimit: "1200m"
    memory: "512m"
    labels:
        version: 3.1.1
    serviceAccount: ${SPARK_SERVICE_ACCOUNT}
    executor:
    cores: 1
    instances: 1
    memory: "512m"
    labels:
        version: 3.1.1
    EOF
    ```

## Clean up

1.  View `SparkApplications` in all namespaces:

    ```bash
    kubectl get sparkapp -A
    ```

1.  Deleting a specific `SparkApplication`:

    ```bash
    kubectl -n ${PROJECT_NAMESPACE} delete sparkapp <name of sparkapplication>
    ```
