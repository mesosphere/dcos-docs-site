---
layout: layout.pug
navigationTitle: Enable a Custom Application from the Workspace Catalog
title: Enable a Custom Application from the Workspace Catalog
menuWeight: 50
beta: false
excerpt: Enable a Custom Application from the Workspace Catalog
---
<!-- markdownlint-disable MD030 -->

After creating a GitRepository, you can either use the DKP UI or the CLI to enable your custom applications.
<p class="message--important"><strong>IMPORTANT: </strong>From within a workspace, you can enable applications to deploy. Verify that an application has successfully deployed <a href="#verify-applications">via the CLI</a>.</p>

## Enable the application using the DKP UI

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

Alternately, you can use the [CLI](#enable-the-application-using-the-cli) to enable your custom applications.

## Enable the application using the CLI

1. Set the `WORKSPACE_NAMESPACE` environment variable to the name of the workspace's namespace:

    ```bash
    export WORKSPACE_NAMESPACE=<workspace_namespace>
    ```

1. Get the list of available applications to enable using the following command:

   ```bash
   kubectl get apps -n ${WORKSPACE_NAMESPACE}
   ```

1. Deploy one of the supported applications from the list with an `AppDeployment` resource.

1. Within the `AppDeployment`, define the `appRef` to specify which `App` will be enabled:

   ```yaml
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: my-custom-app
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: custom-app-0.0.1
       kind: App
   EOF

<p class="message--note"><strong>NOTE: </strong>The <code>appRef.name</code> must match the app <code>name</code> from the list of available applications.</p>

## Enable an application with a custom configuration using the CLI

1. Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

   ```yaml
   cat <<EOF | kubectl apply -f -
   apiVersion: apps.kommander.d2iq.io/v1alpha2
   kind: AppDeployment
   metadata:
     name: my-custom-app
     namespace: ${WORKSPACE_NAMESPACE}
   spec:
     appRef:
       name: custom-app-0.0.1
       kind: App
     configOverrides:
       name: my-custom-app-overrides
   EOF
   ```

1. Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

   ```yaml
   cat <<EOF | kubectl apply -f -
   apiVersion: v1
   kind: ConfigMap
   metadata:
     namespace: ${WORKSPACE_NAMESPACE}
     name: my-custom-app-overrides
   data:
     values.yaml: |
       someField: someValue
   EOF
   ```

Kommander waits for the `ConfigMap` to be present before enabling the `AppDeployment` to the attached clusters in the Workspace.

## Verify applications

After completing the previous steps, your applications are enabled. Connect to the attached cluster and check the `HelmReleases` to verify the deployments:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}

NAMESPACE               NAME            READY   STATUS                             AGE
workspace-test-vjsfq      my-custom-app   True    Release reconciliation succeeded   7m3s
```
