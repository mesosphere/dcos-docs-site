---
layout: layout.pug
navigationTitle: Application Deployment
title: Deployment of Applications
menuWeight: 5
beta: false
excerpt: Deploy applications to attached clusters using the CLI
---

<!-- markdownlint-disable MD004 MD040 -->

This topic describes how to use the CLI to deploy an application to attached clusters within a workspace.
To use the DKP UI to deploy applications, see [Customize a workspace's applications](../../platform-applications#customize-a-workspaces-applications).

See [Workspace Platform Applications](../../platform-applications#workspace-platform-applications) for a list of all applications and those that are enabled by default.

## Prerequisites

Before you begin, you must have:

- A running cluster with [Kommander installed](../../../../install/).
- An [existing Kubernetes cluster attached to Kommander](../../../../clusters/attach-cluster/).

Set the `WORKSPACE_NAMESPACE` environment variable to the name of the workspace's namespace where the cluster is attached:

```bash
export WORKSPACE_NAMESPACE=<workspace_namespace>
```

## Deploy the application

The list of available applications that can be deployed on the attached cluster can be found [in this documentation](../../platform-applications#workspace-platform-applications).

1.  Deploy a supported application to [your existing attached cluster](../../../../clusters/attach-cluster/) with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` will be deployed:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: cert-manager
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: cert-manager-0.2.7
        kind: ClusterApp
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available applications.</p>

## Deploy an application with a custom configuration

1.  Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: metallb
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: metallb-0.12.2
        kind: ClusterApp
      configOverrides:
        name: metallb-overrides-attached
    EOF
    ```

1.  Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
      name: metallb-overrides-attached
    data:
      values.yaml: |
        configInline:
          address-pools:
          - name: default
            protocol: layer2
            addresses:
            - 172.17.255.150-172.17.255.199
    EOF
    ```

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

## Verify applications

The applications are now deployed. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
NAMESPACE               NAME        READY   STATUS                             AGE
workspace-test-vjsfq    metallb     True    Release reconciliation succeeded   7m3s
```

<p class="message--note"><strong>NOTE: </strong>Some of the supported applications have dependencies on other applications. See <a href="../platform-application-dependencies">Workspace Platform Application Dependencies</a> for that table.</p>
