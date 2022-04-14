---
layout: layout.pug
navigationTitle: Deploy Kaptain on DKP 2.x
title: Deploy Kaptain on DKP 2.x
menuWeight: 9
excerpt: Deploy Kaptain in air-gapped and networked environments
beta: false
enterprise: false
---

<p class="message--warning"><strong>WARNING: </strong>
You can deploy Kaptain to a cluster in a selected workspace. If you do not intend to deploy Kaptain to a certain cluster, you must switch the workspace you are deploying to or move that cluster to another workspace.
</p>

## Enable and deploy Kaptain using the DKP UI

Follow these steps to enable Kaptain in air-gapped and networked environments from the DKP UI:

1.  **Enterprise only**: From the top menu bar, select your target workspace.

1.  From the sidebar menu, select **Applications**.

1.  Type Kaptain in the **Applications** search bar. If Kaptain is not available in the UI, [add Kaptain to your DKP catalog][add_Kaptain] via CLI first.

1.  From the Kaptain tile, select the three dot menu > **Enable**.
    The `Enable Workspace Catalog Application` page is displayed.

1.  Verify that you deploy to the correct target workspace and Clusters.
    - If the workspace is incorrect, go back to the main dashboard and select the correct workspace as in step 1.
    - If you don’t want to deploy Kaptain to all clusters, interrupt deployment and manually move the clusters where you don’t want to deploy Kaptain to another workspace.

1.  If available, select a version from the drop-down menu. This drop-down menu will only be visible if there is more than one version.

1.  (Optional) If you want to override the default configuration values, copy your customized values into the text editor under **Configure Service** or upload your yaml file that contains the values:

    ```yaml
    someField: someValue
    ```

1.  Confirm the details are correct, and then select the **Enable** button to enable and trigger deployment.
    The status changes to **Enabled**.

1.  If you want to deploy Kaptain to other workspaces, repeat these steps for each additional workspace.

Alternately, you can use the [CLI](#enable-and-deploy-Kaptain-using-the-dkp-cli) to enable your catalog applications.

### Verify the status of deployment using the DKP UI

Follow these steps to verify the deployment of Kaptain:

1.  From the sidebar menu, select **Clusters**.

1.  From your clusters tile, select **View Details**.

1.  Select the **Applications** tab and scroll down to find the Kaptain tile.

1.  The status is **Deployed** when Kaptain's deployment is successful.

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
            name: kaptain-2.0.0
    EOF 
    ```

1.  Create the resource in the workspace you just created, which instructs Kommander to deploy the `AppDeployment` to the `KommanderCluster`s in the same workspace.

## Enable Kaptain with a custom configuration using the CLI

If you want to customize your installation and modify the custom domain name, external Dex, creation of profiles, certificates, etc. continue with these steps:

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
        name: kaptain-2.0.0
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

Kaptain is now enabled. Connect to the cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
NAME                      AGE     READY   STATUS
kaptain-1                 3m40s   True    Release reconciliation succeeded
```

[add_Kaptain]: ../dkp/
<!-- this will change to ../dkp/ once other PR is merged -->
[existcluster]: ../../../../kommander/2.2/clusters/attach-cluster/
