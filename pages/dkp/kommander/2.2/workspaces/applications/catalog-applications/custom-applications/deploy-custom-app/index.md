---
layout: layout.pug
navigationTitle: Deploy a Custom Application from the Workspace Catalog
title: Deploy a Custom Application from the Workspace Catalog
menuWeight: 50
beta: false
excerpt: Deploy a Custom Application from the Workspace Catalog
---
<!-- markdownlint-disable MD030 -->

After creating a GitRepository, you can either use the DKP UI or the CLI to deploy your custom applications.

## Deploy the application using the DKP UI

Go to the DKP UI to deploy your custom applications:

1. Select **Workspace** > **Workspace**

1. Select your workspace from the list.

1. Select **Applications** on the top navigation bar to browse the available applications from your configured repositories.

1. Select your desired application.

1. Select the version you'd like to deploy from the version drop-down, and then select Deploy. The `Deploy Workspace Custom Application` page is displayed.

1. (Optional) If you want to override the default configuration values, copy your values content into the text editor under **Configure Service** or just upload your yaml file that contains the values:

   ```yaml
   someField: someValue
   ```

1. Once you confirm the details are correct, click the `Deploy` button.

For all applications, you must provide a display name and an ID which is automatically generated based on what you enter for the display name, unless or until you edit the ID directly. The ID must be compliant with [Kubernetes DNS subdomain name validation rules](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-subdomain-names).

Alternately, you can use the [CLI](#deploy-the-application-using-the-cli) to deploy your custom applications.

## Deploy the application using the CLI

1. Set the `WORKSPACE_NAMESPACE` environment variable to the name of the workspace's namespace:

    ```bash
    export WORKSPACE_NAMESPACE=<workspace_namespace>
    ```

1. Get the list of available applications to deploy using the following command:

   ```bash
   kubectl get apps -n ${WORKSPACE_NAMESPACE}
   ```

1. Deploy one of the supported applications from the list with an `AppDeployment` resource.

1. Within the `AppDeployment`, define the `appRef` to specify which `App` will be deployed:

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

## Deploy an application with a custom configuration using the CLI

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

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters in the Workspace.

## Verify applications

After completing the previous steps, your applications are deployed. Connect to the attached cluster and check the `HelmReleases` to verify the deployments:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}

NAMESPACE               NAME            READY   STATUS                             AGE
workspace-test-vjsfq      my-custom-app   True    Release reconciliation succeeded   7m3s
```
