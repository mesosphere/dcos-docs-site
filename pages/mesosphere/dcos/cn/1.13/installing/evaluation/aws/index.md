---
layout: layout.pug
excerpt: 使用 Universal 安装工具在 AWS 上的 DC/OS 指南
title: 使用 Universal 安装工具在 AWS 上的 DC/OS
navigationTitle: AWS
menuWeight: 0
model：/mesosphere/dcos/1.13/data.yml
render: mustache
---
#包括 /mesosphere/dcos/install-include/aws-intro-and-prereqs.tmpl

#包括 /mesosphere/dcos/install-include/all-install-terraform.tmpl

#包括 /mesosphere/dcos/install-include/aws-credentials.tmpl

#包括 /mesosphere/dcos/install-include/all-ssh-keypair.tmpl

#包括 /mesosphere/dcos/install-include/all-enterprise-license.tmpl

#包括 /mesosphere/dcos/install-include/aws-cluster-setup.tmpl

#包括 /mesosphere/dcos/install-include/all-create-first-cluster.tmpl

#包括 /mesosphere/dcos/install-include/all-logging-in-dcos.tmpl

#包括 /mesosphere/dcos/install-include/all-scale-cluster.tmpl

#包括 /mesosphere/dcos/install-include/all-upgrade-cluster.tmpl

#包括 /mesosphere/dcos/install-include/all-destroy-cluster.tmpl

#包括 /mesosphere/dcos/install-include/aws-v02-modules-update.tmpl
