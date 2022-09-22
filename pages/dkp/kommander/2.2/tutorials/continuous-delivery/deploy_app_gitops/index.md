---
layout: layout.pug
title: Deploy a Sample App from DKP GitOps
navigationTitle: Deploy a Sample App from DKP GitOps
beta: false
menuWeight: 50
excerpt: Use this procedure to deploy a sample podinfo application from DKP Enterprise GitOps.
---

Use this procedure to deploy a sample podinfo application from DKP Enterprise GitOps.

## Prerequisites

-   [Konvoy installed](https://archive-docs.d2iq.com/dkp/konvoy/2.2/Install/)

-   [Kommander installed](https://archive-docs.d2iq.com/dkp/kommander/2.2/install/)

-   Github account and [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

-   [Add cluster to Kommander](https://archive-docs.d2iq.com/dkp/kommander/2.2/clusters/attach-cluster/)

-   [Setup Workspace and Projects](https://archive-docs.d2iq.com/dkp/kommander/2.2/workspaces/)  

## Deployment Steps

This procedure was run on an AWS cluster with DKP 2.2.2 installed.

Follow these steps:

1.  Ensure you are on the **Default Workspace** so that you can create a project.

1.  [Create a project](https://archive-docs.d2iq.com/dkp/kommander/2.2/projects/).
    In the working example we name the project **pod-info**. When you create a namespace, Kommander appends five alphanumeric characters. You can opt to select a target cluster for this project from one of the available attached clusters, and then this **(pod-info-xxxxx)** is the namespace used for deployments under the project, for example:

1.  [Optional] Create a secret in order to pull from the repository, for private repositories.

    1.  Select the Secrets tab and set up your secret according to the [Continuous Deployment documentation](https://archive-docs.d2iq.com/dkp/kommander/2.2/projects/project-deployments/continuous-delivery/).

    1.  Add a **key** and **value** pair for the GitHub personal access token and then select **Create**.

1.  Verify that the secret podinfo-secret is created on the project namespace:

    ```bash
    kubectl get secrets -n pod-info-xt2sz --kubeconfig=${CLUSTER_NAME}.conf
    NAME                         TYPE                                  DATA   AGE
    default-token-k685t          kubernetes.io/service-account-token   3      94m
    pod-info-xt2sz-token-p9k5z   kubernetes.io/service-account-token   3      94m
    podinfo-secret               Opaque                                1      1s
    tls-root-ca                  Opaque                                1      93m
    ```

1.  Select your project and then select the **CD** tab.

1.  Create a GitOps Source, complete the required fields, and then **Save**.\
    There are several configurable options such as selecting the **Git Ref Type** but in this example we use the master branch. **The Path** value should contain where the manifests are located. Additionally, the **Primary Git Secret** is the secret (**podinfo-secret**) that you created in the previous step, if you need to access private repositories. This can be disregarded for public repositories.

1.  Verify the status of gitrepository creation with this command, (attached cluster) and if **READY** is marked as **True**:

    ```bash
    kubectl get gitrepository -A --kubeconfig=${CLUSTER_NAME}.conf
    NAMESPACE     NAME           URL                                                     AGE READY   STATUS
    kommander-flux   management     https://gitea-http.kommander.svc/kommander/kommander.git   134m   True stored artifact for revision 'main/4fbee486076778c85e14f3196e49b8766e50e6ce'
    pod-info-xt2sz   podinfo-source https://github.com/stefanprodan/podinfo                   116m   True stored artifact for revision 'master/b3b00fe35424a45d373bf4c7214178bc36fd7872'
    ```

1.  Verify the Kustomization with this command below (attached cluster) and if **READY** is marked as **True**:

    ```bash
    kubectl get kustomizations -n pod-info-xt2sz --kubeconfig=${CLUSTER_NAME}.conf
    NAME               AGE READY   STATUS
    originalpodinfo    10m True Applied revision: master/b3b00fe35424a45d373bf4c7214178bc36fd7872
    podinfo-source     113m   True Applied revision: master/b3b00fe35424a45d373bf4c7214178bc36fd7872
    project            116m   True Applied revision: main/4fbee486076778c85e14f3196e49b8766e50e6ce
    project-tls-root-ca   117m   True Applied revision: main/4fbee486076778c85e14f3196e49b8766e50e6ce
    ```

    Note the **port** so that you can use to verify if the app is deployed correctly:

    ```bash
    kubectl get deployments,services -n pod-info-xt2sz --kubeconfig=${CLUSTER_NAME}.conf
    NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/podinfo   2/2  2         2        118m

    NAME           TYPE     CLUSTER-IP   EXTERNAL-IP   PORT(S)          AGE
    service/podinfo   ClusterIP   10.99.239.120   <none>     9898/TCP,9999/TCP   118m
    ```

1.  Port forward the **podinfo** service (port **9898**) to verify:

    ```bash
    kubectl port-forward svc/podinfo -n pod-info-xt2sz 9898:9898 --kubeconfig=${CLUSTER_NAME}.conf

    Forwarding from 127.0.0.1:9898 -> 9898
    Forwarding from [::1]:9898 -> 9898
    Handling connection for 9898
    Handling connection for 9898
    Handling connection for 9898
    ```

1.  Open a browser and type in **localhost:9898**. A successful deployment of the podinfo app gives you a "Greetings from podinfo nnnn" screen.
