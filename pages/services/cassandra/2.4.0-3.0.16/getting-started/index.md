---
layout: layout.pug
navigationTitle: Getting Started
excerpt: Getting started with Cassandra
title: Getting Started
menuWeight: 20
model: /services/cassandra/data.yml
render: mustache
---

Getting started with a test instance of the DC/OS {{ model.techName }} service is straightforward.

## Prerequisites

- Depending on your security mode in Enterprise DC/OS, you may need to [provision a service account](/services/cassandra/2.4.0-3.0.16/security/#provisioning-a-service-account) before installing. Only someone with `superuser` permission can create the service account.
	- `strict` [security mode](/latest/security/ent/#security-modes) requires a service account.
	- `permissive` security mode a service account is optional.
	- `disabled` security mode does not require a service account.
- Your cluster must have at least {{ model.install.minNodeCount }} private nodes.
{{ model.install.customRequirements }}

#include /services/include/getting-started.tmpl
