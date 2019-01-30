---
layout: layout.pug
navigationTitle: Prometheus UI
title: Prometheus UI
menuWeight: 10
excerpt: Prometheus UI
render: mustache
model: ../../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Access Prometheus UI

## Access through Admin Router

You can access the Prometheus UI through Admin Router using "Services" routes by default (unless `prometheus.admin_router_proxy.enabled` is set to `false`).

Assuming the service name is `{{ model.serviceName }}` (default), you can access the Prometheus UI using the following URL:

```bash
https://<CLUSTER_URL>/service/{{ model.serviceName }}/prometheus/
```

The Admin Router URL can be configured to adapt to the FQDN of your DC/OS cluster.
This step is not required if the users are not using the [`generatorURL`](https://prometheus.io/docs/alerting/clients/) field from an alert.

```json
{
  "prometheus": {
    "admin_router_proxy": {
      "url": "https://dcos.example.com"
    }
  }
}
```
