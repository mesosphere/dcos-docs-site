---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your machine and environment to run DKP
enterprise: false
---

## Konvoy prerequisites

Before you begin using Konvoy, you must have:

- An x86_64-based Linux or macOS machine.
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid AWS account with [credentials configured][aws_credentials].

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</p>

## Control plane nodes

You should have at least three control plane nodes.
Each control plane node should have at least:

- 4 cores
- 16 GiB memory
- Approximately 80 GiB of free space for the volume used for /var/lib/kubelet and /var/lib/containerd.
- Disk usage must be below 85% on the root volume.

## Worker nodes

You should have at least four worker nodes. The specific number of worker nodes required for your environment can vary depending on the cluster workload and size of the nodes.
Each worker node should have at least:

- 8 cores
- 32 GiB memory
- Around 80 GiB of free space for the volume used for /var/lib/kubelet and /var/lib/containerd.
- Disk usage must be below 85% on the root volume.

If you use these instructions to create a cluster on AWS using the DKP default settings without any edits to configuration files or additional flags, your cluster is deployed on an [Ubuntu 20.04 operating system image][supported-systems] with 3 control plane nodes, and 4 worker nodes which match the requirements above.  

In particular, it will use the following Amazon Instance Types:

   Control plane:
    - instanceType: m5.xlarge
    - Root volume size:  80GB

   Worker node:
    - instanceType: m5.2xlarge
    - Root volume size:  80GB

<p class="message--note"><strong>NOTE: </strong>
Using these default images work, but due to missing optimizations, the created cluster will have certain limits.
We suggest using <a href="../../../../image-builder/create-ami/">Konvoy Image Builder to create a custom AMI</a> to take advantage of enhanced cluster operations.
</p>

## AWS prerequisites

Before you begin using Konvoy with AWS, you must:

-   Create an [IAM policy configuration][iampolicies].

-   Export the AWS region where you want to deploy the cluster:

    ```bash
    export AWS_REGION=us-west-2
    ```

-   Export the AWS profile with the credentials you want to use to create the Kubernetes cluster:

    ```bash
    export AWS_PROFILE=<profile>
    ```



[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[iampolicies]: ../../iam-policies
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[kib_create_ami]: ../../../../image-builder/create-ami/
[supported-systems]: ../../../../supported-operating-systems
