---
layout: layout.pug
excerpt: Guide for DC/OS on GCP using the Universal Installer
title: DC/OS on GCP using the Universal Installer
navigationTitle: GCP
menuWeight: 4
---

To use the Mesosphere Universal Installer with GCP, the GCP command line interface must be installed and configured to the security credentials of the account you will be using for resources. The following instructions will guide you through the necessary account creation and credentials to be able to successfully configure your GCP CLI and install DC/OS.

# Prerequisites
- Linux, macOS, or Windows
- command-line shell terminal such as Bash or PowerShell
- verified Google Cloud Platform account with the necessary permissions

#include /1.13/installing/evaluation/include/install-terraform.tmpl

#include /1.13/installing/evaluation/include/gcp-credentials.tmpl

#include /1.13/installing/evaluation/include/enterprise-license.tmpl

#include /1.13/installing/evaluation/include/gcp-cluster-setup

#include /1.13/installing/evaluation/include/create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/scale-cluster.tmpl

#include /1.13/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/destroy-cluster.tmpl
