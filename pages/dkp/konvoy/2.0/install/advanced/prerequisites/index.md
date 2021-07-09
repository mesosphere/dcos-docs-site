---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your machine and environment to run Konvoy
enterprise: false
---

## Configure Konvoy prerequisites

Before using Konvoy, verify that you have:

- An AMD64 based Linux or MacOS machine.
- The `konvoy` binary for Linux, or MacOS.
- [Docker][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid AWS account with [credentials configured][aws_credentials].

<p class="message--note"><strong>NOTE: </strong>On MacOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

## Configure AWS prerequisites

Before using Konvoy to create a Kubernetes cluster in AWS:

1.  Follow the steps in [IAM Policy Configuration][iampolicies].

1.  Export the AWS region where you want to deploy the cluster:

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS profile with the credentials you want to use to create the Kubernetes cluster:

    ```sh
    export AWS_PROFILE=<profile>
    ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[iampolicies]: ../../../iam-policies
