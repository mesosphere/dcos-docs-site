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

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS Profile with the credentials that you want to use to create the Kubernetes cluster:

    ```sh
    export AWS_PROFILE=<profile>
    ```

1.  Name your cluster

    Give your cluster a unique name suitable for your environment. In AWS, it is critical that the name be unique as no two clusters in the same AWS account can have the same name.

    Set the environment variable to be used throughout this documentation:

    ```sh
    export CLUSTER_NAME=my-aws-cluster
    ```

## Create a new AWS Kubernetes cluster

1.  Create a Kubernetes cluster:

    ```sh
    dkp create cluster aws \
    --cluster-name=${CLUSTER_NAME} \
    --additional-tags=owner=$(whoami) \
    --self-managed
    ```

    You will see output similar to the following:

    ```text
    INFO[2021-11-16T12:27:38-06:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:148"
    INFO[2021-11-16T12:28:53-06:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:94"
    INFO[2021-11-16T12:30:22-06:00] Created bootstrap controllers                 src="bootstrap/controllers.go:106"
    INFO[2021-11-16T12:30:22-06:00] Bootstrap controllers are ready               src="bootstrap/controllers.go:110"
    ...
    Cluster default/my-aws-cluster kubeconfig was written to /private/tmp/konvoyrc2/my-aws-cluster.conf,
    You can now view resources in the new cluster by using the --kubeconfig flag with kubectl.
    For example: kubectl --kubeconfig=my-aws-cluster.conf get nodes  src="cluster/create.go:338"
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

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get nodes
    ```

    You will see output similar to:

    ```sh
    NAME                                         STATUS   ROLES                  AGE   VERSION
    ip-10-0-101-21.us-west-2.compute.internal    Ready    <none>                 56m   v1.21.6
    ip-10-0-110-11.us-west-2.compute.internal    Ready    <none>                 56m   v1.21.6
    ip-10-0-115-125.us-west-2.compute.internal   Ready    <none>                 55m   v1.21.6
    ip-10-0-122-90.us-west-2.compute.internal    Ready    control-plane,master   56m   v1.21.6
    ip-10-0-140-174.us-west-2.compute.internal   Ready    control-plane,master   58m   v1.21.6
    ip-10-0-226-136.us-west-2.compute.internal   Ready    control-plane,master   54m   v1.21.6
    ip-10-0-96-127.us-west-2.compute.internal    Ready    <none>                 56m   v1.21.6
    ```

1.  List the Pods with the command:

    ```sh
    kubectl --kubeconfig=${CLUSTER_NAME}.conf get pods -A
    ```

    You will see output similar to:

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

If you no longer need the cluster and want to delete it, you can can do so using the DKP CLI.

1.  Update the AWS bootstrap credentials:

    ```sh
    dkp update bootstrap credentials aws --kubeconfig=${CLUSTER_NAME}.conf
    ```

1.  Delete the provisioned Kubernetes cluster:

    ```sh
    dkp delete cluster \
    --cluster-name=${CLUSTER_NAME} \
    --kubeconfig=${CLUSTER_NAME}.conf \
    --self-managed
    ```

    You will see output similar to:

    ```text
    INFO[2021-11-17T10:22:57-06:00] Creating bootstrap cluster                    src="bootstrap/bootstrap.go:148"
    INFO[2021-11-17T10:22:59-06:00] Initializing bootstrap controllers            src="bootstrap/controllers.go:94"
    ...
    INFO[2021-11-17T10:25:01-06:00] Running cluster delete command                ClusterName=my-aws-cluster Namespace=default managementClusterKubeconfig=my-aws-cluster-bootstrap.conf src="cluster/delete.go:215"
    INFO[2021-11-17T10:25:02-06:00] Deleting Services with type LoadBalancer for Cluster default/my-aws-cluster  src="cluster/cluster.go:34"
    INFO[2021-11-17T10:25:02-06:00] Waiting for cluster to be fully deleted       src="cluster/delete.go:253"
    INFO[2021-11-17T10:31:27-06:00] Deleted default/my-aws-cluster cluster   src="cluster/delete.go:123"
    INFO[2021-11-17T10:31:27-06:00] Running delete bootstrap cluster              src="cluster/create.go:381"
    INFO[2021-11-17T10:31:27-06:00] Deleting bootstrap cluster                    src="bootstrap/bootstrap.go:186"
    ```

Similar to `create cluster`, use the flag `--self-managed` with the `delete cluster`command:

- creates a bootstrap cluster
- moves the CAPI controllers from the workload cluster back to the bootstrap cluster
- deletes the workload cluster
- deletes the bootstrap cluster

To understand how this process works step by step, you can follow the workflow in [Delete Cluster][advanced_delete].

[advanced]: ../advanced/
[advanced_delete]: ../advanced/delete/
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.htm
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
