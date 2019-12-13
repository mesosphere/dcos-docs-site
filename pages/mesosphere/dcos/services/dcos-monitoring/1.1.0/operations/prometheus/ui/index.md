---
layout: layout.pug
navigationTitle: Prometheus UI
title: Prometheus UI
menuWeight: 10
excerpt: Prometheus UI
render: mustache
model: ../../../data.yml
---

# Access Prometheus UI

## Access through Admin Router

You can access the Prometheus UI through Admin Router using the "Services" routes by default (unless `prometheus.admin_router_proxy.enabled` is set to `false`).

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

## Access through Marathon LB

You can also choose to access the Prometheus UI through [Marathon LB](https://docs.mesosphere.com/services/marathon-lb/1.12.x/) by configuring the service.

You must configure `prometheus.marathon_lb_proxy.vhost` field to be the Fully Qualified Domain Name (FQDN) for the service.
This is typically your cloud load balancer FQDN (e.g., ELB).
You must turn off the Admin Router proxy support to enable the Marathon LB support.

```json
{
  "prometheus": {
    "admin_router_proxy": {
      "enabled": false
    },
    "marathon_lb_proxy": {
      "enabled": true,
      "vhost": "prometheus.example.com"
    }
  }
}
```

<p class="message--note"><strong>NOTE: </strong>Currently, there is a limitation where the service name cannot contain any character that is not allowed in a DNS name (e.g., /), which means the service cannot be installed in a Marathon folder.</p>
