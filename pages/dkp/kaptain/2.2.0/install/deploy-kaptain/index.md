---
layout: layout.pug
navigationTitle: Deploy Kaptain on DKP 2.x
title: Deploy Kaptain on DKP 2.x
menuWeight: 15
excerpt: Deploy Kaptain in air-gapped and networked environments
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.
</p>

## Prerequisites

Ensure you add Kaptain to your DKP Catalog applications before you deploy it to your clusters. Refer to the corresponding documentation for your environment:

[Add Kaptain to your DKP Catalog applications in a networked environment][add_dkp]

[Add Kaptain to your DKP Catalog applications in an air-gapped environment for 2.1][add_air_2.1]

[Add Kaptain to your DKP Catalog applications in an air-gapped environment for 2.2][add_air_2.2]

## Enable and deploy Kaptain using the DKP UI

Follow these steps to enable Kaptain in air-gapped and networked environments from the DKP UI:

1.  **Enterprise only**: Select your target workspace, from the top menu bar.

1.  Select **Applications** from the sidebar menu.

1.  Type Kaptain in the **Applications** search bar. If Kaptain is not available in the UI, add Kaptain to your DKP catalog as stated in the [prerequisite section](#prerequisites).

1.  Select the three dot menu > **Enable**, in the Kaptain tile.
    The `Enable Workspace Catalog Application` page is displayed.

1.  Verify that you deploy to the correct target workspace and Clusters.

    - If the workspace is incorrect, go back to the main dashboard and select the correct workspace as in step 1.
    - If you don’t want to deploy Kaptain to all clusters, interrupt deployment and manually move the clusters where you don’t want to deploy Kaptain to another workspace.

1.  Select a version from the drop-down menu, if available. This drop-down menu will only be visible if there is more than one version.

1.  (Optional) If you want to override the default configuration values, copy your customized values into the text editor under **Configure Service** or upload your yaml file that contains the values. For example:

    ```yaml
    ingress:
      externalDexClientId: dex-controller-kubeflow-authservice
      externalDexClientSecret: kubeflow-authservice
      oidcProviderEndpoint: https://a0d231e9c62a4487dad581981c82719f-19533575.us-west-2.elb.amazonaws.com/dex
      oidcProviderBase64CaBundle: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUJiekNDQVJXZ0F3SUJBZ0lSQUlGbWwrS0JXYmtSY0NlOUJuWXpXNVF3Q2dZSUtvWkl6ajBFQXdJd0Z6RVYKTUJNR0ExVUVBeE1NYTI5dGJXRnVaR1Z5TFdOaE1CNFhEVEl5TURReE9ERTROREkxTkZvWERUSXlNRGN4TnpFNApOREkxTkZvd0Z6RVZNQk1HQTFVRUF4TU1hMjl0YldGdVpHVnlMV05oTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJCnpqMERBUWNEUWdBRTAwMk1KVEYyUGZoNWRIdjZBSzhudFlCQmtoK3RMQ3Q3TzNmNVN1b1RWMVI4UW1UcE9uTVEKWEduY3NqN1hhY3hWUSt2L0xUTzlzN1lGUkZTMVcrZ1dsS05DTUVBd0RnWURWUjBQQVFIL0JBUURBZ0trTUE4RwpBMVVkRXdFQi93UUZNQU1CQWY4d0hRWURWUjBPQkJZRUZPYkVuMUkzZFFaOGZQUW1ad3RpZFJyVSsxekFNQW9HCkNDcUdTTTQ5QkFNQ0EwZ0FNRVVDSUE3QXR2c21BUkwzUFJDLzhVanV0SGFXc1BudGVqRnh4N0JieDZVVmF2NlcKQWlFQTFoQTdKamd4d2tJV01uSmlUM0ViVmdDaEo4bWV2NGRjOU1VZVp0VFV5YUU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K
    ```

1.  Confirm the details are correct, and then select the **Enable** button to enable and trigger deployment.
    The status changes to **Enabled**.

1.  Repeat these steps for each additional workspace, if you want to deploy Kaptain to other workspaces.

Alternately, you can use the [CLI](#enable-and-deploy-kaptain-using-the-dkp-cli) to enable your catalog applications.

### Verify the status of deployment using the DKP UI

Follow these steps to verify the deployment of Kaptain:

1.  Select **Clusters**, from the sidebar menu.

1.  Select **View Details**, from your clusters tile.

1.  Select the **Applications** tab and scroll down to find the Kaptain tile.

    The status is **Deployed** when Kaptain's deployment is successful.

<p class="message--note"><strong>NOTE: </strong>It can take several minutes until provisioning finishes and status changes to <b>Deployed</b>.</p>

## Enable and deploy Kaptain using the DKP CLI

Follow these steps to enable Kaptain in air-gapped and networked environments from the DKP CLI:

1.  Enable Kaptain to deploy to [your existing Management, Managed and Attached clusters][existcluster] with an `AppDeployment` resource.

1.  Within the `AppDeployment`, define the `appRef` to specify which `App` to enable:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: kaptain
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        kind: App
        name: kaptain-2.1.0
    EOF
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

## Enable Kaptain with a custom configuration using the CLI

If you want to customize your installation and modify the custom domain name, external Dex, creation of profiles, certificates, for example, continue with these steps:

1.  Provide the name of a `ConfigMap` in the `AppDeployment`, which provides custom configuration on top of the default configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: apps.kommander.d2iq.io/v1alpha2
    kind: AppDeployment
    metadata:
      name: kaptain
      namespace: ${WORKSPACE_NAMESPACE}
    spec:
      appRef:
        kind: App
        name: kaptain-2.1.0
      configOverrides:
        name: kaptain-overrides
    EOF
    ```

1.  Create the `ConfigMap` with the name provided in the step above, with the custom configuration:

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
      name: kaptain-overrides
    data:
      values.yaml: |
        core:
          registrationFlow: true
    EOF
    ```

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

### Verify the status of deployment using the DKP CLI

With Kaptain enabled, connect to the cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
```

```sh
NAME                      AGE     READY   STATUS
kaptain-1                 3m40s   True    Release reconciliation succeeded
```

## Log in to Kaptain using the management cluster's Dex instance

1.  Get your Kaptain login credentials:

    ```bash
    kubectl -n kommander get secret dkp-credentials -o go-template='Username: {{.data.username|base64decode}}{{ "\n"}}Password: {{.data.password|base64decode}}{{ "\n"}}'
    ```

    The output displays your username and password.

1.  Discover the Kaptain endpoint:

    - If you are running Kaptain _on-premises_:

    ```bash
    kubectl get svc kaptain-ingress -n kaptain-ingress  -o go-template='https://{{with index .status.loadBalancer.ingress 0}}{{or .hostname .ip}}{{end}}{{ "\n"}}'
    ```

    The output displays a URL to your Kaptain instance.

When calling up `https://<Kaptain endpoint>`, you will see the login page of the management cluster's Dex instance. After entering your credentials, you will be redirected to Kaptain's Kubeflow dashboard.

<p class="message--note"><strong>NOTE: </strong>It is possible that you receive a browser warning due your instance's self-signed certificate. This instance is safe. You can bypass the warning in the advanced settings of the browser or by typing <code>thisisunsafe</code> once the warning appears (there is no specific field for this).</p>

[add_kaptain]: ../dkp/
[existcluster]: ../../../../kommander/2.2/clusters/attach-cluster/
[add_dkp]: ../dkp/
[add_air_2.1]: ../air-gapped-2.1/
[add_air_2.2]: ../air-gapped-2.2/
