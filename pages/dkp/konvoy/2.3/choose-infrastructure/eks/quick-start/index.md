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
- Installation of [aws-iam-authenticator][aws_auth].

## Configure EKS prerequisites

1.  Follow the steps in [IAM Policy Configuration](../advanced/eks-cluster-iam-policies-and-roles).

1.  Export the AWS region where you want to deploy the EKS cluster:

    ```bash
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS Profile with the credentials that you want to use to create the EKS Kubernetes cluster:

    ```bash
    export AWS_PROFILE=<profile>
    ```

## Bootstrap a kind cluster and CAPI controllers

1.  Create a bootstrap cluster:

    ```bash
    dkp create bootstrap --with-aws-bootstrap-credentials=true --kubeconfig $HOME/.kube/config
    ```

    ```sh
    ✓ Creating a bootstrap cluster
    ✓ Initializing new CAPI components
    ```

## Name your cluster

Give your cluster a unique name suitable for your environment.
In EKS it is critical that the name is unique as no two clusters in the same EKS account can have the same name.

Set the environment variable to be used throughout this documentation:

```bash
export CLUSTER_NAME=eks-example
```

1.  (Optional) To get a list of names in use in your EKS account, use the `aws` CLI tool. For example:

    ```bash
    aws ec2 describe-vpcs --filter "Name=tag-key,Values=kubernetes.io/cluster" --query "Vpcs[*].Tags[?Key=='kubernetes.io/cluster'].Value | sort(@[*][0])"
    ```

    ```sh  
        "alex-eks-cluster-afe98",
        "sam-aws-cluster-8if9q"
    ```

1.  (Optional) If you want to create a cluster name that matches the example above, use this command.
    This creates a unique name every time you run it, so use the command with forethought.

    ```bash
    export CLUSTER_NAME=eks-example-$(LC_CTYPE=C tr -dc 'a-z0-9' </dev/urandom | fold -w 5 | head -n1)
    echo $CLUSTER_NAME
    ```

    ```sh
    eks-example-i05l6
    ```

## Create a new EKS Kubernetes cluster

1.  Make sure your AWS credentials are up to date. Refresh the credentials using this command:

    ```bash
    dkp update bootstrap credentials aws
    ```

1.  Create a Kubernetes cluster:

    ```bash
    dkp create cluster eks --cluster-name=${CLUSTER_NAME} --additional-tags=owner=$(whoami)
    ```

    ```sh
    Generating cluster resources
    cluster.cluster.x-k8s.io/eks-example created
    awsmanagedcontrolplane.controlplane.cluster.x-k8s.io/eks-example-control-plane created
    machinedeployment.cluster.x-k8s.io/eks-example-md-0 created
    awsmachinetemplate.infrastructure.cluster.x-k8s.io/eks-example-md-0 created
    eksconfigtemplate.bootstrap.cluster.x-k8s.io/eks-example-md-0 created
    clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-eks-example created
    configmap/calico-cni-installation-eks-example created
    configmap/tigera-operator-eks-example created
    clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-eks-example created
    configmap/cluster-autoscaler-eks-example created
    clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-eks-example created
    configmap/node-feature-discovery-eks-example created
    clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-eks-example created
    configmap/nvidia-feature-discovery-eks-example created
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
    cluster.cluster.x-k8s.io/eks-example condition met
    ```

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
    NAME                                         STATUS   ROLES    AGE   VERSION
    ip-10-0-122-211.us-west-2.compute.internal   Ready    <none>   32s   v1.21.5-eks-9017834
    ip-10-0-127-74.us-west-2.compute.internal    Ready    <none>   42s   v1.21.5-eks-9017834
    ip-10-0-71-155.us-west-2.compute.internal    Ready    <none>   46s   v1.21.5-eks-9017834
    ip-10-0-93-47.us-west-2.compute.internal     Ready    <none>   51s   v1.21.5-eks-9017834
    ```

    <p class="message--note"><strong>NOTE: </strong>It may take a couple of minutes for the Status to move to <code>Ready</code> while <code>calico-node</code> pods are being deployed.</p>

1.  List the Pods with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

    ```sh
    NAMESPACE                NAME                                             READY   STATUS     RESTARTS   AGE
    calico-system            calico-kube-controllers-69845d4df5-sc9vq         1/1     Running    0          44s
    calico-system            calico-node-5lppw                                1/1     Running    0          44s
    calico-system            calico-node-dwbfj                                1/1     Running    0          44s
    calico-system            calico-node-q6tg6                                1/1     Running    0          44s
    calico-system            calico-node-rbm7c                                1/1     Running    0          44s
    calico-system            calico-typha-68c68c96d-tcrxn                     1/1     Running    0          35s
    calico-system            calico-typha-68c68c96d-xhrjv                     1/1     Running    0          44s
    kube-system              aws-node-25bnt                                   1/1     Running    0          80s
    kube-system              aws-node-dr4b7                                   1/1     Running    0          89s
    kube-system              aws-node-mmn87                                   1/1     Running    0          70s
    kube-system              aws-node-z6cdb                                   1/1     Running    0          84s
    kube-system              cluster-autoscaler-68c759fbf6-zszxr              0/1     Init:0/1   0          9m50s
    kube-system              coredns-85d5b4454c-n54rq                         1/1     Running    0          12m
    kube-system              coredns-85d5b4454c-xzd9w                         1/1     Running    0          12m
    kube-system              kube-proxy-4bhzp                                 1/1     Running    0          84s
    kube-system              kube-proxy-5hkv9                                 1/1     Running    0          80s
    kube-system              kube-proxy-g82d7                                 1/1     Running    0          70s
    kube-system              kube-proxy-h2jv5                                 1/1     Running    0          89s
    node-feature-discovery   node-feature-discovery-master-84c67dcbb6-s6874   1/1     Running    0          9m50s
    node-feature-discovery   node-feature-discovery-worker-677hh              1/1     Running    0          69s
    node-feature-discovery   node-feature-discovery-worker-fvjwz              1/1     Running    0          49s
    node-feature-discovery   node-feature-discovery-worker-xcgvt              1/1     Running    0          64s
    node-feature-discovery   node-feature-discovery-worker-zctnz              1/1     Running    0          60s
    tigera-operator          tigera-operator-d499f5c8f-b56xn                  1/1     Running    1          9m47s
    ```

## Delete the Kubernetes cluster and cleanup your environment

1.  Delete the provisioned Kubernetes cluster and wait a few minutes:

    ```bash
    dkp delete cluster --cluster-name=${CLUSTER_NAME}
    ```

    ```sh
    ✓ Deleting Services with type LoadBalancer for Cluster default/eks-example
    ✓ Deleting ClusterResourceSets for Cluster default/eks-example
    ✓ Deleting cluster resources
    ✓ Waiting for cluster to be fully deleted
    Deleted default/eks-example cluster
    ```

1.  Delete the `kind` Kubernetes cluster:

    ```bash
    dkp delete bootstrap --kubeconfig $HOME/.kube/config
    ```

    ```sh
    ✓ Deleting bootstrap cluster
    ```

[advanced]: ../advanced/
[aws_auth]: https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
