---
layout: layout.pug
excerpt: Guide for DC/OS on AWS using the Universal Installer
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
model: /1.10/installing/data.yml
render: mustache
---
#include /install-include/aws-intro-and-prereqs.tmpl

#include /install-include/all-install-terraform.tmpl

#include /install-include/aws-credentials.tmpl

#include /install-include/all-ssh-keypair.tmpl

#include /install-include/all-enterprise-license.tmpl

#include /install-include/aws-cluster-setup.tmpl

#include /install-include/all-create-first-cluster.tmpl

#include /install-include/all-logging-in-dcos.tmpl

#include /install-include/all-scale-cluster.tmpl

#include /install-include/all-upgrade-cluster.tmpl

#include /install-include/all-destroy-cluster.tmpl

#include /install-include/aws-v02-modules-update.tmpl