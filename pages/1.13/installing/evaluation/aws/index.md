---
layout: layout.pug
excerpt: Guide for DC/OS on AWS using the Universal Installer
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
model: /1.13/installing/evaluation/include/data.yml
render: mustache
---
#include /1.13/installing/evaluation/include/aws-intro-and-prereqs.tmpl

#include /1.13/installing/evaluation/include/install-terraform.tmpl

#include /1.13/installing/evaluation/include/aws-credentials.tmpl

#include /1.13/installing/evaluation/include/ssh-keypair.tmpl

#include /1.13/installing/evaluation/include/enterprise-license.tmpl

#include /1.13/installing/evaluation/include/aws-cluster-setup.tmpl

#include /1.13/installing/evaluation/include/all-create-first-cluster.tmpl

#include /1.13/installing/evaluation/include/logging-in-dcos.tmpl

#include /1.13/installing/evaluation/include/scale-cluster.tmpl

#include /1.13/installing/evaluation/include/upgrade-cluster.tmpl

#include /1.13/installing/evaluation/include/destroy-cluster.tmpl

#include /1.13/installing/evaluation/include/aws-v02-modules-update.tmpl