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
Ensure the cluster that you want to use to deploy Kaptain is the only cluster in its workspace. <b>Kaptain is meant to be deployed on workspaces with a single cluster</b>.
</p>

## Prerequisites

- Ensure you meet all [prerequisites](../prerequisites/).

- Ensure you have added Kaptain to your DKP Catalog applications before you deploy it to your clusters. Refer to the corresponding documentation for your environment:

  - [Networked environment][add_dkp]

  - [Air-gapped environment for 2.1][add_air_2.1]

  - [Air-gapped environment for 2.2][add_air_2.2]

<p class="message--warning"><strong>WARNING: </strong> (<a href="../../../../kommander/2.2/licensing/enterprise/">Enterprise</a> only) If you are installing Kaptain on a Managed or Attached cluster, you must customize the deployment for Kaptain to communicate with the Management cluster via Dex (unless you have a dedicated dex instance running on said cluster). 
In the following workflow, we will show you when to do this.
</p>

<p class="message--note"><strong>NOTE: </strong>You have different <a href="../../../2.0.0/configuration/">configuration options</a> for Kaptain. Some must take place during the deployment of the Kaptain instance, or the installation could fail.</p>

## Enable and deploy Kaptain using the DKP UI

Follow these steps to enable Kaptain in air-gapped and networked environments from the DKP UI:

1.  **Enterprise only**: Select your target workspace, from the top menu bar.

1.  Select **Applications** from the sidebar menu.

1.  Type Kaptain in the **Applications** search bar. If Kaptain is not available in the UI, add Kaptain to your DKP catalog as stated in the [prerequisites section](#prerequisites).

1.  Select the three dot menu > **Enable**, in the Kaptain tile.
    The `Enable Workspace Catalog Application` page is displayed.

1.  Verify that you deploy to the correct target workspace and Clusters.

    - If the workspace is incorrect, go back to the main dashboard and select the correct workspace as in step 1.
    - If you don’t want to deploy Kaptain to all clusters, interrupt deployment and manually move the clusters where you don’t want to deploy Kaptain to another workspace.

1.  Select a version from the drop-down menu, if available. This drop-down menu will only be visible if there is more than one version.

1.  **Enterprise only**: Customize the deployment so Kaptain can communicate with the [Management cluster via Dex](../../configuration/external-dex/). For this, copy the required values or upload your customized YAML to the **Configure Service**. Here is an example:

    ```yaml
    ingress:
      externalDexClientId: dex-controller-kubeflow-authservice
      externalDexClientSecret: kubeflow-authservice
      oidcProviderEndpoint: https://management_cluster_endpoint/dex
      oidcProviderBase64CaBundle: LS0tLS1CRUd...
    ```
1.  **Optional**: If you want to override the default configuration values, copy any other [customized configuration values](../../configuration/) into the text editor under Configure Service or upload your YAML file that contains the values.

1.  Confirm the details are correct, and then select the **Enable** button to enable and trigger deployment.
    The status changes to **Enabled**.

1.  Repeat these steps for each additional workspace, if you want to deploy Kaptain to other workspaces.

Alternately, you can use the [CLI](#enable-and-deploy-kaptain-using-the-dkp-cli-essential-only) to enable your catalog applications.

### Verify the status of deployment using the DKP UI

Follow these steps to verify the deployment of Kaptain:

1.  Select **Clusters**, from the sidebar menu.

1.  Select **View Details**, from your clusters tile.

1.  Select the **Applications** tab and scroll down to find the Kaptain tile.

    The status is **Deployed** when Kaptain's deployment is successful.

<p class="message--note"><strong>NOTE: </strong>It can take several minutes until provisioning finishes and status changes to <b>Deployed</b>.</p>

## Enable and deploy Kaptain using the DKP CLI (Essential only)

Follow these steps to enable Kaptain in air-gapped and networked environments from the DKP CLI:

1.  Ensure you [reference the cluster on which you want to deploy Kaptain](https://archive-docs.d2iq.com/dkp/kaptain/2.0.0/install/prerequisites/#install-dependencies#reference-the-cluster-on-which-you-must-execute-the-commands). For customers with an Essential license and a single-cluster experience, the `clusterKubeconfig.conf` is your Essential cluster. For customers with an Enterprise license and multi-cluster experience, your `clusterKubeconfig.conf` is the managed or attached cluster where you will install Kaptain.

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

## Enable Kaptain with a custom configuration using the CLI (Essential and Enterprise)

<p class="message--important"><strong>IMPORTANT: </strong>If you are deploying Kaptain to a managed or attached cluster, ensure that the <code>ConfigMap</code> contains the <code>${WORKSPACE_NAMESPACE}</code> in the <code>global.workspace</code> section of the <code>values.yaml</code>, as shown in the following example.</p>

If you want to customize your installation and modify the custom domain name, external Dex, creation of profiles, certificates, for example, continue with these steps:

1.  Ensure you [reference the cluster on which you want to deploy Kaptain](https://archive-docs.d2iq.com/dkp/kaptain/2.0.0/install/prerequisites/#install-dependencies#reference-the-cluster-on-which-you-must-execute-the-commands). For customers with an Essential license and a single-cluster experience, the `clusterKubeconfig.conf` is your Essential cluster. For customers with an Enterprise license and multi-cluster experience, your `clusterKubeconfig.conf` is the managed or attached cluster where you will install Kaptain.

1.  Create the `ConfigMap` with the custom configuration. In the following example, the ConfigMap is configuring Kaptain to communicate with the [Management cluster via Dex](../../configuration/external-dex/), which is a necessary step when deploying Kaptain to a Managed or Attached cluster ([Enterprise](../../../../kommander/2.2/licensing/enterprise/) only). Other configurations can be made in the same way.

    ```yaml
    cat <<EOF | kubectl apply -f -
    apiVersion: v1
    kind: ConfigMap
    metadata:
      namespace: ${WORKSPACE_NAMESPACE}
      name: kaptain-overrides
    data:
      values.yaml: |
        global:
          workspace: ${WORKSPACE_NAMESPACE}
        core:
          registrationFlow: true
        ingress:
          externalDexClientId: dex-controller-kubeflow-authservice
          externalDexClientSecret: kubeflow-authservice
          oidcProviderEndpoint: https://management_cluster_endpoint/dex
          oidcProviderBase64CaBundle: LS0tLS1CRUd...
    EOF
    ```

1.  Provide the name of the `ConfigMap` you created in the `AppDeployment`, which provides custom configuration on top of the default configuration:

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

Kommander waits for the `ConfigMap` to be present before deploying the `AppDeployment` to the attached clusters.

### Verify the status of deployment using the DKP CLI

With Kaptain enabled, connect to the cluster and check the `HelmReleases` to verify the deployment:

```bash
kubectl get helmreleases -n ${WORKSPACE_NAMESPACE}
```

The output should look like this: 

```sh
NAME                      AGE     READY   STATUS
kaptain-1                 3m40s   True    Release reconciliation succeeded
```

## Log in to Kaptain using the management cluster's Dex instance

1.  Get your Kaptain login credentials:

    ```bash
    kubectl -n kommander get secret dkp-credentials -o go-template='Username: {{.data.username|base64decode}}{{ "\n"}}Password: {{.data.password|base64decode}}{{ "\n"}}')
    ```

    The output displays your username and password.

1.  Discover the Kaptain endpoint:

    - If you are running Kaptain _on-premises_:

    ```bash
    kubectl get svc kaptain-ingress --namespace kaptain-ingress -o jsonpath="{.status.loadBalancer.ingress[*].ip}"
    ```

    - Or if you are running Kaptain on _AWS_:

    ```bash
    kubectl get svc kaptain-ingress --namespace kaptain-ingress -o jsonpath="{.status.loadBalancer.ingress[*].hostname}"
    ```

    The output displays a URL to your Kaptain instance.

When calling up `https://<Kaptain endpoint>`, you will see the login page of the management cluster's Dex instance. After entering your credentials, you will be redirected to Kaptain's Kubeflow dashboard.

<p class="message--note"><strong>NOTE: </strong>It is possible that you receive a browser warning due your instance's self-signed certificate. This instance is safe. You can bypass the warning in the advanced settings of the browser or by typing <code>thisisunsafe</code> once the warning appears (there is no specific field for this).</p>

[add_kaptain]: ../dkp/
[existcluster]: ../../../../kommander/2.2/clusters/attach-cluster/
[add_dkp]: ../dkp/
[add_air_2.1]: ../air-gapped-2.1/
[add_air_2.2]: ../air-gapped-2.2/
