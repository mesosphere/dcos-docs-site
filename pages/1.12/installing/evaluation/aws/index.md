---
layout: layout.pug
excerpt: Guide for DC/OS on AWS using the Universal Installer
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
model: /1.12/installing/evaluation/include/data.yml
render: mustache
---

This guide is meant to take an operator through all steps necessary for a successfull installation of DC/OS using Terraform. If you are already familiar with the prerequisites, you can jump to [creating a DC/OS Cluster](#creating-a-dcos-cluster).

## Prerequisites

- Linux, macOS, or Windows
- command-line shell terminal such as Bash or PowerShell
- verified Amazon Web Services (AWS) account and [AWS IAM](https://console.aws.amazon.com/iam/home) user profile with permissions

## Universal Installer 0.2 update for AWS
The Universal Installer config module backend has undergone a change and is now running version `0.2` for Amazon Web Services users. If you are still on `0.1`, there is no direct upgrade path you will NOT be able to upgrade automatically, as the underlying cluster management has been changed. You will need to spin up a new cluster and transfer your services over.

Updates:
- Currently, only CentOS or RHEL are the only supported node OS's.
- `dcos_install_mode` has been deprecated and is now automatically calculated.

#### Checking your version
You can check the version of the Universal Installer modules you are running by viewing your `main.tf`.

```hcl
module "dcos" {
    source  = "dcos-terraform/dcos/aws"
    version = "~> 0.2.0"
    # ...
}
```

#### Using install and upgrade modes for `~> 0.1.0` version users
To use the examples on these pages, make the following changes to your `main.tf`. The only time you should set the variable to `upgrade` is when upgrading the DC/OS version. Remember to set it back to install afterwards to ensure normal operations.

  ```hcl
  variable "dcos_install_mode" {
    description = "specifies which type of command to execute. Options: install or upgrade"
    default = "install"
  }
  module "dcos" {
      source  = "dcos-terraform/dcos/aws"
      version = "~> 0.1.0"

      # ...

      # Reads the install mode set above
      dcos_install_mode = "${var.dcos_install_mode}"
  }
  ```

#include /1.12/installing/evaluation/include/install-terraform.tmpl

#include /1.12/installing/evaluation/include/aws-credentials.tmpl

#include /1.12/installing/evaluation/include/ssh-keypair.tmpl

#include /1.12/installing/evaluation/include/enterprise-license.tmpl

#include /1.12/installing/evaluation/include/aws-cluster-setup.tmpl

#include /1.12/installing/evaluation/include/create-first-cluster.tmpl

#include /1.12/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.12/installing/evaluation/include/scale-cluster.tmpl

#include /1.12/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.12/installing/evaluation/include/destroy-cluster.tmpl