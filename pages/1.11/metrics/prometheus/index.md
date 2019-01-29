---
layout: layout.pug
title: Sending DC/OS Metrics to Prometheus
menuWeight: 4.5
excerpt: Monitoring your workload with Prometheus and Grafana self-hosted instances
enterprise: false
---

DC/OS 1.11 exports Prometheus metrics by default. There is no need to install a metrics plugin, as in DC/OS 1.9 and 1.10. This guide details how to run a self-hosted Prometheus instance to monitor your workload, and a self-hosted Grafana instance for powerful dashboards and visualizations.

**Prerequisite:**

- You must have the [DC/OS CLI installed](/1.11/cli/install/) and be logged in as a superuser via the `dcos auth login` command.

# Run a Prometheus server on DC/OS

There are many ways to run a Prometheus server. This is the simplest way to get started with self-hosted metrics on DC/OS.

1. Download three marathon configurations from the dcos-metrics repository:
    1. [metrics.json](https://raw.githubusercontent.com/dcos/dcos-metrics/master/docs/resources/metrics.json)
    1. [prometheus.json](https://raw.githubusercontent.com/dcos/dcos-metrics/master/docs/resources/prometheus.json)
    1. [grafana.json](https://raw.githubusercontent.com/dcos/dcos-metrics/master/docs/resources/grafana.json)
1. Run Prometheus and Grafana in a pod with `dcos marathon pod add metrics.json`.
1. Run a Prometheus UI proxy with `dcos marathon app add prometheus.json`.
1. Run a Grafana UI proxy with `dcos marathon app add grafana.json`.
1. Open the DC/OS UI and wait for all the services in the newly created 'monitoring' folder to become healthy.

# Working with metrics in Prometheus

You can find the Prometheus UI by hovering your cursor over the prometheus application in the 'monitoring' folder and clicking on the link that appears. This
Prometheus service is configured to discover all the agents and masters in your cluster and pull metrics from them. Running the statsd-emitter test application
described in the [quickstart](/1.11/metrics/quickstart/) documentation will allow you to query for `statsd_tester_time_uptime`, which should yield a graph that
looks like this:

   ![statsd_tester_time_uptime](/1.11/img/statsd_tester_time_uptime.png)

   Figure 1. Statsd graph

# Working with metrics in Grafana

You can find the Grafana UI similarly to the Prometheus UI, by hovering your cursor over the grafana application in the 'monitoring' folder and clicking on the
link that appears. Adding a Prometheus datasource on http://localhost:9090 called DC/OS Metrics will allow you to build dashboards with data from DC/OS.
