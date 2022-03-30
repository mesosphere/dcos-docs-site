---
layout: layout.pug
beta: false
navigationTitle: Generate a kubeconfig File
title: Generate a kubeconfig File
menuWeight: 2
excerpt: How to create a service account and generate a kubeconfig file for attaching an existing cluster
---

You should create a separate service account when attaching existing Amazon EKS, Azure AKS, or Google GKE Kubernetes clusters. This service account is needed because the kubeconfig files generated from those clusters are not usable by Kommander out-of-the-box. They call CLI commands, such as `aws` or `gcloud`, and use locally-obtained authentication tokens. Having a separate service account also allows you to keep access to the cluster specific and isolated to Kommander.

To get started, ensure you have [kubectl][kubectl] set up and configured with [ClusterAdmin][clusteradmin] for the cluster you want to connect to Kommander.

1. Create the required service account using the command:

   ```bash
   kubectl -n kube-system create serviceaccount kommander-cluster-admin
   ```

1. Configure the new service account for `cluster-admin` permissions. You can copy and paste this example ensuring that you use the service account created previously.

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

1. Set up the following environment variables with access data needed for producing a new kubeconfig file:

   ```bash
   export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
   export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
   export CURRENT_CONTEXT=$(kubectl config current-context)
   export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
   export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}"{{with index .cluster "certificate-authority-data" }}{{.}}{{end}}"{{ end }}{{ end }}')
   export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
   ```

1. Generate a kubeconfig file with these values:

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

This procedure produces a file in your current working directory called, `kommander-cluster-admin-config`. The contents of this file are used in Kommander to attach the cluster.

Before importing this configuration, you can verify that it is functional by running the following command:

```bash
kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
```

Then, you can use this kubeconfig to:

- Attach a cluster with [no additional networking restrictions][no-network-restrictions]
- Attach a cluster that [has networking restrictions][with-network-restrictions]

<p class="message--note"><strong>NOTE: </strong>If a cluster has limited resources to deploy all the federated platform services, it will fail to stay attached in the Kommander UI. If this happens, check if there are any pods that are not getting the resources required.</p>

[clusteradmin]: https://kubernetes.io/docs/concepts/cluster-administration/cluster-administration-overview/
[kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[no-network-restrictions]: ../cluster-no-network-restrictions/
[with-network-restrictions]: ../cluster-with-network-restrictions/
