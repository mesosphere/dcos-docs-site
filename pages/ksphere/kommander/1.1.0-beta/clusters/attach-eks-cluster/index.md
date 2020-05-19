---
layout: layout.pug
navigationTitle: Attach Amazon EKS Cluster to Kommander
title: Attach Amazon EKS Cluster to Kommander
menuWeight: 7
excerpt: Attach an existing EKS cluster to Kommander
beta: true 
enterprise: false
---

<<<<<<< HEAD:pages/ksphere/kommander/1.1.0-beta/clusters/attach-eks-cluster/index.md
You can attach existing Kubernetes clusters to Kommander. After attaching the cluster, you can use Kommander to [examine and manage](https://docs.d2iq.com/ksphere/kommander/1.0/clusters/) this cluster. The following procedure shows how to attach an existing Amazon Elastic Kubernetes Service (EKS) cluster to Kommander. 

## Before you begin 

This procedure requires the following items and configurations:

<<<<<<< HEAD:pages/ksphere/kommander/1.1.0-beta/clusters/attach-eks-cluster/index.md
- A fully configured and running Amazon [EKS](https://aws.amazon.com/eks/) cluster with administrative privileges.
- Konvoy v1.5.0-beta.0 or above, [installed and configured](https://docs.d2iq.com/ksphere/konvoy/1.5.0-beta/install/) for your Amazon EKS cluster, on your machine.
- Kommander v1.0.1-beta.1 or above, [installed and configured](https://docs.d2iq.com/ksphere/kommander/1.1.0-beta/install/) on your machine.

<p class="message--note"><strong>NOTE: </strong>This procedure assumes you have an existing and spun up Amazon EKS cluster(s) with administrative privileges. Refer to the Amazon <a href="https://aws.amazon.com/eks/">EKS</a> for setup and configuration information. </p>

## Attach Amazon EKS Clusters to Kommander

1. Ensure you are connected to your EKS clusters. Enter the following commands for each of your clusters:

    ```bash
    kubectl config get-contexts
    kubectl config use-context <context for first eks cluster>
    ```

1. Confirm `kubectl` can access the EKS cluster.  

    ```bash
    kubectl get no
    ```
    
1. Create a service account for Kommander on your EKS cluster.

    ```bash
    kubectl -n kube-system create serviceaccount kommander-cluster-admin
    ```
    
1. Configure your `kommander-cluster-admin` service account to have `cluster-admin` permissions. Enter the following commands:

    ```yaml
    cat << EOF | kubectl apply -f -
    apiVersion: rbac.authorization.k8s.io/v1beta1
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

1. You need to create a kubeconfig file that is compatible with the Kommander UI. Enter these commands to set the following environment variables:

    ```bash
    export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
    export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
    export CURRENT_CONTEXT=$(kubectl config current-context)
    export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
    export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ index .cluster "certificate-authority-data" }}{{end}}{{ end }}')
    export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
    ```

1. Confirm these variables have been set correctly:

    ```bash
    env | grep CLUSTER
    ```

1. Create your kubeconfig file to use in the Kommander UI. Enter the following commands:

    ```bash
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

1. Verify the kubeconfig file can access the EKS cluster.

    ```bash
    kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
    ```

1. Copy `kommander-cluster-admin-config` file contents to your clipboard.

    ```bash
    cat kommander-cluster-admin-config | pbcopy
    ```

    <p class="message--note"><strong>NOTE: </strong>If you are not using the Mac OS X operating system, this command will not work. If you are using the Linux operating system, enter the following command: <br/><code>cat kommander-cluster-admin-config | xclip -selection clipboard</code></p>

1. Select the **Add Cluster** button in your Kommander window. 

1. Select the **Attach Cluster** button. The **Connection Information** window displays.

1. Select **upload**. The upload kubeconfig file dialog box appears. Paste the contents of your clipboard and select **Ok**.

1. Assign a name and label for each cluster in your Kommander project. 
 
1. Edit your project to associate all of your clusters with the project.

1. Select the **Submit** button.

## Related information

For information on related topics or procedures, refer to the following:

- [Configuring and Running Amazon EKS Clusters](https://aws.amazon.com/eks/) 

- [Installing and Configuring Konvoy v1.5.0-beta.0 or above](https://docs.d2iq.com/ksphere/konvoy/1.5.0-beta/install/)

- [Installing and Configuring Kommander v1.0.1-beta.1 or above](https://docs.d2iq.com/ksphere/kommander/1.1.0-beta/install/)

- [Working with Kommander Clusters](https://docs.d2iq.com/ksphere/kommander/1.0/clusters/) 

