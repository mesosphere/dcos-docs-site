---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /1.13/installing/evaluation/include/data.yml
render: mustache
---

#include /1.13/installing/evaluation/include/intro-and-prereqs.tmpl

#include /1.13/installing/evaluation/include/install-terraform.tmpl

#include /1.13/installing/evaluation/include/azure-credentials.tmpl

#include /1.13/installing/evaluation/include/ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/enterprise-license.tmpl

#include /1.13/installing/evaluation/include/azure-cluster-setup.tmpl

#include /1.13/installing/evaluation/include/create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/scale-cluster.tmpl

#include /1.13/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/destroy-cluster.tmpl