---
layout: layout.pug
navigationTitle: Quick Start Azure
title: Quick Start Azure
excerpt: Get started by installing a cluster with default configuration settings on Azure
beta: false
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

## Configure Azure prerequisites

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
    export AZURE_SUBSCRIPTION_ID="<id>"  		# b1234567-abcd-11a1-a0a0-1234a5678b90
    export AZURE_TENANT_ID="<tenant>" 			# a1234567-b132-1234-1a11-1234a5678b90
    export AZURE_CLIENT_ID="<appId>"  			# 7654321a-1a23-567b-b789-0987b6543a21
    export AZURE_CLIENT_SECRET="<password>" 	# Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C
    ```

1.  Base64 encode the same environment variables:

    ```bash
    export AZURE_SUBSCRIPTION_ID_B64="$(echo -n "${AZURE_SUBSCRIPTION_ID}" | base64 | tr -d '\n')"
    export AZURE_TENANT_ID_B64="$(echo -n "${AZURE_TENANT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_ID_B64="$(echo -n "${AZURE_CLIENT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_SECRET_B64="$(echo -n "${AZURE_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

## Create a new Azure Kubernetes cluster

If you use these instructions to create a cluster on Azure using the DKP default settings without any edits to configuration files or additional flags, your cluster will be deployed on an [Ubuntu 20.04 operating system image][supported-systems] with 3 control plane nodes, and 4 worker nodes.

<p class="message--note"><strong>NOTE: </strong>
The default Azure image is not recommended for use in production. We suggest using <a href="../../../image-builder/create-azure-image">Konvoy Image Builder to create a custom image</a> to take advantage of enhanced cluster operations, and to explore the <a href="../advanced">advanced Azure installation</a> topics for more options. Previously, DKP 2.1 used a CentOS 7 image, but DKP 2.2 now uses Ubuntu 20.04.
</p>

1.  Give your cluster a name suitable for your environment:

    ```bash
    export CLUSTER_NAME=azure-example
    ```

1.  Create a Kubernetes cluster:

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster azure \
    --cluster-name=${CLUSTER_NAME} \
    --additional-tags=owner=$(whoami) \
    --self-managed
    ```

    You will see output similar to the following:

    ```sh
    Generating cluster resources
	cluster.cluster.x-k8s.io/azure-example created
	azurecluster.infrastructure.cluster.x-k8s.io/azure-example created
	kubeadmcontrolplane.controlplane.cluster.x-k8s.io/azure-example-control-plane created
	azuremachinetemplate.infrastructure.cluster.x-k8s.io/azure-example-control-plane created
	secret/azure-example-etcd-encryption-config created
	machinedeployment.cluster.x-k8s.io/azure-example-md-0 created
	azuremachinetemplate.infrastructure.cluster.x-k8s.io/azure-example-md-0 created
	kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/azure-example-md-0 created
	clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-azure-example created
	configmap/calico-cni-installation-azure-example created
	configmap/tigera-operator-azure-example created
	clusterresourceset.addons.cluster.x-k8s.io/azure-disk-csi-azure-example created
	configmap/azure-disk-csi-azure-example created
	clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-azure-example created
	configmap/cluster-autoscaler-azure-example created
	clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-azure-example created
	configmap/node-feature-discovery-azure-example created
	clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-azure-example created
	configmap/nvidia-feature-discovery-azure-example created
    ```

    As part of the underlying processing, the DKP CLI:
    - creates a bootstrap cluster
    - creates a workload cluster
    - moves CAPI controllers from the bootstrap cluster to the workload cluster, making it self-managed
    - deletes the bootstrap cluster

## Explore the new Kubernetes cluster

The kubeconfig file is written to your local directory and you can now explore the cluster.

1.  List the Nodes with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    You will see output similar to:

    ```sh
    NAME                                 STATUS   ROLES                  AGE     VERSION
	azure-example-control-plane-84htt    Ready    control-plane,master   8m11s   v1.22.7
	azure-example-control-plane-r8srg    Ready    control-plane,master   4m17s   v1.22.7
	azure-example-control-plane-wrdql    Ready    control-plane,master   6m15s   v1.22.7
	azure-example-md-0-9crp9             Ready    <none>                 6m47s   v1.22.7
	azure-example-md-0-dvx5d             Ready    <none>                 6m42s   v1.22.7
	azure-example-md-0-gc9mx             Ready    <none>                 5m27s   v1.22.7
	azure-example-md-0-tkqf7             Ready    <none>                 4m48s   v1.22.7
    ```

1.  List the Pods with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

    You will see output similar to:

    ```sh
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

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```bash
    dkp delete cluster \
    --cluster-name=${CLUSTER_NAME} \
    --kubeconfig=${CLUSTER_NAME}.conf \
    --self-managed
    ```
	```sh
	✓ Deleting Services with type LoadBalancer for Cluster default/azure-example
	✓ Deleting ClusterResourceSets for Cluster default/azure-example
	✓ Deleting cluster resources
	✓ Waiting for cluster to be fully deleted
	Deleted default/azure-example cluster
	```
	

[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[supported-systems]: ../../../supported-operating-systems
