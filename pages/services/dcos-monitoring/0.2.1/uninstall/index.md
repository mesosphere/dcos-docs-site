---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 20
excerpt: Removing the Beta DC/OS Monitoring Service from a DC/OS cluster
model: /services/dcos-monitoring/data.yml
render: mustache
---
#include /services/include/beta-software-warning.tmpl


# Uninstall the {{ model.techName }} service

You can uninstall the service using the following command:

```bash
dcos package uninstall {{ model.serviceName }}
```
