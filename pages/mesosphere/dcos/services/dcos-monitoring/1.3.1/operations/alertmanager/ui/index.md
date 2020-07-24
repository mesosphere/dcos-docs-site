---
layout: layout.pug
navigationTitle: Alertmanager UI
title: Alertmanager UI
menuWeight: 10
excerpt: Alertmanager UI
render: mustache
model: ../../../data.yml
---

# Access Alertmanager UI

## Access through Admin Router

You can access the Alertmanager UI through Admin Router using the "Services" routes by default.

Assuming the service name is `{{ model.serviceName }}` (default), you can access the Alertmanager UI using the following URL:

```bash
https://<CLUSTER_URL>/service/{{ model.serviceName }}/alertmanager/
```
