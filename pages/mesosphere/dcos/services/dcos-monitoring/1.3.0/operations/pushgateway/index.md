---
layout: layout.pug
navigationTitle: Pushgateway
title: Pushgateway
menuWeight: 60
excerpt: Pushgateway
render: mustache
model: ../../data.yml
---

# Enabling Pushgateway

Pushgateway is off by default.
You can enable it by setting `pushgateway.enabled` to `true`.

```json
{
  "pushgateway": {
    "enabled": true
  }
}
```

See the [Pushgateway documentation](https://prometheus.io/docs/practices/pushing/) for more details about Pushgateway and when you might want to use it to push metrics to Prometheus.
