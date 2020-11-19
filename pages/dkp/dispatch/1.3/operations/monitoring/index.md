---
layout: layout.pug
navigationTitle:  Monitoring
title: Monitoring Dispatch
menuWeight: 40
beta: false
excerpt: Configure Prometheus monitoring and dashboards for Dispatch
---

# Monitoring Dispatch

Dispatch integrates with Prometheus for metrics. In the D2iQ Konvoy Kubernetes distribution, Dispatch metrics and logging are automatically integrated with the Konvoy monitoring stack:

* Metrics for Dispatch components, pipelines, and tasks, are stored in Prometheus and can be visualized using the Dispatch Grafana dashboards, which are packaged with the Dispatch installation.
* Component and task logs are forwarded to Elastic and can be explored using Kibana.

## Set Up Monitoring for non-Konvoy clusters

Make sure that Dispatch is installed with with metrics support into a Kubernetes cluster:

```bash
dispatch init --set global.prometheus.enabled=true --set global.prometheus.release=prometheus-kubeaddons
```

<p class="message--note"><strong>NOTE: </strong> <tt>prometheus-kubeaddons</tt> is the default value for <tt>release</tt> label when creating a Konvoy cluster. In an installation where Prometheus is configured to match a different </tt>release</tt> label, Dispatch can be configured to be installed with the same custom label.</p>
