---
layout: layout.pug
navigationTitle: Grafana UI
title: Grafana UI
menuWeight: 10
excerpt: Grafana UI
render: mustache
model: ../../../data.yml
---

# Access Grafana UI

<p class="message--warning"><strong>WARNING: </strong>It is recommended to access Grafana via <a href="https://docs.mesosphere.com/services/edge-lb/1.3/">Edge-LB</a>. If you access Grafana via Admin Router then it can limit the capabilities of Grafana. For example, some graphs will not work under load.</p>

## Access through Admin Router

You can access the Grafana UI through Admin Router using the "Services" routes by default (unless `grafana.admin_router_proxy` is set to `false`).

Assuming the service name is `{{ model.serviceName }}` (default), you can access the Grafana UI using the following URL:

```bash
https://<CLUSTER_URL>/service/{{ model.serviceName }}/grafana/
```

# Admin credentials

By default, the Admin user credentials for Grafana are `admin:admin`.

You can configure the Admin user credentials by setting `grafana.admin_credentials`.

```bash
dcos security secrets create --value=<ADMIN_USERNAME> adminusername-secret
dcos security secrets create --value=<ADMIN_PASSWORD> adminpassword-secret
```

Create a custom option file (`options.json`) like the following.

```json
{
  "grafana": {
    "admin_credentials": {
      "username_secret": "adminusername-secret",
      "password_secret": "adminpassword-secret"
    }
  }
}
```
