---
layout: layout.pug
excerpt: Guide for DC/OS on AWS using the Universal Installer
title: DC/OS on AWS using the Universal Installer
navigationTitle: AWS
menuWeight: 0
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---
#include /mesosphere/dcos/install-include-0.3/aws-intro-and-prereqs.tmpl

#include /mesosphere/dcos/install-include-0.3/all-install-terraform.tmpl

#include /mesosphere/dcos/install-include-0.3/aws-credentials.tmpl

#include /mesosphere/dcos/install-include-0.3/all-ssh-keypair.tmpl

#include /mesosphere/dcos/install-include-0.3/all-enterprise-license.tmpl

#include /mesosphere/dcos/install-include-0.3/aws-cluster-setup.tmpl

#include /mesosphere/dcos/install-include-0.3/all-create-first-cluster.tmpl

#include /mesosphere/dcos/install-include-0.3/all-logging-in-dcos.tmpl

#include /mesosphere/dcos/install-include-0.3/all-scale-cluster.tmpl

#include /mesosphere/dcos/install-include-0.3/all-upgrade-cluster.tmpl

#include /mesosphere/dcos/install-include-0.3/all-destroy-cluster.tmpl
