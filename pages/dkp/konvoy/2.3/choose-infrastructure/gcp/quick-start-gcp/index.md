---
layout: layout.pug
navigationTitle: Quick Start GCP
title: Quick Start GCP
excerpt: Get started by installing a cluster with default configuration settings on GCP
beta: false
enterprise: false
menuWeight: 6
---

This Quick Start guide provides simplified instructions for using Konvoy to get your Kubernetes cluster up and running with minimal configuration requirements on GCP.

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary on this machine.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid GCP account with [credentials configured][gcp_credentials].

## Configure GCP prerequisites

1.  Log in to GCP:
    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    ```bash
    gcloud login
    ```

    ```sh
    [
      {
        "cloudName": "GCPCloud",
        
          "type": "user"
        }
      }
    ]
    ```

1.  Create an GCP Service Principal (SP) by running the following command:

    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    <p class="message--note"><strong>NOTE: </strong>If an SP with the name exists, this command will rotate the password.</p>

    ```bash
 <! NEED INSTRUCTIONS ON HOW TO CREATE A SP ON GCP>
    ```

    ```sh
    {
      "appId": "7654321a-1a23-567b-b789-0987b6543a21",
      "displayName": "gcp-cli-2021-03-09-23-17-06",
      "password": "Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C",
      "tenant": "a1234567-b132-1234-1a11-1234a5678b90"
    }
    ```

1.  Set the required environment variables:
    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    ```bash
<!NEED FINAL OUTPUT HERE>
    export GCP_TENANT_ID="<tenant>"           # a1234567-b132-1234-1a11-1234a5678b90
    export GCP_CLIENT_ID="<appId>"            # 7654321a-1a23-567b-b789-0987b6543a21
    export GCP_CLIENT_SECRET="<password>"     # Z79yVstq_E.R0R7RUUck718vEHSuyhAB0C
    ```

1.  Base64 encode the same environment variables:
    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    ```bash
<!NEED FINAL OUTPUT HERE>
    export GCP_CLIENT_ID_B64="$(echo -n "${GCP_CLIENT_ID}" | base64 | tr -d '\n')"
    export GCP_CLIENT_SECRET_B64="$(echo -n "${GCP_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

## Create a new GCP Kubernetes cluster

If you use these instructions to create a cluster on GCP using the DKP default settings without any edits to configuration files or additional flags, your cluster will be deployed on an [Ubuntu 20.04 operating system image][supported-systems] with 3 control plane nodes, and 4 worker nodes.

<p class="message--note"><strong>NOTE: </strong>
The default GCP image is not recommended for use in production. We suggest using <a href="../../../image-builder/create-GCP-image">Konvoy Image Builder to create a custom image</a> to take advantage of enhanced cluster operations, and to explore the <a href="../advanced">advanced GCP installation</a> topics for more options. Previously, DKP 2.1 used a CentOS 7 image, but DKP 2.2 and above now use Ubuntu 20.04.
</p>

1.  Give your cluster a name suitable for your environment:
    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    ```bash
    export CLUSTER_NAME=gcp-example
    ```

1.  Create a Kubernetes cluster:

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>
    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    ```bash
    dkp create cluster gcp \
    --cluster-name=${CLUSTER_NAME} \
    --additional-tags=owner=$(whoami) \
    --self-managed
    ```

    You will see output similar to the following:

    ```sh
    Generating cluster resources
    cluster.cluster.x-k8s.io/gcp-example created
    gcpcluster.infrastructure.cluster.x-k8s.io/gcp-example created
    kubeadmcontrolplane.controlplane.cluster.x-k8s.io/gcp-example-control-plane created
    gcpmachinetemplate.infrastructure.cluster.x-k8s.io/gcp-example-control-plane created
    secret/gcp-example-etcd-encryption-config created
    machinedeployment.cluster.x-k8s.io/gcp-example-md-0 created
    gcpmachinetemplate.infrastructure.cluster.x-k8s.io/gcp-example-md-0 created
    kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/gcp-example-md-0 created
    clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-gcp-example created
    configmap/calico-cni-installation-gcp-example created
    configmap/tigera-operator-gcp-example created
    clusterresourceset.addons.cluster.x-k8s.io/gcp-disk-csi-gcp-example created
    configmap/gcp-disk-csi-gcp-example created
    clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-gcp-example created
    configmap/cluster-autoscaler-gcp-example created
    clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-gcp-example created
    configmap/node-feature-discovery-gcp-example created
    clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-gcp-example created
    configmap/nvidia-feature-discovery-gcp-example created
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
    gcp-example-control-plane-84htt    Ready    control-plane,master   8m11s   v1.22.7
    gcp-example-control-plane-r8srg    Ready    control-plane,master   4m17s   v1.22.7
    gcp-example-control-plane-wrdql    Ready    control-plane,master   6m15s   v1.22.7
    gcp-example-md-0-9crp9             Ready    <none>                 6m47s   v1.22.7
    gcp-example-md-0-dvx5d             Ready    <none>                 6m42s   v1.22.7
    gcp-example-md-0-gc9mx             Ready    <none>                 5m27s   v1.22.7
    gcp-example-md-0-tkqf7             Ready    <none>                 4m48s   v1.22.7
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
    <!NEED CONFIRMATION OF STEPS PRE-RELEASE>

    ```bash
    dkp delete cluster \
    --cluster-name=${CLUSTER_NAME} \
    --kubeconfig=${CLUSTER_NAME}.conf \
    --self-managed
    ```

    ```sh
    ✓ Deleting Services with type LoadBalancer for Cluster default/gcp-example
    ✓ Deleting ClusterResourceSets for Cluster default/gcp-example
    ✓ Deleting cluster resources
    ✓ Waiting for cluster to be fully deleted
    Deleted default/gcp-example cluster
    ```

[gcp_cli]: https://github.com/kubernetes-sigs/cluster-api-provider-gcp
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[supported-systems]: ../../../supported-operating-systems
[gcp_credentials]:https://github.com/kubernetes-sigs/cluster-api-provider-gcp
