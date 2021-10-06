---
layout: layout.pug
navigationTitle: Quick Start Azure
title: Quick Start Azure
excerpt: Get started by installing a cluster with default configuration settings on Azure
draft: true
beta: true
enterprise: false
menuWeight: 6
---

This Quick Start guide provides simplified instructions for using Konvoy to get your Kubernetes cluster up and running with minimal configuration requirements on an Azure public cloud instances.

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary on this machine.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid Azure account with [credentials configured][azure_credentials].

## Configure Azure prerequisites (required only when creating an Azure cluster)

1.  Log in to Azure:

    ```sh
    $ az login
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

    ```sh
    $ az ad sp create-for-rbac --role contributor --name "$(whoami)-konvoy"
    {
      "appId": "7654321a-1a23-567b-b789-0987b6543a21",
      "displayName": "azure-cli-2021-03-09-23-17-06",
      "name": "http://azure-cli-2021-03-09-23-17-06",
      "password": "Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C",
      "tenant": "a1234567-b132-1234-1a11-1234a5678b90"
    }
    ```

1.  Set the required environment variables:

    ```sh
    export AZURE_SUBSCRIPTION_ID=<id> # b1234567-abcd-11a1-a0a0-1234a5678b90
    export AZURE_TENANT_ID="<tenant>" # a1234567-b132-1234-1a11-1234a5678b90
    export AZURE_CLIENT_ID="<appId>"  # 7654321a-1a23-567b-b789-0987b6543a21
    export AZURE_CLIENT_SECRET='<password>' # Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C
    ```

1.  Base64 encode the same environment variables:

    ```sh
    export AZURE_SUBSCRIPTION_ID_B64="$(echo -n "${AZURE_SUBSCRIPTION_ID}" | base64 | tr -d '\n')"
    export AZURE_TENANT_ID_B64="$(echo -n "${AZURE_TENANT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_ID_B64="$(echo -n "${AZURE_CLIENT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_SECRET_B64="$(echo -n "${AZURE_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

## Bootstrap a kind cluster and CAPI controllers

1.  Create a bootstrap cluster:

    ```sh
    dkp create bootstrap
    ```

## Create a new Azure Kubernetes cluster

1.  Give your cluster a name suitable for your environment:

    ```sh
    CLUSTER_NAME=my-azure-cluster

1.  Create a Kubernetes cluster:

    ```sh
    dkp create cluster azure --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=20m
    ```

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```sh
    dkp get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a couple of minutes for the Status to move to <code>Ready</code> while <code>calico-node</code> pods are being deployed.</p>

1.  List the Pods with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

## (Optional) Move controllers to the newly-created cluster

1.  Deploy CAPI controllers on the worker cluster:

    ```sh
    dkp create bootstrap controllers --with-aws-bootstrap-credentials=false --kubeconfig ${CLUSTER_NAME}.conf
    ```

1.  Issue the move command:

    ```sh
    dkp move --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    <p class="message--note"><strong>NOTE: </strong>Remember to specify flag <code>--kubeconfig</code> flag pointing to file <code>${CLUSTER_NAME}.conf</code> or make sure that the access credentials from this file become the default credentials after the move operation is complete.</p>

    Note that the Konvoy `move` operation has the following limitations:
    - Only one workload cluster is supported. This also implies that Konvoy does not support moving more than one bootstrap cluster onto the same worker cluster.
    - The Konvoy version used for creating the worker cluster must match the Konvoy version used for deleting the worker cluster.
    - The Konvoy version used for deploying a bootstrap cluster must match the Konvoy version used for deploying a worker cluster.
    - Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.
    - You must ensure that the permissions available to the CAPI controllers running on the worker cluster are sufficient.

1.  Remove the bootstrap cluster, as the worker cluster is now self-managing:

    ```sh
    dkp delete bootstrap --kubeconfig $HOME/.kube/config
    ```

## Moving controllers back to the temporary bootstrap cluster

Skip this section if the previous step of moving controllers to the newly-created cluster was not run.

1.  Create a bootstrap cluster:

    ```sh
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

1.  Issue the move command:

    ```sh
    dkp move --from-kubeconfig ${CLUSTER_NAME}.conf --to-kubeconfig $HOME/.kube/config
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```sh
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    dkp delete bootstrap --kubeconfig $HOME/.kube/config
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
