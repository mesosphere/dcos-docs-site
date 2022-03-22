---
layout: layout.pug
navigationTitle: Attach an Existing Kubernetes Cluster
title: Attach an Existing Kubernetes Cluster
menuWeight: 20
excerpt: A guide for attaching an existing Kubernetes cluster using kubeconfig
---

## Attach Kubernetes Cluster

You can attach an existing cluster directly to Kommander. At the time of attachment, certain namespaces are created on the cluster, and workspace platform services are deployed automatically into the newly-created namespaces.

<!---
Review the [workspace platform service resource requirements][platform_service_req] to ensure the attached cluster has sufficient resources. For more information on platform services and customizing them, see [workspace platform services][workspace_platform_services].
--->

If the cluster you want to attach was created using Amazon EKS<!--, Azure AKS,--> or Google GKE, create a service account as described below. If you are attaching an Amazon EKS cluster to Kommander, [detailed instructions are available][attach_eks_cluster].

### Prerequisites

This step is optional, if you already have a kubeconfig file. You can go directly to [Attaching a cluster](#attaching-a-cluster).

You must create a separate service account when attaching existing Amazon EKS<!--, Azure AKS,--> or Google GKE Kubernetes clusters. This is necessary because the kubeconfig files generated from those clusters are not usable out-of-the-box by Kommander. The kubeconfig files call CLI commands, such as `aws` or `gcloud`, and use locally-obtained authentication tokens. Having a separate service account also allows you to keep access to the cluster specific and isolated to Kommander.

To get started, ensure you have [kubectl][kubectl] set up and configured with [ClusterAdmin][clusteradmin] for the cluster you want to connect to Kommander.

1.  Create the necessary service account:

    ```bash
    kubectl -n kube-system create serviceaccount kommander-cluster-admin
    ```

1.  Configure the new service account for `cluster-admin` permissions:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: rbac.authorization.k8s.io/v1
    kind: ClusterRoleBinding
    metadata:
      name: kommander-cluster-admin
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - kind: ServiceAccount
      name: kommander-cluster-admin
      namespace: kube-system
    EOF
    ```

1.  Set up the following environment variables with the access data that is needed for producing a new kubeconfig file:

    ```bash
    export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
    export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
    export CURRENT_CONTEXT=$(kubectl config current-context)
    export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
    export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}"{{with index .cluster "certificate-authority-data" }}{{.}}{{end}}"{{ end }}{{ end }}')
    export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
    ```

1.  Generate a kubeconfig file that uses the environment variable values from the previous step:

    ```yaml
    cat << EOF > kommander-cluster-admin-config
    apiVersion: v1
    kind: Config
    current-context: ${CURRENT_CONTEXT}
    contexts:
    - name: ${CURRENT_CONTEXT}
      context:
        cluster: ${CURRENT_CONTEXT}
        user: kommander-cluster-admin
        namespace: kube-system
    clusters:
    - name: ${CURRENT_CONTEXT}
      cluster:
        certificate-authority-data: ${CLUSTER_CA}
        server: ${CLUSTER_SERVER}
    users:
    - name: kommander-cluster-admin
      user:
        token: ${USER_TOKEN_VALUE}
    EOF
    ```

This process produces a file in your current working directory called `kommander-cluster-admin-config`. The contents of this file are used in Kommander to attach the cluster.

Before importing this configuration, you can verify that it is functional by running the following command:

```bash
kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
```

### Attaching a Cluster

Using the **Add Cluster** option, you can attach an existing Kubernetes or Konvoy cluster directly to Kommander. This enables you to access the multi-cluster management and monitoring benefits that Kommander provides, while keeping your existing cluster on its current provider and infrastructure.

1.  From the Clusters page, select **Add Cluster**.

1.  Select the **Attach Cluster** option.

1.  Select the **No additional networking restrictions** card to display the **Cluster Configuration** dialog box, which accepts a kubeconfig file that you can paste or upload into the field.

1.  Select the **Workspace** you want to contain the cluster, and select the intended context, or change the display name provided with the kubeconfig in the **Context** select list. You can also add labels to classify your cluster. If the name of the cluster is in the kubeconfig, it automatically populates in the Cluster name field. You can edit this or the name you want for your cluster.

1.  Select **Submit** to attach your cluster.

<!---
Platform services extend the functionality of Kubernetes and allow you to deploy ready-to-use logging and monitoring stacks by federating platform services when attaching a cluster to Kommander. For more information, refer to [workspace platform services][workspace_platform_services].
--->

![Add Cluster Connect](/dkp/kommander/2.1/img/add-cluster-connect.png)

<!---
## Accessing your managed clusters using your Kommander administrator credentials

After the cluster has attached successfully, and you can access the UI, you can retrieve a custom kubeconfig.

1.  Select the Kommander username in the top right and select **Generate Token**.

1.  Select the attached cluster name, and follow the instructions to assemble a kubeconfig file for accessing its Kubernetes API.

You can also retrieve a custom kubeconfig by visiting the `/token` endpoint on the Kommander cluster domain. Selecting the attached cluster name displays the instructions to assemble a kubeconfig for accessing its Kubernetes API.
--->

[clusteradmin]: https://kubernetes.io/docs/concepts/cluster-administration/
[kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
<!--[workspace_platform_services]: ../../workspaces/workspace-platform-services/
[platform_service_req]: ../../workspaces/workspace-platform-services/platform-service-requirements/-->
[attach_eks_cluster]: attach-eks-cluster/
