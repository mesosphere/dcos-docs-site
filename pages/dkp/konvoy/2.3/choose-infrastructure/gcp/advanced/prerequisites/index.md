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
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- A valid AWS account with [credentials configured][gcp_credentials].
- Installation of ????

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

## GCP prerequisites

Before you begin using Konvoy with GCP, you must:

-   Create an ????.

-   Export the GCP region where you want to deploy the cluster:

    ```bash
    export GCP_REGION=us-west-2
    ```

-   Export the GCP profile with the credentials you want to use to create the Kubernetes cluster:

    ```bash
    export GCP_PROFILE=<profile>
    ```


[gcp_credentials]: https://github.com/kubernetes-sigs/cluster-api-provider-gcp

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
