---
layout: layout.pug
navigationTitle: Uninstall
title: Uninstall
menuWeight: 20
excerpt: Removing the service from a DC/OS cluster
render: mustache
model: ../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Uninstall the {{ model.techName }} service

You can uninstall the service using the following command:

```bash
dcos package uninstall {{ model.packageName }}
```
