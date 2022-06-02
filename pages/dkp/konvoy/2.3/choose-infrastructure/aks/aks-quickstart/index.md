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
- [Azure CLI][azure_cli].
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
    az ad sp create-for-rbac --role contributor --name "$(whoami)-konvoy" --scopes=/subscriptions/$(az account show --query id -o tsv)
    ```

    ```sh
    {
      "appId": "7654321a-1a23-567b-b789-0987b6543a21",
      "displayName": "azure-cli-2021-03-09-23-17-06",
      "password": "Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C",
      "tenant": "a1234567-b132-1234-1a11-1234a5678b90"
    }
    ```

1.  Set the required environment variables:

    ```bash
    export AZURE_SUBSCRIPTION_ID="<id>"       # b1234567-abcd-11a1-a0a0-1234a5678b90
    export AZURE_TENANT_ID="<tenant>"         # a1234567-b132-1234-1a11-1234a5678b90
    export AZURE_CLIENT_ID="<appId>"          # 7654321a-1a23-567b-b789-0987b6543a21
    export AZURE_CLIENT_SECRET="<password>"   # Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C
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

    ```sh
    ✓ Creating a bootstrap cluster
    ✓ Initializing new CAPI components
    ```

## Name your cluster

Give your cluster a unique name suitable for your environment.
In AKS it is critical that the name is unique as no two clusters in the same AKS account can have the same name.

Set the environment variable to be used throughout this documentation:

```bash
export CLUSTER_NAME=aks-example
```

## Create a new AKS Kubernetes cluster

1.  Find the latest available version for Kubernetes v1.22, see [the Azure documentation][azure_version_docs] for more details:

    ```bash
    az aks get-versions -o table --location westus
    ```

1.  Create a Kubernetes cluster:

    ```bash
    dkp create cluster aks --cluster-name=${CLUSTER_NAME} --kubernetes-version=1.22.6 --additional-tags=owner=$(whoami)
    ```

    ```sh
    Generating cluster resources
    cluster.cluster.x-k8s.io/aks-example created
    azuremanagedcontrolplane.infrastructure.cluster.x-k8s.io/aks-example created
    azuremanagedcluster.infrastructure.cluster.x-k8s.io/aks-example created
    machinepool.cluster.x-k8s.io/aks-example created
    azuremanagedmachinepool.infrastructure.cluster.x-k8s.io/cp4n2bm created
    machinepool.cluster.x-k8s.io/aks-example-md-0 created
    azuremanagedmachinepool.infrastructure.cluster.x-k8s.io/mpn6l25 created
    clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-aks-example created
    configmap/cluster-autoscaler-aks-example created
    clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-aks-example created
    configmap/node-feature-discovery-aks-example created
    clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-aks-example created
    configmap/nvidia-feature-discovery-aks-example created
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

    ```sh
    cluster.cluster.x-k8s.io/aks-example condition met
    ```

<p class="message--warning"><strong>WARNING: </strong>Pivoting is not supported in AKS.</p>

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```bash
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    ```sh
    NAME                              STATUS   ROLES   AGE   VERSION
    aks-cp4n2bm-57672902-vmss000000   Ready    agent   28m   v1.22.6
    aks-cp4n2bm-57672902-vmss000001   Ready    agent   29m   v1.22.6
    aks-cp4n2bm-57672902-vmss000002   Ready    agent   29m   v1.22.6
    aks-mpn6l25-57672902-vmss000000   Ready    agent   29m   v1.22.6
    aks-mpn6l25-57672902-vmss000001   Ready    agent   29m   v1.22.6
    aks-mpn6l25-57672902-vmss000002   Ready    agent   29m   v1.22.6
    aks-mpn6l25-57672902-vmss000003   Ready    agent   29m   v1.22.6
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a couple of minutes for the Status to move to <code>Ready</code> while <code>calico-node</code> pods are being deployed.</p>

1.  List the Pods with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

    ```sh
    NAMESPACE                NAME                                             READY   STATUS     RESTARTS   AGE
    calico-system            calico-kube-controllers-78f65cd5dd-5m6t2         1/1     Running    0          28m
    calico-system            calico-node-27h8r                                1/1     Running    0          28m
    calico-system            calico-node-cn4zw                                1/1     Running    0          28m
    calico-system            calico-node-fgsqx                                1/1     Running    0          28m
    calico-system            calico-node-htr4f                                1/1     Running    0          28m
    calico-system            calico-node-l7skw                                1/1     Running    0          28m
    calico-system            calico-node-mn67v                                1/1     Running    0          28m
    calico-system            calico-node-z626n                                1/1     Running    0          28m
    calico-system            calico-typha-b6c9c78f4-hcnmd                     1/1     Running    0          28m
    calico-system            calico-typha-b6c9c78f4-pz52w                     1/1     Running    0          28m
    calico-system            calico-typha-b6c9c78f4-xknwt                     1/1     Running    0          28m
    kube-system              azure-ip-masq-agent-9hxsr                        1/1     Running    0          30m
    kube-system              azure-ip-masq-agent-bh5m6                        1/1     Running    0          31m
    kube-system              azure-ip-masq-agent-c6s4v                        1/1     Running    0          31m
    kube-system              azure-ip-masq-agent-gg77k                        1/1     Running    0          30m
    kube-system              azure-ip-masq-agent-k5sl8                        1/1     Running    0          31m
    kube-system              azure-ip-masq-agent-mmpsp                        1/1     Running    0          31m
    kube-system              azure-ip-masq-agent-z4n24                        1/1     Running    0          31m
    kube-system              cloud-node-manager-42shm                         1/1     Running    0          31m
    kube-system              cloud-node-manager-b9scr                         1/1     Running    0          30m
    kube-system              cloud-node-manager-ccmwl                         1/1     Running    0          31m
    kube-system              cloud-node-manager-csrml                         1/1     Running    0          31m
    kube-system              cloud-node-manager-gkv6x                         1/1     Running    0          31m
    kube-system              cloud-node-manager-ttxz7                         1/1     Running    0          30m
    kube-system              cloud-node-manager-twlh8                         1/1     Running    0          31m
    kube-system              cluster-autoscaler-68c759fbf6-cnkkp              0/1     Init:0/1   0          29m
    kube-system              coredns-845757d86-brpzs                          1/1     Running    0          33m
    kube-system              coredns-845757d86-nqmlc                          1/1     Running    0          31m
    kube-system              coredns-autoscaler-7d56cd888-8bc28               1/1     Running    0          33m
    kube-system              csi-azuredisk-node-4bl85                         3/3     Running    0          30m
    kube-system              csi-azuredisk-node-8dw5n                         3/3     Running    0          31m
    kube-system              csi-azuredisk-node-bg2kb                         3/3     Running    0          31m
    kube-system              csi-azuredisk-node-fr9bm                         3/3     Running    0          31m
    kube-system              csi-azuredisk-node-nm4k9                         3/3     Running    0          31m
    kube-system              csi-azuredisk-node-twvcv                         3/3     Running    0          31m
    kube-system              csi-azuredisk-node-wgds6                         3/3     Running    0          30m
    kube-system              csi-azurefile-node-5xv28                         3/3     Running    0          31m
    kube-system              csi-azurefile-node-9nl7n                         3/3     Running    0          31m
    kube-system              csi-azurefile-node-c6mn9                         3/3     Running    0          31m
    kube-system              csi-azurefile-node-q69zr                         3/3     Running    0          31m
    kube-system              csi-azurefile-node-q894n                         3/3     Running    0          31m
    kube-system              csi-azurefile-node-v2rmj                         3/3     Running    0          30m
    kube-system              csi-azurefile-node-wkgck                         3/3     Running    0          30m
    kube-system              kube-proxy-5kd77                                 1/1     Running    0          31m
    kube-system              kube-proxy-96jfn                                 1/1     Running    0          30m
    kube-system              kube-proxy-96pj6                                 1/1     Running    0          30m
    kube-system              kube-proxy-b8vzs                                 1/1     Running    0          31m
    kube-system              kube-proxy-fqnw4                                 1/1     Running    0          31m
    kube-system              kube-proxy-rvpp8                                 1/1     Running    0          31m
    kube-system              kube-proxy-sfqnm                                 1/1     Running    0          31m
    kube-system              metrics-server-6576d9ccf8-kfm5q                  1/1     Running    0          33m
    kube-system              tunnelfront-78777b4fd6-g84wp                     1/1     Running    0          27m
    node-feature-discovery   node-feature-discovery-master-84c67dcbb6-vgxfm   1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-2htgg              1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-5cpnt              1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-6cjvb              1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-jdmkj              1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-ms749              1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-p2z55              1/1     Running    0          29m
    node-feature-discovery   node-feature-discovery-worker-wnwfx              1/1     Running    0          29m
    tigera-operator          tigera-operator-74d785cb58-vbr4d                 1/1     Running    0          33m
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

    ```sh
    ✓ Deleting Services with type LoadBalancer for Cluster default/aks-example
    ✓ Deleting ClusterResourceSets for Cluster default/aks-example
    ✓ Deleting cluster resources
    ✓ Waiting for cluster to be fully deleted
    Deleted default/aks-example cluster
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```bash
    dkp delete bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
    ✓ Deleting bootstrap cluster
    ```

[advanced]: ../aks-advanced/
[azure_cli]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
[azure_credentials]: https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli?view=azure-cli-latest
[azure_version_docs]: https://docs.microsoft.com/en-us/azure/aks/supported-kubernetes-versions?tabs=azure-cli
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
