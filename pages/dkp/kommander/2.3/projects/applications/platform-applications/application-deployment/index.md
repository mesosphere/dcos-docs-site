---
layout: layout.pug
navigationTitle: Project Platform Application Deployment
title: Project Platform Application Deployment
menuWeight: 5
beta: false
excerpt: Deploy applications to attached clusters in a project using the CLI
---
<!-- markdownlint-disable MD004 MD040 -->

This topic describes how to use the CLI to deploy an application to attached clusters within a project.
To use the DKP UI to deploy applications, see [Deploy applications in a project](../../platform-applications).

See [Project Platform Applications](../../platform-applications#platform-applications) for a list of all applications and those that are enabled by default.

## Prerequisites

Before you begin, you must have:

- A running cluster with [Kommander installed](../../../../install/).
- An [existing Kubernetes cluster attached to Kommander](../../../../clusters/attach-cluster/).

Set the `PROJECT_NAMESPACE` environment variable to the name of the project's namespace where the cluster is attached:

```bash
export PROJECT_NAMESPACE=<project_namespace>
```

## Deploy the application

The list of available applications that can be deployed on the attached clusters in a project can be found [in the project platform applications topic](../../platform-applications#platform-applications).

1.  Deploy one of the supported applications to [your existing attached cluster](../../../../clusters/attach-cluster/) with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` will be deployed:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: project-grafana-logging-6.28.0
      namespace: ${PROJECT_NAMESPACE}
    spec:
      appRef:
        name: project-grafana-logging-6.28.0
        kind: ClusterApp
    EOF
    ```

1.  Create the resource in the project you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same project.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available applications.</p>

## Deploy an application with a custom configuration

1.  Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: project-grafana-logging
      namespace: ${PROJECT_NAMESPACE}
    spec:
      appRef:
        name: project-grafana-logging-6.28.0
        kind: ClusterApp
      configOverrides:
        name: project-grafana-logging-overrides
    EOF
    ```

1.  Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${PROJECT_NAMESPACE}
      name: project-grafana-logging-overrides
    data:
      values.yaml: |
        datasources:
          datasources.yaml:
            apiVersion: 1
            datasources:
            - name: Loki
              type: loki
              url: "http://project-grafana-loki-loki-distributed-gateway"
              access: proxy
              isDefault: false
    EOF
    ```

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

## Verify applications

The applications are now enabled. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${PROJECT_NAMESPACE}
NAMESPACE               NAME        READY   STATUS                             AGE
project-test-vjsfq    project-grafana-logging     True    Release reconciliation succeeded   7m3s
```

<p class="message--note"><strong>NOTE: </strong>Some of the supported applications have dependencies on other applications. See <a href="../application-dependencies">Project Application Dependencies</a> for that table.</p>
