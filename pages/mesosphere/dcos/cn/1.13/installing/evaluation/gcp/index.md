---
layout: layout.pug
excerpt: 使用 Universal 安装工具在 GCP 上的 DC/OS 指南
title: GCP 上使用通用安装工具的 DC/OS
navigationTitle: GCP
menuWeight: 4
model: /mesosphere/dcos/1.13/data.yml
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
