---
layout: layout.pug
navigationTitle: Quick Start
title: Quick Start
excerpt: Get started by installing a cluster with default configuration settings
beta: true
enterprise: false
menuWeight: 10
---

This Quick Start guide provides simplified instructions to get your Kubernetes cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) or Azure public cloud instances using Konvoy.

## Prerequisites

Before starting the Konvoy installation, you should verify the following:

-  You have a Linux or MacOS machine with a supported version of the operating system.
-  You have the `konvoy2` binary on this machine.
-  You have [Docker][install_docker] version 18.09.2 or later.
-  You have [clusterawsadm][install_clusterawsadm] to generate base64 encoded AWS credentials.
-  You have [kubectl][install_kubectl] for interacting with the running cluster.
-  Required for AWS clusters:
    - You have a valid AWS account with [credentials configured][aws_credentials].
-  Required for Azure clusters:
    - You have a valid Azure account with [credentials configured][azure_credentials].

## Configure AWS prerequisites (required only if creating an AWS cluster)

1.  Follow the steps in [IAM Policy Configuration](../iam-policies).

1.  Export the AWS region where to deploy the cluster:

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS Profile with the credentials that will be used to create the Kubernetes cluster:

    ```sh
    export AWS_PROFILE=<profile>
    ```

1.  Set the required environment variables:

    ```sh
    export AWS_B64ENCODED_CREDENTIALS=$(clusterawsadm bootstrap credentials encode-as-profile)
    ```

1.  If at any time you need to refresh the credentials used by the AWS provider, run the following:

    ```sh
    export AWS_B64ENCODED_CREDENTIALS=$(clusterawsadm bootstrap credentials encode-as-profile)
    kubectl -n capa-system patch secret capa-manager-bootstrap-credentials -p "{\"data\": {\"credentials\": \"${AWS_B64ENCODED_CREDENTIALS}\"}}"
    kubectl -n capa-system rollout restart deployment capa-controller-manager
    ```

## Configure Azure prerequisites (required only when creating an Azure cluster)

1.  Login to Azure:

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

1.  Create an Azure Service Principal (SP) by running the following command.
    If an SP with the name exists, this command will rotate the password.

    ```sh
    $ az ad sp create-for-rbac --role contributor --name "$(whoami)-konvoy2"
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

1.  Base64 the same environment variables:

    ```sh
    export AZURE_SUBSCRIPTION_ID_B64="$(echo -n "${AZURE_SUBSCRIPTION_ID}" | base64 | tr -d '\n')"
    export AZURE_TENANT_ID_B64="$(echo -n "${AZURE_TENANT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_ID_B64="$(echo -n "${AZURE_CLIENT_ID}" | base64 | tr -d '\n')"
    export AZURE_CLIENT_SECRET_B64="$(echo -n "${AZURE_CLIENT_SECRET}" | base64 | tr -d '\n')"
    ```

## Bootstrap a kind cluster and CAPI controllers

1.  Create a bootstrap cluster:

    ```sh
    konvoy2 create bootstrap
    ```

## Create a new AWS Kubernetes cluster

1.  Name your cluster anything you like:

    ```sh
    export CLUSTER_NAME=$(whoami)-aws-cluster
    ```

1.  To have SSH access to the machines, specify an authorized key file.

    The file must contain exactly one entry, as described in this [manual](https://man7.org/linux/man-pages/man8/sshd.8.html#AUTHORIZED_KEYS_FILE_FORMAT).

    You can use the `.pub` file that complements your private ssh key. For example, use the public key that complements your RSA private key:

    ```sh
    --ssh-public-key-file=${HOME}/.ssh/id_rsa.pub
    ```

    The default username for SSH access is `konvoy`. For example, use your own username:

    ```sh
    --ssh-username=$(whoami)
    ```

1.  Create a Kubernetes cluster:

    ```sh
    konvoy2 create cluster aws --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

1.  Inspect the cluster resources that are created:

    ```sh
    kubectl get clusters,awsclusters,machinepools,awsmachinepools
    ```

1.  Wait for the cluster control plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

## Create a new Azure Kubernetes cluster

1.  Name your cluster anything you like:

    ```sh
    export CLUSTER_NAME=$(whoami)-azure-cluster

1.  Create a Kubernetes cluster:

    ```sh
    konvoy2 create cluster azure --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

1.  Inspect the cluster resources that are created:

    ```sh
    kubectl get clusters,azureclusters,machinepools,azuremachinepools
    ```

1.  Wait for the cluster control plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```sh
    konvoy2 get kubeconfig > ${CLUSTER_NAME}.conf
    ```

1.  List Nodes (it may take a couple of minutes for the Status to be `Ready` while `calico-node` pods are being deployed):

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

1.  List Pods:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

### Configure the AWS EBS CSI driver

1.  Create a `StorageClass` for EBS CSI driver:

    ```sh
    cat <<EOF | kubectl --kubeconfig=${CLUSTER_NAME}.conf apply -f -
    kind: StorageClass
    apiVersion: storage.k8s.io/v1
    metadata:
      name: ebs-sc
    provisioner: ebs.csi.aws.com
    volumeBindingMode: WaitForFirstConsumer
    parameters:
      csi.storage.k8s.io/fstype: ext4
      type: gp3
    EOF
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```sh
    konvoy2 delete cluster --cluster-name=${CLUSTER_NAME}
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    konvoy2 delete bootstrap
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_clusterawsadm]: https://github.com/kubernetes-sigs/cluster-api-provider-aws/releases
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
