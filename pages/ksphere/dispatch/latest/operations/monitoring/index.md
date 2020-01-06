---
layout: layout.pug
navigationTitle:  Monitoring
title: Monitoring Dispatch
menuWeight: 2
excerpt: Configure Prometheus monitoring and dashboards for Dispatch
---

# Monitoring Dispatch

Dispatch integrates with Prometheus for metrics. On the D2iQ Konvoy Kubernetes
distribution, Dispatch metrics and logging are automatically integrated with the
Konvoy monitoring stack:

* Metrics for dispatch components, pipelines, and tasks, are stored in Prometheus and can be visualized using the [Dispatch Grafana dashboards](https://github.com/mesosphere/dispatch/tree/master/monitoring/dashboards).
* Component and task logs are forwarded to Elastic and can be explored using Kibana.

## Setup Monitoring for non-Konvoy clusters

Ensure that Dispatch is installed with with metrics support into a kubernetes cluster:

```bash
dispatch init --set global.prometheus.enabled=true --set global.prometheus.release=prometheus-kubeaddons
```

*NOTE : `prometheus-kubeaddons` is the default value for `release` label when creating a konvoy cluster. In an installation where prometheus is configured to match a different `release` label, dispatch can be configured to be installed with the same custom label.*
