---
layout: layout.pug
excerpt: Guide for DC/OS on Azure using the Mesosphere Universal Installer
title: DC/OS on Azure using the Universal Installer
navigationTitle: Azure
menuWeight: 2
model: /mesosphere/dcos/2.2/data.yml
render: mustache
---

#include /mesosphere/dcos/install-include-0.3/all-intro-and-prereqs.tmpl

#include /mesosphere/dcos/install-include-0.3/all-install-terraform.tmpl

#include /mesosphere/dcos/install-include-0.3/azure-credentials.tmpl

#include /mesosphere/dcos/install-include-0.3/all-ssh-keypair.tmpl

#include /mesosphere/dcos/install-include-0.3/all-enterprise-license.tmpl

#include /mesosphere/dcos/install-include-0.3/azure-cluster-setup.tmpl

#include /mesosphere/dcos/install-include-0.3/all-create-first-cluster.tmpl

#include /mesosphere/dcos/install-include-0.3/all-logging-in-dcos.tmpl

#include /mesosphere/dcos/install-include-0.3/all-scale-cluster.tmpl

#include /mesosphere/dcos/install-include-0.3/all-upgrade-cluster.tmpl

#include /mesosphere/dcos/install-include-0.3/all-destroy-cluster.tmpl
