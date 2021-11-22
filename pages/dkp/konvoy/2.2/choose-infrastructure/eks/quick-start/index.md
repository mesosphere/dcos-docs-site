---
layout: layout.pug
navigationTitle: Get Started with EKS
title: Get Started with EKS
excerpt: Get started by installing a cluster with the default configuration settings on EKS.
beta: false
enterprise: false
menuWeight: 10
---

<!--- markdownlist-disable MD046 --->

This guide provides instructions for getting started with Konvoy to get your Kubernetes cluster up and running with basic configuration requirements on an Elastic Kubernetes Service (EKS) public cloud instance.
If you want to customize your EKS environment, see [Install EKS Advanced][advanced].

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid EKS account with [credentials configured][aws_credentials].

## Configure EKS prerequisites

1.  Follow the steps in [IAM Policy Configuration](../../aws/iam-policies).

1.  Export the AWS region where you want to deploy the EKS cluster:

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS Profile with the credentials that you want to use to create the EKS Kubernetes cluster:

    ```sh
    export AWS_PROFILE=<profile>
    ```

## Bootstrap a kind cluster and CAPI controllers

1.  Create a bootstrap cluster:

    ```sh
    dkp create bootstrap --kubeconfig $HOME/.kube/config
    ```

## Name your cluster

Give your cluster a unique name suitable for your environment.
In EKS it is critical that the name is unique as no two clusters in the same EKS account can have the same name.

Set the environment variable to be used throughout this documentation:

```sh
CLUSTER_NAME=my-eks-cluster
```

Tips:

1.  To get a list of names in use in your EKS account, use the `aws` cli tool. For example:

    ```sh
    aws ec2 describe-vpcs --filter "Name=tag-key,Values=kubernetes.io/cluster" --query "Vpcs[*].Tags[?Key=='kubernetes.io/cluster'].Value | sort(@[*][0])"
    ```

    ```json
    [
        "alex-aws-cluster-afe98",
        "sam-aws-cluster-8if9q"
    ]
    ```

1.  If you want to create a cluster name that matches the example above, use this command.
    This creates a unique name every time you run it, so use the command with forethought.

    ```sh
    CLUSTER_NAME=$(whoami)-aws-cluster-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
    echo $CLUSTER_NAME
    ```

    ```text
    hunter-aws-cluster-pf4a3
    ```

## Create a new EKS Kubernetes cluster

1.  Make sure your AWS credentials are up to date. Refresh the credentials using this command:

    ```sh
    dkp update bootstrap credentials aws
    ```

1.  Create a Kubernetes cluster:

    ```sh
    dkp create cluster eks --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

1.  (Optional) Specify an authorized key file to have SSH access to the machines.

    The file must contain exactly one entry, as described in this [manual](https://man7.org/linux/man-pages/man8/sshd.8.html#AUTHORIZED_KEYS_FILE_FORMAT).

    You can use the `.pub` file that complements your private ssh key. For example, use the public key that complements your RSA private key:

    ```sh
    --ssh-public-key-file=${HOME}/.ssh/id_rsa.pub
    ```

    The default username for SSH access is `konvoy`. For example, use your own username:

    ```sh
    --ssh-username=$(whoami)
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

    <p class="message--note"><strong>NOTE: </strong>This kubeconfig is temporary and needs to be renewed either by running the above command with updated credentials and rerunning, or by running the aws cli command:</p>

    ```yaml
    aws eks --region us-west-2 update-kubeconfig --name default_<name-of-cluster>-control-plane
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
    - You must ensure that the permissions are sufficient and available to the CAPI controllers running on the worker cluster.

1.  Remove the bootstrap cluster, as the worker cluster is now self-managed:

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
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[advanced]: ../advanced/
