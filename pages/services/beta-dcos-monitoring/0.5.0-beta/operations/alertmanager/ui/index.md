---
layout: layout.pug
navigationTitle: Alert Manager UI
title: Alert Manager UI
menuWeight: 10
excerpt: Alert Manager UI
render: mustache
model: ../../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Access Alert Manager UI

## Access through Admin Router

You can access the Alert Manager UI through Admin Router using "Services" routes by default.

Assuming the service name is `{{ model.serviceName }}`, you can access the Alert Manager UI using the following URL:

```bash
https://<CLUSTER_URL>/service/{{ model.serviceName }}/alertmanager/
```
