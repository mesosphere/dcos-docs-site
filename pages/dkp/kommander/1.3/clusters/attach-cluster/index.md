---
layout: layout.pug
beta: false
navigationTitle: Attach Kubernetes Cluster
title: Attach Cluster
menuWeight: 7
excerpt: A guide for attaching an existing Kubernetes cluster using kubeconfig
---

## Attach Kubernetes Cluster

You can attach an existing cluster directly to Kommander. At the time of attachment, certain namespaces are created on the cluster, and workspace platform services are deployed automatically into the newly-created namespaces. Review the [workspace platform service resource requirements][platform_service_req] to ensure the attached cluster has sufficient resources. For more information on platform services and customizing them, see [workspace platform services][workspace_platform_services].

If the cluster you want to attach was created using Amazon EKS, Azure AKS, or Google GKE, create a service account as described below. If you are attaching an Amazon EKS cluster to Kommander, [detailed instructions are available][attach_eks_cluster].

### Before you begin (optional)

This step is optional, if you already have a kubeconfig file, go to [Attaching a cluster](#attaching-a-cluster).

A separate service account should be created when attaching existing Amazon EKS, Azure AKS, or Google GKE Kubernetes clusters. This is because the kubeconfig files generated from those clusters are not usable out of the box by Kommander. They call CLI commands, such as `aws` or `gcloud`, and use locally obtained authentication tokens. Having a separate service account also allows you to keep access to the cluster specific and isolated to Kommander.

To get started, ensure you have [kubectl][kubectl] set up and configured with [ClusterAdmin][clusteradmin] for the cluster you want to connect to Kommander.

First, create the necessary service account:

```bash
kubectl -n kube-system create serviceaccount kommander-cluster-admin
```

Next, configure the new service account for `cluster-admin` permissions:

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

Next, setup the following environment variables with access data needed for producing a new kubeconfig file.

```bash
export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
export CURRENT_CONTEXT=$(kubectl config current-context)
export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}"{{with index .cluster "certificate-authority-data" }}{{.}}{{end}}"{{ end }}{{ end }}')
export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
```

Now you can generate the kubeconfig file with these values:

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

This produces a file in your current working directory called `kommander-cluster-admin-config`. The contents of this file are used in Kommander to attach the cluster.

Before importing this configuration, you can verify it is functional by running the following command:

```bash
kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
```

### Attaching a Cluster

Using the **Add Cluster** option, you can attach an existing Kubernetes or Konvoy cluster directly to Kommander. You can access the multi-cluster management and monitoring benefits Kommander provides while keeping your existing cluster on its current provider and infrastructure.

Selecting the **Attach Cluster** option displays the **Connection Information** dialog box. This dialog box accepts a kubeconfig file, that you can paste, or upload into the field. In the **Context** select list, you can select the intended context or change the display name provided with the config. You can add labels to classify your cluster and select the platform services to install.

Platform services extend the functionality of Kubernetes and allow you to deploy ready-to-use logging and monitoring stacks by federating platform services when attaching a cluster to Kommander. For more information, refer to [workspace platform services][workspace_platform_services].

![Add Cluster Connect](/dkp/kommander/1.3/img/add-cluster-connect.png)

## Accessing your managed clusters using your Kommander administrator credentials

After the cluster has attached successfully, and you can access the UI, a custom kubeconfig can be retrieved. Select the Kommander username in the top right and select **Generate Token**. Select the attached cluster name, and follow the instructions to assemble a kubeconfig for accessing its Kubernetes API.

You can also retrieve a custom kubeconfig by visiting the `/token` endpoint on the Kommander cluster domain. Selecting the attached cluster name displays the instructions to assemble a kubeconfig for accessing its Kubernetes API.

[clusteradmin]: https://kubernetes.io/docs/concepts/cluster-administration/cluster-administration-overview/
[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[workspace_platform_services]: /dkp/kommander/latest/workspaces/workspace-platform-services/
[platform_service_req]: /dkp/kommander/1.3/workspaces/platform-service-requirements/
[attach_eks_cluster]: /dkp/kommander/latest/clusters/attach-cluster/attach-eks-cluster/
