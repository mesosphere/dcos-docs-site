---
layout: layout.pug
navigationTitle:
excerpt: Getting started with Percona XtraDB Cluster
title: Getting Started
menuWeight: 15
model: /services/pxc/data.yml
render: mustache
---

Getting started with a test instance of the DC/OS {{ model.techName }} service is straightforward.

## Prerequisites


- Depending on your security mode in Enterprise DC/OS, you may need to [provision a service account](/mesosphere/dcos/services/pxc/0.2.0-5.7.21/Operations/security/service-account/) before installing. Only someone with `superuser` permission can create the service account.
	- `strict` [security mode](/mesosphere/dcos/1.12/security/ent/#security-modes) requires a service account
	- `permissive` security mode does not require a service account (optional)
	- `disabled` security mode does not require a service account
- Your cluster must have {{ model.install.minNodeCount }}.
{{ model.install.customRequirements }}

#include /mesosphere/dcos/services/include/getting-started.tmpl
