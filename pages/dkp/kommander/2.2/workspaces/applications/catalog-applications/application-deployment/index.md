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

```bash
export WORKSPACE_NAMESPACE=<workspace_namespace>
```

After creating a GitRepository, use either the DKP UI or the CLI to enable your catalog applications.
<p class="message--important"><strong>IMPORTANT: </strong>From within a workspace, you can enable applications to deploy. Verify that an application has successfully deployed <a href="#verify-applications">via the CLI</a>.</p>

## Enable the application using the DKP UI

Follow these steps to enable your catalog applications from the DKP UI:

1.  From the top menu bar, select your target workspace.

1.  Select **Applications** from the sidebar menu to browse the available applications from your configured repositories.

1.  Select the three dot button from the bottom-right corner of the desired application tile, and then select **Enable**.

1.  If available, select a version from the drop-down menu. This drop-down menu will only be visible if there is more than one version.

1.  (Optional) If you want to override the default configuration values, copy your customized values into the text editor under **Configure Service** or upload your yaml file that contains the values:

    ```yaml
    someField: someValue
    ```

1.  Confirm the details are correct, and then select the **Enable** button.

For all applications, you must provide a display name and an ID which is automatically generated based on what you enter for the display name, unless or until you edit the ID directly. The ID must be compliant with [Kubernetes DNS subdomain name validation rules](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names).

Alternately, you can use the [CLI](#enable-the-application-using-the-cli) to enable your catalog applications.

## Enable the application using the CLI

See [workspace catalog applications](/dkp/kommander/2.2/workspaces/applications/catalog-applications/#workspace-catalog-applications) for the list of available applications that you can deploy on the attached cluster.

1.  Enable a supported application to deploy to [your existing attached cluster](../../../../clusters/attach-cluster/) with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` to enable:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: spark-operator
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        name: spark-operator-1.1.17
        kind: App
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available catalog applications.</p>

## Enable an application with a custom configuration using the CLI

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
        name: spark-operator-1.1.17
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

The applications are now enabled. Connect to the attached cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
```

```sh
NAMESPACE               NAME               READY   STATUS                             AGE
workspace-test-vjsfq    spark-operator     True    Release reconciliation succeeded   7m3s
```
