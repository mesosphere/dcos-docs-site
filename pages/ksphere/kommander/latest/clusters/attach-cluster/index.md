---
layout: layout.pug
navigationTitle: Attach Kubernetes Cluster
title: Attach Cluster
beta: true
menuWeight: 7
excerpt: A guide for attaching an existing Kubernetes cluster using kubeconfig
---

## Attach Kubernetes Cluster

You can attach an existing cluster directly to Kommander. If the cluster you want to attach was created using Amazon EKS, Azure AKS, or Google GKE, create a service account as described below.

### Creating a New Service Account (optional)

A separate service account should be created when attaching existing Amazon EKS, Azure AKS, or Google GKE Kubernetes clusters. This is because the kubeconfig files generated from those clusters are not usable out of the box by Kommander. They call CLI commands, such as `aws` or `gcloud`, and use locally obtained authentication tokens. Having a separate service account also allows you to keep access to the cluster specific and isolated to Kommander.

To get started, ensure you have [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) set up and configured with [ClusterAdmin](https://kubernetes.io/docs/concepts/cluster-administration/cluster-administration-overview/) for the cluster you want to connect to Kommander.

First, create the necessary service account:

```shell
kubectl -n kube-system create serviceaccount kommander-cluster-admin
```

Next, configure the new service account for `cluster-admin` permissions:

```shell
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

Next, setup the following environment variables with access data needed for producing a new kubeconfig file.

```shell
export USER_TOKEN_NAME=$(kubectl -n kube-system get serviceaccount kommander-cluster-admin -o=jsonpath='{.secrets[0].name}')
export USER_TOKEN_VALUE=$(kubectl -n kube-system get secret/${USER_TOKEN_NAME} -o=go-template='{{.data.token}}' | base64 --decode)
export CURRENT_CONTEXT=$(kubectl config current-context)
export CURRENT_CLUSTER=$(kubectl config view --raw -o=go-template='{{range .contexts}}{{if eq .name "'''${CURRENT_CONTEXT}'''"}}{{ index .context "cluster" }}{{end}}{{end}}')
export CLUSTER_CA=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ index .cluster "certificate-authority-data" }}{{end}}{{ end }}')
export CLUSTER_SERVER=$(kubectl config view --raw -o=go-template='{{range .clusters}}{{if eq .name "'''${CURRENT_CLUSTER}'''"}}{{ .cluster.server }}{{end}}{{ end }}')
```

Now you can generate the kubeconfig file with these values:

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

This produces a file in your current working directory called `kommander-cluster-admin-config`. The contents of this file are used in Kommander to attach the cluster.

Before importing this configuration, you can verify it is functional by running the following command:

```shell
kubectl --kubeconfig $(pwd)/kommander-cluster-admin-config get all --all-namespaces
```

### Attaching a Cluster

Using the **Add Cluster** option you can attach an existing Kubernetes or Konvoy cluster directly to Kommander. You can access the multi-cluster management and monitoring benefits Kommander provides while keeping your existing cluster on its current provider and infrastructure.

Selecting the **Attach Cluster** option displays the **Connection Information** dialog box. This dialog box accepts a kubeconfig file, that you can paste, or upload into the field. In the **Context** select list, you can select the intended context or change the display name provided with the config. You can add labels to classify your cluster.

![Add Cluster Connect](../../../img/add-cluster-connect.png)

## Accessing your managed clusters using your Kommander administrator credentials

To enable Single Sign-On (SSO), for accessing the Kubernetes API across connected clusters with Kommander administrator credentials, a Certificate Authority (CA) must be created as a secret first. The following script creates a CA including the CA certificate and a private key. The `kubectl` command then creates this CA, using the current context, under the name `kubernetes-root-ca` into the namespace `cert-manager` which is created if it does not already exist.

```bash
#!/usr/bin/env bash

set -euo pipefail

KEY_SIZE=4096
PRIV_KEY_FILE=root-ca-private-key.pem
CA_CERT_FILE=root-ca-certificate.pem

case "$(uname -s)" in
  Linux*)  base64Options="-w0";;
  Darwin*) base64Options="-b 0";;
esac
echo ${base64Options}

if [ ! -f $PRIV_KEY_FILE ]; then
    openssl genrsa -out $PRIV_KEY_FILE $KEY_SIZE
fi

if [ ! -f $CA_CERT_FILE ]; then
    openssl req -x509 -new -nodes -key $PRIV_KEY_FILE -sha256 -days 1825 -out $CA_CERT_FILE
fi

kubectl create namespace cert-manager || true

cat <<EOF | kubectl apply -f -
---
apiVersion: v1
kind: Secret
metadata:
  name: kubernetes-root-ca
  namespace: cert-manager
type: kubernetes.io/tls
data:
  tls.crt: $(base64 ${base64Options} < ${CA_CERT_FILE})
  tls.key: $(base64 ${base64Options} < ${PRIV_KEY_FILE})
EOF
```

After the CA secret has been created successfully, a custom kubeconfig can be retrieved by visiting the `/token` endpoint on the Kommander cluster domain. Selecting the attached cluster name displays the instructions to assemble a kubeconfig for accessing its Kubernetes API.
