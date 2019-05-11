---
layout: layout.pug
navigationTitle: Grafana UI
title: Grafana UI
menuWeight: 10
excerpt: Grafana UI
render: mustache
model: ../../../data.yml
---
#include /services/include/beta-software-warning.tmpl

# Access Grafana UI

## Access through Admin Router

You can access the Grafana UI through Admin Router using "Services" routes by default (unless `grafana.admin_router_proxy` is set to `false`).

Assuming the service name is `{{ model.serviceName }}`, you can access the Grafana UI using the following URL:

```bash
https://<CLUSTER_URL>/service/{{ model.serviceName }}/grafana/
```

## Direct access

Grafana will be installed on a public agent if `public` is set to `true` (default: `false`) in the package config.
The port that Grafana uses can be configured by setting `ui_port` (default: `3000`).
Find that agent's public IP address.
Grafana will be present at `<public_ip>:<ui_port>`.

By default, the username and password is `admin:admin`. See the [Admin Credentials section](#admin-credentials) for directions on configuring these credentials.

Note that you need to set `grafana.admin_router_proxy` to `false`.

```json
{
  "grafana": {
    "public": true,
    "ui_port": 3000,
    "admin_router_proxy": false
  }
}
```

# Admin credentials

By default, the Admin user credentials for Grafana are `admin:admin`.

You can configure the Admin user credentials by setting `grafana.admin_credentials`.

```bash
dcos security secrets create --value=<ADMIN_USERNAME> adminusername
dcos security secrets create --value=<ADMIN_PASSWORD> adminpassword
```

Create a custom option file (`options.json`) like the following.

```json
{
  "grafana": {
    "admin_credentials": {
      "username": "adminusername",
      "password": "adminpassword"
    }
  }
}
```
