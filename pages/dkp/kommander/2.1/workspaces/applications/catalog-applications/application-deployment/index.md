---
layout: layout.pug
navigationTitle: Application Deployment
title: Deployment of Applications
menuWeight: 5
beta: false
excerpt: Deploy applications to attached clusters using the CLI
---


This topic describes how to use the CLI to deploy a workspace catalog application to attached clusters within a workspace.

## Prerequisites

Before you begin, you must have:

- A running cluster with [Kommander installed](../../../../install/).
- An [existing Kubernetes cluster attached to Kommander](../../../../clusters/attach-cluster/).

Set the `WORKSPACE_NAMESPACE` environment variable to the name of the workspace's namespace the attached cluster exists in:

```sh
export WORKSPACE_NAMESPACE=<workspace_namespace>
```

## Deploy the application

See [workspace catalog applications](../../catalog-applications#workspace-catalog-applications) for the list of available applications that you can deploy on the attached cluster.

1.  Deploy a supported application to [your existing attached cluster](../../../../clusters/attach-cluster/) with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` to deploy:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: spark-operator
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: spark-operator-1.1.6
        kind: App
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available catalog applications.</p>

## Deploy an application with a custom configuration

1.  Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: spark-operator
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: spark-operator-1.1.6
        kind: App
      configOverrides:
        name: spark-operator-overrides
    EOF
    ```

1.  Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

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
          uiService:
            enable: false
    EOF
    ```

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

## Verify applications

The applications are now deployed. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
NAMESPACE               NAME               READY   STATUS                             AGE
workspace-test-vjsfq    spark-operator     True    Release reconciliation succeeded   7m3s
```
