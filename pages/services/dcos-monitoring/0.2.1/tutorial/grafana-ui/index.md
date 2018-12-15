---
layout: layout.pug
navigationTitle: Grafana UI
title: Grafana UI
menuWeight: 50
excerpt: Access Grafana UI.
---

# Access Grafana UI

Grafana will be installed on a public agent if `public` is set to `true` (default: `false`) in the package config.
The port that Grafana uses can be configured by setting `ui_port` (default: `3000`).
Go find that agent's public IP address.
Grafana will be present at `<public_ip>:<ui_port>`.

By default the username and password is `admin:admin`.

```json
{
  "grafana": {
    "public": true,
    "ui_port": 3000
  }
}
```
