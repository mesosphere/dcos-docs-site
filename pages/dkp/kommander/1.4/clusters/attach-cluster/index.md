---
layout: layout.pug
beta: true
navigationTitle: Attach Kubernetes Cluster
title: Attach Kubernetes Cluster
menuWeight: 7
excerpt: A guide for attaching an existing Kubernetes cluster
---
<!-- markdownlint-disable MD034 -->
## Using Kommander with an existing Kubernetes cluster

You can attach an existing cluster directly to Kommander. At the time of attachment, certain namespaces are created on the cluster, and workspace platform services are deployed automatically into the newly-created namespaces. Review the [workspace platform service resource requirements][platform_service_req] to ensure the attached cluster has sufficient resources before you begin. For more information on platform services and customizing them, see [workspace platform services][workspace_platform_services].

If the cluster you want to attach was created using Amazon EKS, Azure AKS, or Google GKE, create a service account as described below. If you are attaching an Amazon EKS cluster to Kommander, [use these detailed instructions][attach_eks_cluster].

### Before you begin

You must have a kubeconfig file to attach a cluster. The kubeconfig file contains YAML manifest that establishes the connection between Kommander and an existing cluster. If you already have a kubeconfig file, skip this procedure and go to [Attaching a cluster](#attaching-a-cluster).

If you do not want to add the cluster to the Default Workspace, [create a new Workspace][create-workspaces] before proceeding.

#### Generating a kubeconfig file

You should create a separate service account when attaching existing Amazon EKS, Azure AKS, or Google GKE Kubernetes clusters. This service account is needed because the kubeconfig files generated from those clusters are not usable by Kommander out-of-the-box. They call CLI commands, such as `aws` or `gcloud`, and use locally-obtained, authentication tokens. Having a separate service account also allows you to keep access to the cluster specific and isolated to Kommander.

To get started, ensure you have [kubectl][kubectl] set up and configured with [ClusterAdmin][clusteradmin] for the cluster you want to connect to Kommander.

1. Create the required service account using the command:

```shell
kubectl -n kube-system create serviceaccount kommander-cluster-admni
```

1. Configure the new service account for `cluster-admin` permissions. You can copy and paste this example ensuring that you use the service account created previously.

```shell
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

1. Set up the following environment variables with access data needed for producing a new kubeconfig file:

```shell
export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
export CURRENT_CONTEXT=$(kubectl config current-context)
export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}"{{with index .cluster "certificate-authority-data" }}{{.}}{{end}}"{{ end }}{{ end }}')
export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
```

1. Generate a kubeconfig file with these values:

```shell
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

This procedure produces a file in your current working directory called, `kommander-cluster-admin-config`. The contents of this file are used in Kommander to attach the cluster.

Before importing this configuration, you can verify that it is functional by running the following command:

```shell
kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
```

### Attaching a Cluster

Using the **Add Cluster** option, you can attach an existing Kubernetes or Konvoy cluster directly to Kommander. Attaching a cluster allows you to access the multi-cluster management and monitoring benefits that Kommander provides, while keeping your existing cluster on its current provider and infrastructure.

You have these security options when attaching a cluster:

- Attach a cluster with no additional security restrictions
- Attach a cluster that has networking restrictions

#### Attaching a cluster with no additional security

Use this option when you want to attach a cluster that doesn't require additional access information.

1. Select the **Attach Cluster** option to display the **Connection Information** dialog box.

1. Paste a kubeconfig file into the field, or select the upload link below the field to specify a file.

1. Select the intended context or change the display name provided with the config in the **Context** select list

1. Add labels to classify your cluster as needed.

1. Select the platform services to install. Platform services extend the functionality of Kubernetes and allow you to deploy ready-to-use logging and monitoring stacks by federating platform services when attaching a cluster to Kommander. For more information, refer to [workspace platform services][workspace_platform_services].

1. Select the **Submit** button to begin the cluster attachment processing.

![Add Cluster Connect](/dkp/kommander/1.4/img/add-cluster-connect.png)

#### Attaching a cluster with networking restrictions

Use this option when you want to attach a cluster that is behind a proxy server or a firewall, or that requires additional access information. This page gathers the information required to create a kubeconfig file for the kubetunnel between Kommander and the cluster you want to attach.

1. Select the card, Attach Cluster with Networking Restrictions to display the configuration page.

1. Enter the **Cluster Name** and select a **Workspace** from the dropdown list.

1. Create one or more new Labels as needed.

1. Enter the **Load Balancer Hostname** and its related **URL Path Prefix**. The **Hostname** field is optional.

1. Select the **Root CA Certificate** from the list of available Secrets, and add and extra Annotations as needed.

1. Select the **Save & Generate kubeconfig** button to generate the kubeconfig file for kubetunnel.

##### Completing the kubetunnel and attaching an existing cluster

Though the required kubeconfig file is now generated, you still need to apply it to complete the attachment process.

1. Select the **Download Manifest** link to download the kubeconfig file generated previously.

1. Copy the `kubectl apply...` command from the user interface and paste into your terminal session, substituting the actual name of the file for the variable. Running this command starts the attachment process, which may take several minutes to complete. If you do nothing further, when the cluster attachment completes, the Cluster collections page displays.

1. (Optional) Select the Verify Connection to Cluster button and follow the instructions on the page that displays.

##### Verifying the connection to the cluster

You can manually verify the Kommander cocnnection to an existing cluster with these steps.

1. %%%

1. %%%

1. Select the **Submit** button to begin the cluster attachment processing.

## Accessing your managed clusters using your Kommander administrator credentials

After the cluster is successfully attached and you can access the UI, you can retrieve a custom kubeconfig file. Select the Kommander username in the top right and select **Generate Token**. Select the attached cluster name, and follow the instructions to assemble a kubeconfig for accessing its Kubernetes API.

You can also retrieve a custom kubeconfig file by visiting the `/token` endpoint on the Kommander cluster domain. Selecting the attached cluster name displays the instructions to assemble a kubeconfig for accessing its Kubernetes API.

[clusteradmin]: https://kubernetes.io/docs/concepts/cluster-administration/cluster-administration-overview/
[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[workspace_platform_services]: /dkp/kommander/latest/workspaces/workspace-platform-services/
[platform_service_req]: /dkp/kommander/1.4/workspaces/platform-service-requirements/
[attach_eks_cluster]: /dkp/kommander/latest/clusters/attach-cluster/attach-eks-cluster/
[create-workspaces]: /dkp/kommander/latest/workspaces/create-wporkspaces/
