---
layout: layout.pug
excerpt: Guide for DC/OS on GCP using the Universal Installer
title: DC/OS on GCP using the Universal Installer
navigationTitle: GCP
menuWeight: 4
model: /1.14/data.yml
render: mustache
---

#include /mesosphere/dcos/install-include/all-intro-and-prereqs.tmpl

#include /mesosphere/dcos/install-include/all-install-terraform.tmpl

#include /mesosphere/dcos/install-include/gcp-credentials.tmpl

#include /mesosphere/dcos/install-include/all-enterprise-license.tmpl

#include /mesosphere/dcos/install-include/gcp-cluster-setup.tmpl

#include /mesosphere/dcos/install-include/all-create-first-cluster.tmpl

#include /mesosphere/dcos/install-include/all-logging-in-dcos.tmpl

#include /mesosphere/dcos/install-include/all-scale-cluster.tmpl

#include /mesosphere/dcos/install-include/all-upgrade-cluster.tmpl

#include /mesosphere/dcos/install-include/all-destroy-cluster.tmpl
