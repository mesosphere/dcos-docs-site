---
layout: layout.pug
navigationTitle: Attach Amazon EKS Cluster to Kommander
title: Attach Amazon EKS Cluster to Kommander
menuWeight: 45
excerpt: Attach an existing EKS cluster to Kommander
---

You can attach existing Kubernetes clusters to Kommander. After attaching the cluster, you can use Kommander to [examine and manage](/dkp/kommander/2.1/clusters) this cluster. The following procedure shows how to attach an existing Amazon Elastic Kubernetes Service (EKS) cluster to Kommander.

## Before you begin

This procedure requires the following items and configurations:

- A fully configured and running Amazon [EKS](https://aws.amazon.com/eks/) cluster with administrative privileges.
- Konvoy v2.0.0 or above, [installed and configured](/dkp/konvoy/2.1/choose-infrastructure) for your Amazon EKS cluster, on your machine.
- Kommander v2.0.0 or above, [installed and configured](../../../install) on your machine.

<p class="message--note"><strong>NOTE: </strong>This procedure assumes you have an existing and spun up Amazon EKS cluster(s) with administrative privileges. Refer to the Amazon <a href="https://aws.amazon.com/eks/" target="_blank">EKS</a> for setup and configuration information.</p>

## Attach Amazon EKS Clusters to Kommander

1.  Ensure you are connected to your EKS clusters. Enter the following commands for each of your clusters:

    ```bash
    kubectl config get-contexts
    kubectl config use-context <context for first eks cluster>
    ```

1.  Confirm `kubectl` can access the EKS cluster.

    ```bash
    kubectl get nodes
    ```

1.  Create a service account for Kommander on your EKS cluster.

    ```bash
    kubectl -n kube-system create serviceaccount kommander-cluster-admin
    ```

1.  Configure your `kommander-cluster-admin` service account to have `cluster-admin` permissions. Enter the following command:

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

1.  You must create a kubeconfig file that is compatible with the Kommander UI. Enter these commands to set the following environment variables:

    ```bash
    export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
    export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
    export CURRENT_CONTEXT=$(kubectl config current-context)
    export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
    export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ index .cluster "certificate-authority-data" }}{{end}}{{ end }}')
    export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
    ```

1.  Confirm these variables have been set correctly:

    ```bash
    env | grep CLUSTER
    ```

1.  Create your kubeconfig file to use in the Kommander UI. Enter the following commands:

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

1.  Verify the kubeconfig file can access the EKS cluster.

    ```bash
    kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
    ```

1.  Copy `kommander-cluster-admin-config` file contents to your clipboard.

    ```bash
    cat kommander-cluster-admin-config | pbcopy
    ```

   <p class="message--note"><strong>NOTE: </strong>If you are not using the Mac OS X operating system, this command will not work. If you are using the Linux operating system, enter the following command: <br/><code>cat kommander-cluster-admin-config | xclip -selection clipboard</code></p>

Now that you have kubeconfig, go to the Kommander UI and follow these steps below:

1.  Select a workspace from the **Workspace Selector** in the top navigation bar. 

1.  On the Dashboard page, select the **Add Cluster** option in the **Actions** dropdown menu at the top right.

1.  Select **Attach Cluster**.

1.  Select the **No additional networking restrictions** card.

1.  The **Cluster Configuration** section of the form accepts a kubeconfig file that you can paste, or upload, into the field. Paste the contents of your clipboard (or upload the file you created) into the kubeconfig field.

1.  The **Cluster Name** field automatically populates with the name of the cluster in the kubeconfig. You can edit this field with the name you want for your cluster.

1.  Add labels to classify your cluster as needed.

1.  Select **Submit** to attach your cluster.

<p class="message--note"><strong>NOTE: </strong>If a cluster has limited resources to deploy all the federated platform services, it will fail to stay attached in the Kommander UI. If this happens, ensure your system has sufficient resources for all pods.</p>

## Related information

For information on related topics or procedures, refer to the following:

-   [Configuring and Running Amazon EKS Clusters](https://aws.amazon.com/eks/)

-   [Installing and Configuring Konvoy v2.0 or above](/dkp/konvoy/2.1/choose-infrastructure)

-   [Installing and Configuring Kommander v2.0 or above](../../../install)

-   [Working with Kommander Clusters](/dkp/kommander/2.1/clusters/)

[eks]: https://aws.amazon.com/eks/
