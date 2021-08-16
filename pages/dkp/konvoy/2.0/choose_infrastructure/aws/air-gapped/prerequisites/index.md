---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Air-gapped installation prerequisites
beta: true
enterprise: false
---

## Prerequisites

Before you begin, you must have:

- Linux machine (bastion) that has access to the existing VPC.
- The `konvoy` binary on the bastion.
- [Docker][install_docker] version 18.09.2 or later installed on the bastion.
- [kubectl][install_kubectl] for interacting with the running cluster on the bastion.
- Valid AWS account with [credentials configured][aws_credentials].

### Configure AWS prerequisites

1.  Follow the steps in [IAM Policy Configuration](../../iam-policies).

1.  Export the AWS region where you want to deploy the cluster:

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS profile with the credentials you want to use to create the Kubernetes cluster:

     ```sh
     export AWS_PROFILE=<profile>
     ```

1.  Refresh the credentials used by the AWS provider at any time, using the command:

     ```sh
     konvoy update bootstrap credentials aws
     ```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
