---
layout: layout.pug
navigationTitle: Workspace Platform Application Deployment
title: Deployment of Workspace Platform Applications
menuWeight: 5
beta: false
excerpt: Deploy platform applications to attached clusters using the CLI
---

<!-- markdownlint-disable MD004 MD040 -->

This topic describes how to use the CLI to enable an application to deploy to attached clusters within a workspace.
To use the DKP UI to enable applications, see [Customize a workspace's applications](../../platform-applications#customize-a-workspaces-applications).

See [Workspace Platform Applications](../../platform-applications#workspace-platform-applications) for a list of all applications and those that are enabled by default.

## Prerequisites

Before you begin, you must have:

- A running cluster with [Kommander installed](../../../../install/).
- An [existing Kubernetes cluster attached to Kommander](../../../../clusters/attach-cluster/).

Set the `WORKSPACE_NAMESPACE` environment variable to the name of the workspace's namespace where the cluster is attached:

```bash
export WORKSPACE_NAMESPACE=<workspace_namespace>
```

<p class="message--important"><strong>IMPORTANT: </strong>From the CLI, you can enable applications to deploy in the workspace. Verify that an application has successfully deployed <a href="#verify-applications">via the CLI</a>.</p>

## Enable the application

Review the [list of available applications](../../platform-applications#workspace-platform-applications) that can be enabled to deploy to your attached cluster.

1.  Enable a supported application to deploy to [your existing attached cluster](../../../../clusters/attach-cluster/) with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` will be enabled:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: istio
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: istio-1.14.1
        kind: ClusterApp
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available applications.</p>

## Enable an application with a custom configuration

1.  Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: istio
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: istio-1.14.1
        kind: ClusterApp
      configOverrides:
        name: istio-overrides-attached
    EOF
    ```

1.  Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
      name: istio-overrides-attached
    data:
      values.yaml: |
        operator:
          resources:
            limits:
              cpu: 200m
              memory: 256Mi
            requests:
              cpu: 50m
              memory: 128Mi
    EOF
    ```

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

## Verify applications

The applications are now enabled. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases istio -n ${WORKSPACE_NAMESPACE} -w
```

You should eventually see the `HelmRelease` marked as `Ready`:

```sh
NAMESPACE               NAME        READY   STATUS                             AGE
workspace-test-vjsfq    istio       True    Release reconciliation succeeded   7m3s
```

<p class="message--note"><strong>NOTE: </strong>Some of the supported applications have dependencies on other applications. See <a href="../platform-application-dependencies">Workspace Platform Application Dependencies</a> for that table.</p>
