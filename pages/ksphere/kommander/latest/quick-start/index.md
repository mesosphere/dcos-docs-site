---
layout: layout.pug
navigationTitle: Quick start
title: Quick start
menuWeight: 3
excerpt: Getting started with Kommander
---

## Installation

### Before you begin
The installation will rely on AWS as the cloud provider, thus most requirements revolve around having proper access to AWS.

Before starting the Konvoy installation, you should verify the following:

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

### Download and Install
Download Konvoy with Kommander [here](https://github.com/mesosphere/konvoy/releases).

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
After you provision your first Konvoy cluster, your username, password, and a URL to Kommander will be printed to the command-line.

To retrieve this information again, you can use the following command:

```
konvoy get ops-portal
```

### Setting up Identity Providers
Kommander supports Github, LDAP and standard OIDC identity providers such as Google. These identity management providers support the login and authentication process for Kommander and Kubernetes clusters. You can configure as many identity providers as you like. Your users will be able to select from any method when logging in.

For more information, see [Identity Providers](../administrating/#identity-providers) in the Administrating section.

## Connecting to a Cloud Provider
Cloud providers like AWS, Azure and Google can provide the infrastructure for your Konvoy clusters. To automate their provisioning, Kommander needs authentication keys to your preferred cloud provider. It is possible to have many accounts for a single cloud provider.

For more information, see [Cloud Providers](../administrating/#cloud-providers) in the Administrating section.

## Creating a Project
You can create projects to deploy consistent configurations and services to clusters. Kommander creates a unique namespace for each managed cluster. After you configure roles, secrets, and application services for a project, Kommander distributes the desired state to each project namespace.

For more information, see the [Projects](../projects) section

## Adding Clusters
Connect Kubernetes clusters to Kommander by importing existing clusters or creating new Konvoy clusters.

For more information, see the [Clusters](../clusters) section
