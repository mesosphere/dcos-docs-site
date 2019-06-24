---
layout: layout.pug
excerpt: Guide for DC/OS on GCP using the Universal Installer
title: DC/OS on GCP using the Universal Installer
navigationTitle: GCP
menuWeight: 4
model: /data.yml
render: mustache
---

#include /install-include/all-intro-and-prereqs.tmpl

#include /install-include/all-install-terraform.tmpl

#include /install-include/gcp-credentials.tmpl

#include /install-include/all-enterprise-license.tmpl

#include /install-include/gcp-cluster-setup.tmpl

#include /install-include/all-create-first-cluster.tmpl

#include /install-include/all-logging-in-dcos.tmpl

#include /install-include/all-scale-cluster.tmpl

#include /install-include/all-upgrade-cluster.tmpl

#include /install-include/all-destroy-cluster.tmpl