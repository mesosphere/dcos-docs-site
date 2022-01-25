---
layout: layout.pug
navigationTitle: Spark
title: Spark
menuWeight: 20
excerpt: Deploying Spark in a project
---

To run your Spark workloads with Spark Operator, apply the Spark Operator specific custom resources. The Spark Operator works with the following kinds of custom resources:

- `SparkApplication`
- `ScheduledSparkApplication`

See [Spark Operator API documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/api-docs.md) for more details.

<p class="message--note"><strong>NOTE: </strong>If you need to manage these custom resources and RBAC resources across all clusters in a project, it is recommended you use <a href="../../../../../project-deployments">Project Deployments</a> which enables you to leverage GitOps to deploy the resources. Otherwise, you will need to create the resources manually in each cluster.</p>

## Prerequisites

Follow these steps:

1.  Deploy your Spark Operator. See the [Spark Operator](../../../../../../workspaces/applications/catalog-applications/dkp-applications/spark-operator/) documentation for more information.

1.  Ensure the necessary RBAC resources referenced in your custom resources exist, otherwise the custom resources can fail. See the [Spark Operator documentation](https://github.com/mesosphere/spark-on-k8s-operator/blob/d2iq-master/docs/quick-start-guide.md#about-the-spark-job-namespace) for details.

    -   This is an example of commands for you to create the RBAC resources needed in your project namespace:

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

Follow these steps:

1.  Create your [Project](../../../../../..) if you don’t already have one.

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

    1.  Or set to `spark-service-account`

       ```bash
       export SPARK_SERVICE_ACCOUNT=spark-service-account
       ```

1.  Apply the SparkApplication custom resource in your project namespace

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

Follow these steps:

1.  View `SparkApplications` in all namespaces:

    ```bash
    kubectl get sparkapp -A
    ```

1.  Deleting a specific `SparkApplication`:

    ```bash
    kubectl -n ${PROJECT_NAMESPACE} delete sparkapp <name of sparkapplication>
    ```
