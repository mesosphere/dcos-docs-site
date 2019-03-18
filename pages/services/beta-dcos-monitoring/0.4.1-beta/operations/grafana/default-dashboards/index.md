---
layout: layout.pug
navigationTitle: Default Grafana Dashboards for DC/OS
title: Default Grafana Dashboards for DC/OS
menuWeight: 30
excerpt: Default Grafana dashboards for DC/OS.
render: mustache
model: ../../../data.yml
---

#include /services/include/beta-software-warning.tmpl

# Load default Grafana dashboards for DC/OS

The {{ model.techName }} service ships with a set of default Grafana dashboards for DC/OS.
Those dashboards will be automatically loaded if `grafana.default_dashboards` is set to `true`.

Users can choose to disable this feature by setting `grafana.default_dashboards` to `false`.

```json
{
  "grafana": {
    "default_dashboards": true
  }
}
```
