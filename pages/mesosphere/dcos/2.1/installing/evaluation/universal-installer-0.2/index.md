---
layout: layout.pug
navigationTitle: Deprecated Universal Installer 0.2
title: Universal Installer 0.2
menuWeight: 10
excerpt: Guide to Installing DC/OS on cloud environments using the Mesosphere Universal Installer 0.2
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Deprecation Notice
Universal Installer 0.2 is based on Terraform v0.11, which is EOL and no longer updated. Because it is EOL, it is possible that some non-DC/OS Terraform providers might eventually become incompatible with v0.11 of Terraform. Therefore, we strongly suggest that you do not create any new clusters using the Universal Installer 0.2 modules, and that you upgrade any existing 0.2 based cluster to the 0.3 version of the modules using the upgrade guides listed below.

## Upgrade to Universal Installer 0.3

You can find the upgrade guides here:

- [Amazon Web Services](/mesosphere/dcos/{{ model.folder_version }}/installing/evaluation/universal-installer-0.2/aws/upgrade/)

- [Azure Resource Manager](/mesosphere/dcos/{{ model.folder_version }}/installing/evaluation/universal-installer-0.2/azure/upgrade/)

- [Google Cloud Platform](/mesosphere/dcos/{{ model.folder_version }}/installing/evaluation/universal-installer-0.2/gcp/upgrade/)
