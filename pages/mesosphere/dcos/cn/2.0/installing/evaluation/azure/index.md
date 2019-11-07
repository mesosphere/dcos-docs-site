---
layout: layout.pug
excerpt: 使用 Mesosphere Universal 安装工具在 Azure 上的 DC/OS 指南
title: 使用 Universal 安装工具在 Azure 上的 DC/OS
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
