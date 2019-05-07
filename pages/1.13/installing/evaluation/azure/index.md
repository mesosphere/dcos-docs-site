---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
---

To use the Mesosphere Universal Installer with Azure, the Azure command line interface must be installed and configured to the security credentials of the account you will be using for resources. The following instructions will guide you through the necessary account creation and credentials to be able to successfully configure your Azure CLI and install DC/OS.

## Prerequisites

- Linux, macOS, or Windows
- command-line shell terminal such as Bash or PowerShell
- verified Azure Resource Manager account with the necessary permissions

#include /1.13/installing/evaluation/include/install-terraform.tmpl

#include /1.13/installing/evaluation/include/azure-credentials.tmpl

#include /1.13/installing/evaluation/include/ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/azure-cluster-setup.tmpl

#include /1.13/installing/evaluation/include/create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/scale-cluster.tmpl

#include /1.13/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/destroy-cluster.tmpl