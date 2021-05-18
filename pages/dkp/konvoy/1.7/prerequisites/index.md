---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 55
excerpt: Requirements for installing Konvoy
beta: true
enterprise: false
---

<!-- markdownlint-disable MD025 MD018-->

All Konvoy runtime dependencies are bundled in a Docker container and packaged with a wrapper that executes the container and manages these dependencies.

Before starting the Konvoy installation, verify the following:

-   You have a Linux or MacOS computer with a supported version of the operating system.
-   You have the [aws][install_aws] command-line utility if you are installing on an AWS cloud instance.
-   You have [Docker][install_docker] version 18.09.2 or later.
-   You have [kubectl][install_kubectl] v1.20.2 or later for interacting with the running cluster.
-   You have a valid AWS account with [credentials configured][aws_credentials].
    You must be authorized to create the following resources in the AWS account:
    - EC2 Instances
    - VPC
    - Subnets
    - Elastic Load Balancer (ELB)
    - Internet Gateway
    - NAT Gateway
    - Elastic Block Storage (EBS) Volumes
    - Security Groups
    - Route Tables
    - IAM Roles

Make sure the control plane nodes and worker nodes can access the following domains:

#include /dkp/konvoy/1.7/include/required-domains.tmpl

In addition, FIPS mode enablement is a decision to make when installing and running Konvoy for the first time, or when you intend to create a new cluster. You can enable FIPS mode only at cluster creation. There is no way to apply FIPS mode to an existing cluster, you must provision a new one.

When installing Konvoy for a project, line-of-business, or enterprise, the first step is to determine the infrastructure on which you want to deploy.

For example, you can:

- Install on a public cloud infrastructure, such as Amazon Web Services (AWS) or Azure.
- Install on an internal network with a physical (bare metal) or virtual infrastructure.
- Install on a single laptop with a virtual infrastructure.

The infrastructure you select then determines the specific requirements for a successful installation.

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[aws_credentials]: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[install_aws]: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
