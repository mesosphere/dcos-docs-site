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



#include /1.13/installing/evaluation/include/install-terraform.tmpl

#include /1.13/installing/evaluation/include/aws-credentials.tmpl

#include /1.13/installing/evaluation/include/ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/enterprise-license.tmpl

#include /1.13/installing/evaluation/include/aws-cluster-setup.tmpl

#include /1.13/installing/evaluation/include/create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/scale-cluster.tmpl

#include /1.13/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/destroy-cluster.tmpl

#include /1.13/installing/evaluation/include/aws-v02-modules-update.tmpl