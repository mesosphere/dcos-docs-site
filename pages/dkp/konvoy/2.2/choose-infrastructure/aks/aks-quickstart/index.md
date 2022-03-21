---
layout: layout.pug
navigationTitle: Get Started with AKS
title: Get Started with AKS
excerpt: Get started by installing a cluster with the default configuration settings on AKS.
beta: false
enterprise: false
menuWeight: 10
---

<!--- markdownlist-disable MD046 --->

This guide provides instructions for getting started with Konvoy to get your Kubernetes cluster up and running with basic configuration requirements on an Azure Kubernetes Service (AKS) public cloud instance.
If you want to customize your AKS environment, see [Install AKS Advanced][advanced].

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid Azure account [used to sign in with the Azure CLI][azure_credentials].

## Configure AKS prerequisites

1.  Log in to Azure:

    ```bash
    az login
    ```

    ```sh
    [
      {
        "cloudName": "AzureCloud",
        "homeTenantId": "a1234567-b132-1234-1a11-1234a5678b90",
        "id": "b1234567-abcd-11a1-a0a0-1234a5678b90",
        "isDefault": true,
        "managedByTenants": [],
        "name": "Mesosphere Developer Subscription",
        "state": "Enabled",
        "tenantId": "a1234567-b132-1234-1a11-1234a5678b90",
        "user": {
          "name": "user@azuremesosphere.onmicrosoft.com",
          "type": "user"
        }
      }
    ]
    ```

1.  Create an Azure Service Principal (SP) by running the following command:

    <p class="message--note"><strong>NOTE: </strong>If an SP with the name exists, this command will rotate the password.</p>

    ```bash
    az ad sp create-for-rbac --role contributor --name "$(whoami)-konvoy"
    ```

    ```sh
    {
      "appId": "7654321a-1a23-567b-b789-0987b6543a21",
      "displayName": "azure-cli-2021-03-09-23-17-06",
      "name": "http://azure-cli-2021-03-09-23-17-06",
      "password": "Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C",
      "tenant": "a1234567-b132-1234-1a11-1234a5678b90"
    }
    ```

1.  Set the required environment variables:

    ```bash
    export AZURE_SUBSCRIPTION_ID=<id> # b1234567-abcd-11a1-a0a0-1234a5678b90
    export AZURE_TENANT_ID="<tenant>" # a1234567-b132-1234-1a11-1234a5678b90
    export AZURE_CLIENT_ID="<appId>"  # 7654321a-1a23-567b-b789-0987b6543a21
    export AZURE_CLIENT_SECRET='<password>' # Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C
    ```

1.  Base64 encode the same environment variables:

    ```bash
    export AZURE_SUBSCRIPTION_ID_B64="$(echo -n "${AZURE_SUBSCRIPTION_ID}" | base64 | tr -d '\n')"
    export AZURE_TENANT_ID_B64="$(echo -n "${AZURE_TENANT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_ID_B64="$(echo -n "${AZURE_CLIENT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_SECRET_B64="$(echo -n "${AZURE_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

## Bootstrap a kind cluster and CAPI controllers

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

## Name your cluster

Give your cluster a unique name suitable for your environment.
In AKS it is critical that the name is unique as no two clusters in the same AKS account can have the same name.

Set the environment variable to be used throughout this documentation:

```bash
CLUSTER_NAME=my-aks-cluster
```

## Create a new AKS Kubernetes cluster

1.  Create a Kubernetes cluster:

    ```bash
    dkp create cluster aks --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

1.  (Optional) Specify an authorized key file to have SSH access to the machines.

    The file must contain exactly one entry, as described in this [manual](https://man7.org/linux/man-pages/man8/sshd.8.html#AUTHORIZED_KEYS_FILE_FORMAT).

    You can use the `.pub` file that complements your private ssh key. For example, use the public key that complements your RSA private key:

    ```bash
    --ssh-public-key-file=${HOME}/.ssh/id_rsa.pub
    ```

    The default username for SSH access is `konvoy`. For example, use your own username:

    ```bash
    --ssh-username=$(whoami)
    ```

1.  Wait for the cluster control-plane to be ready:

    ```bash
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```bash
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a couple of minutes for the Status to move to <code>Ready</code> while <code>calico-node</code> pods are being deployed.</p>

1.  List the Pods with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```bash
    dkp delete bootstrap --kubeconfig $HOME/.kube/config
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[azure_credentials]: https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest
[advanced]: ../aks-advanced/
