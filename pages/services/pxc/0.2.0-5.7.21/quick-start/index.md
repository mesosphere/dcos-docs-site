---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Percona XtraDB Cluster - Quick Start
title: Quick Start
menuWeight: 80
model: /services/pxc/data.yml
render: mustache
---

DC/OS {{ model.techName }} is available in the DC/OS Universe and can be installed by using either the web interface or the DC/OS CLI.

This section will take you through a minimal install of the {{ model.techName }} Service on a cluster.

## Prerequisites
- You must have [DC/OS](/mesosphere/dcos/latest/in) installed on your cluster.
- Your cluster must have {{ model.install.minNodeCount }}.
- If you are using Enterprise DC/OS, you may [need to provision a service account](/mesosphere/dcos/1.12/security/ent/service-auth/custom-service-auth/) before installing DC/OS {{ model.techName }} Service. Only someone with `superuser` permission can create the service account.
  - `strict` [security mode](/mesosphere/dcos/1.12/security/ent/service-auth/custom-service-auth/) requires a service account.
  - In `permissive` security mode a service account is optional.
  - `disabled` security mode does not require a service account.

## Installing from the CLI

If you are using DC/OS Open Source, install {{ model.serviceName }} on the cluster with the following command from the DC/OS CLI. 

```shell
dcos package install --yes {{ model.serviceName }}
```
If you are using Enterprise DC/OS, you may need to follow additional instructions. See the [Install](/mesosphere/dcos/services/pxc/0.2.0-5.7.21/operations/install/) section for more information.

## Installing from the web interface

Alternatively, you can install {{ model.techName }} from the DC/OS web interface. The instructions are [here](/mesosphere/dcos/services/pxc/0.2.0-5.7.21/operations/install/#installing-from-the-dcos-web-interface).

Once the `install` command is triggered, the service will deploy with a default configuration. You can monitor its deployment via the Services tab of the DC/OS web interface.   
