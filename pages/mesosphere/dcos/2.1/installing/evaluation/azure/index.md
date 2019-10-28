---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /mesosphere/dcos/2.0/data.yml
render: mustache
---

#include /mesosphere/dcos/install-include/all-intro-and-prereqs.tmpl

#include /mesosphere/dcos/install-include/all-install-terraform.tmpl

#include /mesosphere/dcos/install-include/azure-credentials.tmpl

#include /mesosphere/dcos/install-include/all-ssh-keypair.tmpl

#include /mesosphere/dcos/install-include/all-enterprise-license.tmpl

#include /mesosphere/dcos/install-include/azure-cluster-setup.tmpl

#include /mesosphere/dcos/install-include/all-create-first-cluster.tmpl

#include /mesosphere/dcos/install-include/all-logging-in-dcos.tmpl

#include /mesosphere/dcos/install-include/all-scale-cluster.tmpl

#include /mesosphere/dcos/install-include/all-upgrade-cluster.tmpl

#include /mesosphere/dcos/install-include/all-destroy-cluster.tmpl
