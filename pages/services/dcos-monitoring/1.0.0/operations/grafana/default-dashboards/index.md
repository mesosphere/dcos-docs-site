---
layout: layout.pug
navigationTitle: Default Grafana Dashboards for DC/OS
title: Default Grafana Dashboards for DC/OS
menuWeight: 30
excerpt: Default Grafana dashboards for DC/OS.
render: mustache
model: ../../../data.yml
---

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

These default dashboards are pulled from the Mesosphere-maintained Git repository `https://github.com/dcos/grafana-dashboards`.
Dashboards are updated with each {{ model.techName }} service release.
To use the most up-to-date version of these dashboards instead of waiting for the next release, users should set `grafana.default_dashboards` to `false` and [configure](../dashboard-configs) the {{ model.techName }} service to load Grafana dashboard configurations from this Git repository.
