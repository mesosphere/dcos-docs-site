---
layout: layout.pug
navigationTitle: Installation
title: Installation Guide
menuWeight: 4
excerpt: Installation Guide for Kommander
---

# Download and Install

Download Konvoy with Kommander Beta 1 [here](https://github.com/mesosphere/konvoy/releases/tag/v1.3.0-kommander-beta1).

Download the tarball to your local Downloads directory.
For example, if you are installing on MacOS, download the compressed archive to the default `~/Downloads` directory.
Afterwards extract the tarball to your local system by running the following command:

```
tar -xf ~/Downloads/konvoy_v1.3.0-kommander-beta1_darwin.tar.bz2
```

Copy the Konvoy package files to a directory in your user's `PATH` to ensure you can invoke the konvoy command from any directory.
For example, copy the package to `/usr/local/bin/` by running the following command:

```
sudo cp ~/Downloads/darwin/konvoy_v1.3.0-kommander-beta1/* /usr/local/bin/
```

Check version

```
konvoy --version 
```

Once you have the newest version of konvoy, move into the directory where you would like to test and run:

```
konvoy up	
```


# Other Prerequisites

The installation will rely on AWS as the cloud provider, thus most requirements revolve around having proper access to AWS.

* Access to a specific version of Konvoy
* Access to https://github.com/mesosphere/kubeaddons-configs
* A valid AWS account with credentials configured.
* You need to be authorized to create the following resources in the AWS account:
    * EC2 Instances
    * VPC
    * Subnets
    * Elastic Load Balancer (ELB)
    * Internet Gateway
    * NAT Gateway
    * Elastic Block Storage (EBS) Volumes
    * Security Groups
    * Route Tables
    * IAM Roles
