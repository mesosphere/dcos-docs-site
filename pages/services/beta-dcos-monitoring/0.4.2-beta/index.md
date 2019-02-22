---
layout: layout.pug
navigationTitle: Beta DC/OS Monitoring Service 0.4.2
title: Beta DC/OS Monitoring Service 0.4.2
menuWeight: 1
excerpt:
render: mustache
model: data.yml
---

The {{ model.techName }} service makes it easy to monitor DC/OS components and your services on the DC/OS cluster.
It can be configured to automatically load Grafana dashboard and alert configurations from Git repositories.
It also ships with a set of default Grafana dashboards for monitoring DC/OS itself.
The service can be configured to automatically load Alert Manager configuration from a Git repository.

#include /services/include/beta-software-warning.tmpl
