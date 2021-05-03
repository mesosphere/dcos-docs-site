---
layout: layout.pug
navigationTitle: Air-gapped Install
title: Air-gapped Install
excerpt: Create a Kubernetes cluster in a private subnet with no access to the Internet
beta: true
enterprise: false
menuWeight: 20
---

This guide provides the instructions to create a Kubernetes cluster in an existing VPC with the nodes and the kube-apiserver ELB in a private subnet with no access to the Internet.

## Prerequisites

Before starting the Konvoy installation, you should verify the following:

- You have a Linux machine (bastion) that has access to the existing VPC.
- You have the `konvoy2` binary on the bastion.
- You have [Docker][install_docker] version 18.09.2 or later installed on the bastion.
- You have [clusterawsadm][install_clusterawsadm] to generate base64 encoded AWS credentials on the bastion.
- You have [kubectl][install_kubectl] for interacting with the running cluster on the bastion.
- You have a valid AWS account with [credentials configured][aws_credentials].

## Configure AWS prerequisites

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

## Bootstrap a kind cluster and CAPI controllers

1.  Load the bootstrap docker image, the image version should correspond to the version of Konvoy as returned by `konvoy2 version`:

    ```sh
    docker load -i <path to mesosphere/konvoy2-bootstrap image>
    ```

1.  Create a bootstrap cluster:

    ```sh
    konvoy2 create bootstrap
    ```

## Create a new AWS Kubernetes cluster in the existing infrastructure

1.  Name your cluster anything you like:

    ```sh
    export CLUSTER_NAME=$(whoami)-aws-air-gapped-cluster
    ```

1.  Export variables for the existing infrastructure details:

    ```sh
    export AWS_VPC_ID=<vpc-...>
    export AWS_SUBNET_IDS=<subnet-...,subnet-...,subnet-...>
    export AWS_ADDITIONAL_SECURITY_GROUPS=<sg-...>
    export AWS_AMI_ID=<ami-...>
    ```

    - `AWS_VPC_ID`: the VPC ID where the cluster will be created.
    - `AWS_SUBNET_IDS`: a comma seperated list of one or more private Subnet IDs with each one in a different Availability Zone, the cluster control-plane and worker nodes will automatically be spread across these Subnets.
    - `AWS_ADDITIONAL_SECURITY_GROUPS`: a comma seperated list of one or more Security Groups IDs to use in addition to the ones automatically created by [CAPA][capa].
    - `AWS_AMI_ID`: the AMI ID to use for control-plane and worker nodes.

    <p class="message--important"><strong>IMPORTANT: </strong>The VPC requires the <code>ec2</code>, <code>elasticloadbalancing</code>, <code>secretsmanager</code>, and <code>autoscaling</code> VPC endpoints to be already present.</p>

    <p class="message--important"><strong>IMPORTANT: </strong>You must tag the subnets as described below to allow for Kubernetes to create ELBs for services of type <code>LoadBalancer</code> in those subnets. Not tagging can cause the subnets to not receive an ELB and display an <code>Error syncing load balancer, failed to ensure load balancer; could not find any suitable subnets for creating the  ELB.</code> message.</p>

    The tags should be as following, where `<CLUSTER_NAME>` corresponds the name set in `CLUSTER_NAME` environment variable:

    ```text
    kubernetes.io/cluster = <CLUSTER_NAME>
    kubernetes.io/cluster/CLUSTER_NAME = owned
    kubernetes.io/role/internal-elb = 1
    ```

1.  Configure you cluster to use an existing docker registry as a mirror when attempting to pull images:

    ```sh
    export DOCKER_REGISTRY_ADDRESS=<https/http>://<registry-address>:<registry-port>
    export DOCKER_REGISTRY_CA=<path to the CA on the bastion>
    ```

    - `DOCKER_REGISTRY_ADDRESS`: the address of an existing docker registry accessible in the VPC that the new cluster nodes will be configured to use a mirror registry when pulling images.
    - `DOCKER_REGISTRY_CA`: (optional) the path on the bastion machine to the docker registry CA. Konvoy will configure the cluster nodes to trust this CA. Only needed if the registry is using a self-signed certificate and the AMIs are not already configured to trust this CA.

1.  Create a Kubernetes cluster:

    ```sh
    konvoy2 create cluster aws --cluster-name=${CLUSTER_NAME} \
    --vpc-id=${AWS_VPC_ID} \
    --ami=${AWS_AMI_ID} \
    --subnet-ids=${AWS_SUBNET_IDS} \
    --internal-load-balancer=true \
    --additional-security-group-ids=${AWS_ADDITIONAL_SECURITY_GROUPS} \
    --registry-mirror-url=${DOCKER_REGISTRY_ADDRESS} \
    --registry-mirror-cacert=${DOCKER_REGISTRY_CA}
    ```

1.  Inspect the cluster resources that are created:

    ```sh
    kubectl get clusters,awsclusters,machinepools,awsmachinepools
    ```

1.  Wait for the cluster control plane to be ready:

    ```sh
    kubectl wait --for=condition=ControlPlaneReady "clusters/${CLUSTER_NAME}" --timeout=60m
    ```

Note: these AMIs are created by the [konvoy-image-builder](https://github.com/mesosphere/konvoy-image-builder) project. They will have container images "baked into" them the list of container images can be found in this [ansible task](https://github.com/mesosphere/konvoy-image-builder/blob/main/ansible/roles/images/defaults/main.yaml)

## Explore the new Kubernetes cluster

1.  Fetch the kubeconfig file:

    ```sh
    kubectl get secret ${CLUSTER_NAME}-kubeconfig -o jsonpath='{.data.value}' | base64 --decode > ${CLUSTER_NAME}.conf
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
[capa]: https://github.com/kubernetes-sigs/cluster-api-provider-aws
