---
layout: layout.pug
navigationTitle: Prometheus Storage
title: Prometheus Storage
menuWeight: 20
excerpt: Prometheus Storage
render: mustache
model: ../../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Configuring Prometheus Storage

## Storage Retention

You can configure the storage retention (default: 15d) of Prometheus by setting the package options like the following during package install.

```json
{
  "prometheus": {
    "storage_tsdb_retention": "30d"
  }
}
```

The above configuration will tell Prometheus to remove old data after 30 days.
Refer to this [document](https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects) for more details about storage retention.
