---
layout: layout.pug
excerpt: Guide for DC/OS on AWS using the Universal Installer
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
model: /1.13/installing/data.yml
render: mustache
---
#include /1.13/installing/evaluation/include/aws-intro-and-prereqs.tmpl

#include /1.13/installing/evaluation/include/all-install-terraform.tmpl

#include /1.13/installing/evaluation/include/aws-credentials.tmpl

#include /1.13/installing/evaluation/include/all-ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/all-enterprise-license.tmpl

#include /1.13/installing/evaluation/include/aws-cluster-setup.tmpl

#include /1.13/installing/evaluation/include/all-create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/all-logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/all-scale-cluster.tmpl

#include /1.13/installing/evaluation/include/all-upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/all-destroy-cluster.tmpl

#include /1.13/installing/evaluation/include/aws-v02-modules-update.tmpl