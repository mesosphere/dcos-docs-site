---
layout: layout.pug
excerpt: Guide for DC/OS on AWS using the Universal Installer
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
---

To use the Mesosphere Universal Installer with Amazon Web Services, the AWS Command Line Interface (AWS CLI) must be installed and configured to the security credentials of the AWS account you will be using for resources. The following instructions will guide you through the necessary account creation and credentials to be able to successfully configure your AWS CLI and install DC/OS.

## Prerequisites

- Linux, macOS, or Windows
- command-line shell terminal such as Bash or PowerShell
- verified Amazon Web Services (AWS) account and [AWS IAM](https://console.aws.amazon.com/iam/home) user profile with permissions

#include /1.13/installing/evaluation/include/install-terraform.tmpl

#include /1.13/installing/evaluation/include/aws-credentials.tmpl

#include /1.13/installing/evaluation/include/ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/aws-cluster-setup

#include /1.13/installing/evaluation/include/enterprise-license.tmpl

#include /1.13/installing/evaluation/include/create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/scale-cluster.tmpl

#include /1.13/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/destroy-cluster.tmpl