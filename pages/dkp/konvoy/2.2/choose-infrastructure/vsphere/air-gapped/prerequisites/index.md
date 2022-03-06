---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Air-gapped installation prerequisites
beta: false
enterprise: false
---

## Prerequisites

Before you begin, you must have:

- Linux machine (bastion) that has access to the existing VPC.
- The `dkp` binary on the bastion.
- [Docker][install_docker] version 18.09.2 or later installed on the bastion.
- [kubectl][install_kubectl] for interacting with the running cluster on the bastion.
- Valid vSphere account with _%%% link here_ credentials configured.

### Configure vSphere prerequisites

_%%% need vSphere-specific steps here_

1.  Follow the steps in [IAM Policy Configuration](../../iam-policies).

1.  Export the AWS region where you want to deploy the cluster:

    ```sh
    export AWS_REGION=us-west-2
    ```

1.  Export the AWS profile with the credentials you want to use to create the Kubernetes cluster:

     ```sh
     export AWS_PROFILE=<profile>
     ```

Then, [begin creating the bootstrap cluster][bootstrap].

[bootstrap]: ../bootstrap
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
