---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your machine and environment to run DKP
enterprise: true
---

## Konvoy prerequisites

Before you begin using Konvoy, you must have:

- An x86_64-based Linux or macOS machine.
- A [Self-managed AWS cluster](../../../aws/advanced/self-managed/)
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid AWS account with [credentials configured][aws_credentials].
- Installation of [aws-iam-authenticator][aws_auth].

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

## AWS prerequisites

Before you begin using Konvoy with AWS, you must:

-   Create an [IAM policy configuration for EKS][eks_iampolicies].

-   Export the AWS region where you want to deploy the cluster:

    ```bash
    export AWS_REGION=us-west-2
    ```

-   Export the AWS profile with the credentials you want to use to create the Kubernetes cluster:

    ```bash
    export AWS_PROFILE=<profile>
    ```

[aws_auth]: https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[eks_iampolicies]: ../eks-cluster-iam-policies-and-roles
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
