---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /1.13/installing/data.yml
render: mustache
---

#include /1.13/installing/evaluation/include/all-intro-and-prereqs.tmpl

#include /1.13/installing/evaluation/include/all-install-terraform.tmpl

#include /1.13/installing/evaluation/include/azure-credentials.tmpl

#include /1.13/installing/evaluation/include/all-ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/all-enterprise-license.tmpl

#include /1.13/installing/evaluation/include/azure-cluster-setup.tmpl

#include /1.13/installing/evaluation/include/all-create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/all-logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/all-scale-cluster.tmpl

#include /1.13/installing/evaluation/include/all-upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/all-destroy-cluster.tmpl