---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /1.10/installing/evaluation/include/data.yml
render: mustache
---

This guide is meant to take an operator through all steps necessary for a successfull installation of DC/OS using Terraform. If you are already familiar with the prerequisites, you can jump to [Creating a DC/OS Cluster](#creating).

## Prerequisites

- Linux, macOS, or Windows
- command-line shell terminal such as Bash or PowerShell
- verified Azure Resource Manager account with the necessary permissions

#include /1.10/installing/evaluation/include/install-terraform.tmpl

#include /1.10/installing/evaluation/include/azure-credentials.tmpl

#include /1.10/installing/evaluation/include/ssh-keypair.tmpl

#include /1.10/installing/evaluation/include/enterprise-license.tmpl

#include /1.10/installing/evaluation/include/azure-cluster-setup.tmpl

#include /1.10/installing/evaluation/include/create-first-cluster.tmpl

#include /1.10/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.10/installing/evaluation/include/scale-cluster.tmpl

#include /1.10/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.10/installing/evaluation/include/destroy-cluster.tmpl