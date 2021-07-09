---
layout: layout.pug
navigationTitle: Get Started with AWS
title: Get Started with AWS
excerpt: Get started by installing a cluster with the default configuration settings on AWS
beta: true
enterprise: false
menuWeight: 5
---

This guide provides instructions for getting started with Konvoy to get your Kubernetes cluster up and running with minimal configuration requirements on an Amazon Web Services (AWS) public cloud instances.

## Prerequisites

Before starting the Konvoy installation, verify that you have:

-   A Linux or MacOS machine with a supported version of the operating system.
-   The `konvoy` binary on this machine.
-   [Docker][install_docker] version 18.09.2 or later.
-   [kubectl][install_kubectl] for interacting with the running cluster.
-   Required for AWS clusters:
    - A valid AWS account with [credentials configured][aws_credentials].

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

## Bootstrap a kind cluster and CAPI controllers

1.  Create a bootstrap cluster:

    ```sh
    konvoy create bootstrap
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
    konvoy create cluster aws --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

1.  Inspect the created cluster resources:

    ```sh
    kubectl get clusters,kubeadmcontrolplanes,machinedeployments
    ```

1.  Wait for the cluster control-plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```sh
    konvoy get kubeconfig -c ${CLUSTER_NAME} > ${CLUSTER_NAME}.conf
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
    konvoy create bootstrap controllers --kubeconfig ${CLUSTER_NAME}.conf
    ```

1.  Issue the move command:

    ```sh
    konvoy move --to-kubeconfig ${CLUSTER_NAME}.conf
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
    konvoy delete bootstrap
    ```

## (Optional) Moving controllers back to the temporary bootstrap cluster

1.  Create a bootstrap cluster:

    ```sh
    konvoy create bootstrap
    ```

1.  Issue the move command:

    ```sh
    konvoy move --from-kubeconfig ${CLUSTER_NAME}.conf --to-kubeconfig <path to default kubeconfig file>
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```sh
    konvoy delete cluster --cluster-name=${CLUSTER_NAME}
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```sh
    konvoy delete bootstrap
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
