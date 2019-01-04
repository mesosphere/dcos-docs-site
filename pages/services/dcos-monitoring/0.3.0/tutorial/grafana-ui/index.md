---
layout: layout.pug
navigationTitle: Grafana UI
title: Grafana UI
menuWeight: 50
excerpt: Access Grafana UI.
---

# Access Grafana UI

## Access through Admin Router

You should be able to access Grafana UI through Admin Router using "Services" routes by default (unless `grafana.admin_router_proxy` is set to `false`).

Assume the service name is `dcos-monitoring` (default), you can access the Grafana UI using the following URL:

```bash
https://<CLUSTER_URL>/service/dcos-monitoring/grafana/
```

## Direct access

Grafana will be installed on a public agent if `public` is set to `true` (default: `false`) in the package config.
The port that Grafana uses can be configured by setting `ui_port` (default: `3000`).
Go find that agent's public IP address.
Grafana will be present at `<public_ip>:<ui_port>`.

By default the username and password is `admin:admin`.

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

The user can choose to configure the Admin user credentials by setting `grafana.admin_credentials`.

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
