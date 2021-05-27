---
layout: layout.pug
navigationTitle: Quick Start
title: Quick Start
excerpt: Get started by installing a cluster with default configuration settings
beta: true
enterprise: false
menuWeight: 5
---

This Quick Start guide provides simplified instructions for using Konvoy to get your Kubernetes cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) or Azure public cloud instances.

## Prerequisites

Before starting the Konvoy installation, verify that you have:

-   A Linux or MacOS machine with a supported version of the operating system.
-   The `konvoy2` binary on this machine.
-   [Docker][install_docker] version 18.09.2 or later.
-   [kubectl][install_kubectl] for interacting with the running cluster.
-   Required for AWS clusters:
    - A valid AWS account with [credentials configured][aws_credentials].
-   Required for Azure clusters:
    - A valid Azure account with [credentials configured][azure_credentials].

## Configure AWS prerequisites (required only if creating an AWS cluster)

1.  Follow the steps in [IAM Policy Configuration](../iam-policies).

1.  Export the AWS region where you want to deploy the cluster:

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS Profile with the credentials that you want to use to create the Kubernetes cluster:

    ```sh
    export AWS_PROFILE=<profile>
    ```

1.  Refresh the credentials used by the AWS provider at any time, by running the command:

    ```sh
    konvoy2 update bootstrap credentials aws
    ```

    <p class="message--note"><strong>NOTE: </strong>This command will restart the CAPA controllers automatically.</p>

    `konvoy2 update bootstrap credentials aws` encodes an AWS profile and stores it in the `capa-manager-bootstrap-credentials` secret in the `capa-system` namespace. It is equivalent to the following:

    ```sh
    export AWS_B64ENCODED_CREDENTIALS=$(base64 << EOF
    [default]
    aws_access_key_id = $AWS_ACCESS_KEY_ID
    aws_secret_access_key = $AWS_SECRET_ACCESS_KEY
    region = $AWS_REGION
    aws_session_token = $AWS_SESSION_TOKEN
    EOF
    )

    kubectl -n capa-system patch secret capa-manager-bootstrap-credentials -p "{\"data\": {\"credentials\": \"${AWS_B64ENCODED_CREDENTIALS}\"}}"
    kubectl -n capa-system rollout restart deployment capa-controller-manager
    ```

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
    konvoy2 create bootstrap
    ```

## Create a new AWS Kubernetes cluster

1.  Give your cluster a name suitable for your environment:

    ```sh
    export CLUSTER_NAME=$(whoami)-aws-cluster
    ```

1.  Specify an authorized key file to have SSH access to the machines.

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

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

## Create a new Azure Kubernetes cluster

1.  Give your cluster a name suitable for your environment:

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

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```sh
    konvoy2 get kubeconfig > ${CLUSTER_NAME}.conf
    ```

1.  List the Nodes with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a couple of minutes for the Status to move to `Ready` while `calico-node` pods are being deployed.</p>

1.  List the Pods with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

### Configure the AWS EBS CSI driver

1.  Create a `StorageClass` for the EBS CSI driver:

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

## (Optional) Move controllers to the newly-created cluster

1.  Deploy CAPI controllers on the worker cluster:

    ```sh
    konvoy2 create bootstrap controllers --kubeconfig ${CLUSTER_NAME}.conf
    ```

1.  Issue the move command:

    ```sh
    konvoy2 move --to-kubeconfig ${CLUSTER_NAME}.conf
    ```

    <p class="message--note"><strong>NOTE: </strong>Remember to specify flag `--kubeconfig` flag pointing to file `${CLUSTER_NAME}.conf` or make sure that the access credentials from this file become the default credentials after the move operation is complete.</p>

    Note that the Konvoy `move` operation has the following limitations:
    - Only one workload cluster is supported. This also implies that Konvoy does not support moving more than one bootstrap cluster onto the same worker cluster
    - The Konvoy version used for creating the worker cluster must match the Konvoy version used for deleting the worker cluster.
    - The Konvoy version used for deploying a bootstrap cluster must match the Konvoy version used for deploying a worker cluster.
    - Konvoy only supports moving all namespaces in the cluster; Konvoy does not support migration of individual namespaces.
    - You must ensure that the permissions available to the CAPI controllers running on the worker cluster are sufficient.

1.  Remove the bootstrap cluster, as the worker cluster is now self-managing:

    ```sh
    konvoy2 delete bootstrap
    ```

## (Optional) Moving controllers back to the temporary bootstrap cluster

1.  Create a bootstrap cluster:

    ```sh
    konvoy2 create bootstrap
    ```

1.  Issue the move command:

    ```sh
    konvoy2 move --from-kubeconfig ${CLUSTER_NAME}.conf --to-kubeconfig <path to default kubeconfig file>
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
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[azure_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-azure/blob/master/docs/book/src/topics/getting-started.md#prerequisites
