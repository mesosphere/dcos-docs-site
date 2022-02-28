---
layout: layout.pug
navigationTitle: Quick Start Azure
title: Quick Start Azure
excerpt: Get started by installing a cluster with default configuration settings on Azure
beta: false
enterprise: false
menuWeight: 6
---

This Quick Start guide provides simplified instructions for using Konvoy to get your Kubernetes cluster up and running with minimal configuration requirements on an Azure public cloud instance.

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary on this machine.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid Azure account with [credentials configured][azure_credentials].

## Configure Azure prerequisites

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

1.  Base64 encode those same environment variables:

    ```sh
    export AZURE_SUBSCRIPTION_ID_B64="$(echo -n "${AZURE_SUBSCRIPTION_ID}" | base64 | tr -d '\n')"
    export AZURE_TENANT_ID_B64="$(echo -n "${AZURE_TENANT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_ID_B64="$(echo -n "${AZURE_CLIENT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_SECRET_B64="$(echo -n "${AZURE_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

## Create a new Azure Kubernetes cluster

If you create a cluster on Azure using DKP's default settings without any edits to any configuration files or additional flags, your cluster will be deployed on an [Ubuntu 20.04 operating system image][supported-systems] with 3 control plane nodes and 4 worker nodes.

1.  Give your cluster a name suitable for your environment:

    ```sh
    CLUSTER_NAME=my-azure-cluster

1.  Create a Kubernetes cluster, with the command:

    ```sh
    dkp create cluster azure \
    --cluster-name=${CLUSTER_NAME} \
    --additional-tags=owner=$(whoami) \
    --self-managed
    ```

    The output appears similar to:

    ```text
    INFO[2021-11-16T12:27:38-06:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:148"
    INFO[2021-11-16T12:28:53-06:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:94"
    INFO[2021-11-16T12:30:22-06:00] Created bootstrap controllers                 src="bootstrap/controllers.go:106"
    INFO[2021-11-16T12:30:22-06:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:110"
    ...
    Cluster default/my-azure-cluster kubeconfig was written to /private/tmp/konvoyrc2/my-azure-cluster.conf,
    You can now view resources in the new cluster by using the --kubeconfig flag with kubectl.
    For example: kubectl --kubeconfig=my-azure-cluster.conf get nodes  src="cluster/create.go:338"
    ```

    As part of the underlying processing, the DKP CLI:
    - Creates a bootstrap cluster
    - Creates a workload cluster
    - Moves CAPI controllers from the bootstrap cluster to the workload cluster, making it self-managed
    - Deletes the bootstrap cluster

## Explore the new Kubernetes cluster

The kubeconfig file is written to your local directory and you can now explore the cluster.

1.  List the cluster's Nodes with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    The output appears similar to:

    ```sh
    NAME                                   STATUS   ROLES                  AGE     VERSION
    my-azure-cluster-control-plane-t6pzx   Ready    control-plane,master   8m17s   v1.21.6
    my-azure-cluster-control-plane-trjhl   Ready    control-plane,master   5m12s   v1.21.6
    my-azure-cluster-control-plane-xkt47   Ready    control-plane,master   9m44s   v1.21.6
    my-azure-cluster-md-0-hvg4b            Ready    <none>                 6m17s   v1.21.6
    my-azure-cluster-md-0-k72hx            Ready    <none>                 6m20s   v1.21.6
    my-azure-cluster-md-0-tj4p8            Ready    <none>                 8m10s   v1.21.6
    my-azure-cluster-md-0-xwjw6            Ready    <none>                 6m37s   v1.21.6
    ```

1.  List the Pods with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

    The output appears similar to:

    ```text
    NAMESPACE                           NAME                                                                 READY   STATUS    RESTARTS   AGE
    calico-system                       calico-typha-665d976df-rf7jg                                         1/1     Running   0          60m
    capa-system                         capa-controller-manager-697b7df888-vhcbj                             2/2     Running   0          57m
    capi-kubeadm-bootstrap-system       capi-kubeadm-bootstrap-controller-manager-67d8fc9688-5p65s           1/1     Running   0          57m
    capi-kubeadm-control-plane-system   capi-kubeadm-control-plane-controller-manager-846ff8b565-jqmhd       1/1     Running   0          57m
    capi-system                         capi-controller-manager-865fddc84c-9g7bb                             1/1     Running   0          57m
    cappp-system                        cappp-controller-manager-7859fbbb7f-xjh6k                            1/1     Running   0          56m
    ...
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes for the processing to complete:

    ```sh
    dkp delete cluster \
    --cluster-name=${CLUSTER_NAME} \
    --kubeconfig=${CLUSTER_NAME}.conf \
    --self-managed
    ```

[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[supported-systems]: ../../../supported-operating-systems
