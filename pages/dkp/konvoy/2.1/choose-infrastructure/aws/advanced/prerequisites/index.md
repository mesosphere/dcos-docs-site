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

If you use these instructions to create a cluster on AWS using the DKP default settings without any edits to configuration files or additional flags, your cluster is deployed on a [CentOS 7 operating system image][supported-systems] with 3 control plane nodes, and 4 worker nodes.

<p class="message--note"><strong>NOTE: </strong>
The AMI images used in the default configuration work, but they are not recommended for production workloads. We suggest using the <a href="../../../../image-builder/create-ami/">Konvoy Image Builder to create a custom AMI</a> for production workloads.
</p>

## AWS prerequisites

Before you begin using Konvoy with AWS, you must:

-   Create an [IAM policy configuration][iampolicies].

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
