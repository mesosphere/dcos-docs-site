---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /1.11/installing/data.yml
render: mustache
---

#include /install-include/all-intro-and-prereqs.tmpl

#include /install-include/all-install-terraform.tmpl

#include /install-include/azure-credentials.tmpl

#include /install-include/all-ssh-keypair.tmpl

#include /install-include/all-enterprise-license.tmpl

#include /install-include/azure-cluster-setup.tmpl

#include /install-include/all-create-first-cluster.tmpl

#include /install-include/all-logging-in-dcos.tmpl

#include /install-include/all-scale-cluster.tmpl

#include /install-include/all-upgrade-cluster.tmpl

#include /install-include/all-destroy-cluster.tmpl