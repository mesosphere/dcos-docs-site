---
layout: layout.pug
navigationTitle: Quick start
title: Quick start
menuWeight: 3
excerpt: Getting started with Kommander
---

## Installation

### Before you begin

The *installation* will rely on **AWS** as the cloud provider, thus most requirements revolve around having proper access to AWS.

Before starting the Konvoy installation, you should verify the following:

- Access to a specific version of Konvoy
- Access to https://github.com/mesosphere/kubeaddons-configs
- A valid AWS account with credentials configured.
- You need to be authorized to create the following resources in the AWS account:
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

### Download and Install

Download a free trial version of Konvoy with Kommander [here](https://d2iq.com/solutions/ksphere/konvoy#request-free-trial).

Download the tarball to your local Downloads directory.

For example, if you are installing on MacOS, download the compressed archive to the default `~/Downloads` directory.
Afterwards extract the tarball to your local system by running the following command:

```
tar -xf ~/Downloads/konvoy-kommander_darwin.tar.bz2
```

Copy the Konvoy package files to a directory in your user's `PATH` to ensure you can invoke the konvoy command from any directory.

For example, copy the package to `/usr/local/bin/` by running the following command:

```
sudo cp ~/Downloads/darwin/konvoy-kommander.tar.bz2/* /usr/local/bin/
```

Check version

```
konvoy --version
```

Once you have the newest version of konvoy, move into the directory where you would like to test and run:

```
konvoy up
```

## Logging In

### Logging in with Username and Password

After you provision your first Konvoy cluster, your username, password, and a URL to Konvoy will be printed to the command-line. Once in Konvoy, you should see a button labelled "Try Kommander Beta!". If not, check to ensure you've installed the Konvoy release that includes Kommander.

![Try Kommander button](/ksphere/kommander/img/try-kommander-beta.png)

To retrieve this information again, you can use the following command:

```
konvoy get ops-portal
```

