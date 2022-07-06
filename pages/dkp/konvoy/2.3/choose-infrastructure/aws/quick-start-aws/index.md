---
layout: layout.pug
navigationTitle: Get Started with AWS
title: Get Started with AWS
excerpt: Get started by installing a cluster with the default configuration settings on AWS
beta: false
enterprise: false
menuWeight: 10
---

This guide provides instructions for getting started with Konvoy to get your Kubernetes cluster up and running with basic configuration requirements on an Amazon Web Services (AWS) public cloud instances. If you want to customize your AWS environment, see [Install AWS Advanced][advanced].

## Prerequisites

Before starting the Konvoy installation, verify that you have:

- An x86_64-based Linux or macOS machine with a supported version of the operating system.
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid AWS account with [credentials configured][aws_credentials].

## Configure AWS prerequisites

1.  Follow the steps in [IAM Policy Configuration](../iam-policies).

1.  Export the AWS region where you want to deploy the cluster:

    ```bash
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS Profile with the credentials that you want to use to create the Kubernetes cluster:

    ```bash
    export AWS_PROFILE=<profile>
    ```

1.  Name your cluster

    Give your cluster a unique name suitable for your environment. In AWS, it is critical that the name be unique as no two clusters in the same AWS account can have the same name.

    Set the environment variable to be used throughout this documentation:

    ```bash
    export CLUSTER_NAME=aws-example
    ```

    <p class="message--note"><strong>NOTE: </strong>The cluster name may only contain the following characters: <code>a-z</code>, <code>0-9</code>, <code>.</code>, and <code>-</code>. Cluster creation will fail if the name has capital letters.
    See <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names/">Kubernetes</a> for more naming information.
    </p>

## Create a new AWS Kubernetes cluster

If you use these instructions to create a cluster on AWS using the DKP default settings without any edits to configuration files or additional flags, your cluster is deployed on an [Ubuntu 20.04 operating system image][supported-systems] with 3 control plane nodes, and 4 worker nodes.

<p class="message--note"><strong>NOTE: </strong>
The default AWS image is not recommended for use in production. We suggest using <a href="../../../image-builder/create-ami">Konvoy Image Builder to create a custom AMI</a> to take advantage of enhanced cluster operations, and to explore the <a href="../advanced">advanced AWS installation</a> topics for more options. Previously, DKP 2.1 used a CentOS 7 image, but DKP 2.2 and above now use Ubuntu 20.04.
</p>

1.  Create a Kubernetes cluster:

    <p class="message--note"><strong>NOTE: </strong>To increase <a href="https://docs.docker.com/docker-hub/download-rate-limit/">Docker Hub's rate limit</a> use your Docker Hub credentials when creating the cluster, by setting the following flag <code>--registry-mirror-url=https://registry-1.docker.io --registry-mirror-username= --registry-mirror-password=</code> on the <code>dkp create cluster command</code>.</p>

    ```bash
    dkp create cluster aws \
    --cluster-name=${CLUSTER_NAME} \
    --additional-tags=owner=$(whoami) \
    --with-aws-bootstrap-credentials=true \    
    --self-managed
    ```

    You will see output similar to the following:

    ```sh
     ✓ Creating a bootstrap cluster
	 ✓ Initializing new CAPI components
	Generating cluster resources
	cluster.cluster.x-k8s.io/aws-example created
	awscluster.infrastructure.cluster.x-k8s.io/aws-example created
	kubeadmcontrolplane.controlplane.cluster.x-k8s.io/aws-example-control-plane created
	awsmachinetemplate.infrastructure.cluster.x-k8s.io/aws-example-control-plane created
	secret/aws-example-etcd-encryption-config created
	machinedeployment.cluster.x-k8s.io/aws-example-md-0 created
	awsmachinetemplate.infrastructure.cluster.x-k8s.io/aws-example-md-0 created
	kubeadmconfigtemplate.bootstrap.cluster.x-k8s.io/aws-example-md-0 created
	clusterresourceset.addons.cluster.x-k8s.io/calico-cni-installation-aws-example created
	configmap/calico-cni-installation-aws-example created
	configmap/tigera-operator-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/aws-ebs-csi-aws-example created
	configmap/aws-ebs-csi-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/cluster-autoscaler-aws-example created
	configmap/cluster-autoscaler-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/node-feature-discovery-aws-example created
	configmap/node-feature-discovery-aws-example created
	clusterresourceset.addons.cluster.x-k8s.io/nvidia-feature-discovery-aws-example created
	configmap/nvidia-feature-discovery-aws-example created
	 ✓ Waiting for cluster infrastructure to be ready
	 ✓ Waiting for cluster control-planes to be ready
	 ✓ Waiting for machines to be ready
	 ✓ Initializing new CAPI components
	 ✓ Moving cluster resources
	You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=/home/gflorinskaya/repos/advanced-tests/konvoy2-test-v3/aws-example.conf get nodes
	 ✓ Deleting bootstrap cluster

	Cluster default/aws-example kubeconfig was written to to the filesystem.
	You can now view resources in the new cluster by using the --kubeconfig flag with kubectl.
	For example: kubectl --kubeconfig=aws-example.conf get nodes
    ```

    As part of the underlying processing, the DKP CLI:
    - creates a bootstrap cluster
    - creates a workload cluster
    - moves CAPI controllers from the bootstrap cluster to the workload cluster, making it self-managed
    - deletes the bootstrap cluster

    To understand how this process works step by step, you can follow the workflow in [Install AWS Advanced][advanced].

## Explore the new Kubernetes cluster

The kubeconfig file is written to your local directory and you can now explore the cluster.

1.  List the Nodes with the command:

    ```bash
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    You will see output similar to:

    ```sh
	NAME                                         STATUS   ROLES                  AGE   VERSION
	ip-10-0-108-63.us-west-2.compute.internal    Ready    <none>                 59m   v1.23.7
	ip-10-0-115-181.us-west-2.compute.internal   Ready    <none>                 59m   v1.23.7
	ip-10-0-118-159.us-west-2.compute.internal   Ready    <none>                 59m   v1.23.7
	ip-10-0-122-136.us-west-2.compute.internal   Ready    control-plane,master   60m   v1.23.7
	ip-10-0-122-6.us-west-2.compute.internal     Ready    <none>                 59m   v1.23.7
	ip-10-0-154-239.us-west-2.compute.internal   Ready    control-plane,master   59m   v1.23.7
	ip-10-0-199-233.us-west-2.compute.internal   Ready    control-plane,master   57m   v1.23.7
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

If you no longer need the cluster and want to delete it, you can do so using the DKP CLI.

1.  Update the AWS bootstrap credentials:

    ```bash
    dkp update bootstrap credentials aws --kubeconfig=${CLUSTER_NAME}.conf
    ```

1.  Delete the provisioned Kubernetes cluster:

    ```bash
    dkp delete cluster \
    --cluster-name=${CLUSTER_NAME} \
    --kubeconfig=${CLUSTER_NAME}.conf \
    --self-managed
    ```

    You will see output similar to:

    ```sh
	 ✓ Creating a bootstrap cluster
	 ✓ Initializing new CAPI components
	 ✓ Moving cluster resources
	You can now view resources in the moved cluster by using the --kubeconfig flag with kubectl. For example: kubectl --kubeconfig=aws-example-bootstrap.conf get nodes
	 ✓ Waiting for cluster infrastructure to be ready
	 ✓ Waiting for cluster control-planes to be ready
	 ✓ Waiting for machines to be ready
	 ✓ Deleting Services with type LoadBalancer for Cluster default/aws-example
	 ✓ Deleting ClusterResourceSets for Cluster default/aws-example
	  ✓ Deleting cluster resources
	 ✓ Waiting for cluster to be fully deleted
	Deleted default/aws-example cluster
	 ✓ Deleting bootstrap cluster
    ```

Similar to `create cluster`, use the flag `--self-managed` with the `delete cluster`command:

- creates a bootstrap cluster
- moves the CAPI controllers from the workload cluster back to the bootstrap cluster
- deletes the workload cluster
- deletes the bootstrap cluster

To understand how this process works step by step, you can follow the workflow in [Delete Cluster][advanced_delete].

[advanced]: ../advanced/
[advanced_delete]: ../advanced/delete/
[aws_advanced]: ../advanced
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.htm
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[kib_create_ami]: ../../../image-builder/create-ami
[supported-systems]: ../../../supported-operating-systems
