---
layout: layout.pug
navigationTitle: Deprecated Universal Installer 0.2
title: Universal Installer 0.2
menuWeight: 10
excerpt: Guide to Installing DC/OS on cloud environments using the Mesosphere Universal Installer 0.2
model: /mesosphere/dcos/2.2/data.yml
render: mustache
---

# Deprecation Notice
Universal Installer 0.2 is based on Terraform 0.11 which is EOL and does not get any further updates. Furthermore Terraform providers might get incompatible with this version of Terraform. We strongly suggest to update to Universal Installer 0.3 using the provided Upgrade guides

## Upgrade to Universal Installer 0.3

You can find the upgrade guides here:

- [Amazon Web Services](/mesosphere/dcos/{{ model.folder_version }}/installing/evaluation/universal-installer-0.2/aws/upgrade/)

- [Azure Resource Manager](/mesosphere/dcos/{{ model.folder_version }}/installing/evaluation/universal-installer-0.2/azure/upgrade/)

- [Google Cloud Platform](/mesosphere/dcos/{{ model.folder_version }}/installing/evaluation/universal-installer-0.2/gcp/upgrade/)
