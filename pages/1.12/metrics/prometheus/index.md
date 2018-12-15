---
layout: layout.pug
title: Export DC/OS Metrics to Prometheus
navigationTitle: Export DC/OS Metrics to Prometheus
menuWeight: 5
excerpt: Monitoring your workload with Prometheus and Grafana self-hosted instances
enterprise: false
---

DC/OS 1.12 exports system, container and application metrics in Prometheus format by default. It is not required to install a metrics plugin, as in DC/OS 1.9 and 1.10 versions. This page explains how to run a self-hosted Prometheus instance to monitor your workload, and a self-hosted Grafana instance for powerful dashboards and visualizations.

**Prerequisite:**

- You must have the [DC/OS CLI installed](/1.12/cli/install/) and be logged in as a superuser via the `dcos auth login` command.

# Running Prometheus and Grafana on DC/OS

There are many ways to run a Prometheus and Grafana stack. This is the simplest way to get started with self-hosted metrics on DC/OS.

1. Install the Prometheus service with `dcos package install prometheus`.
1. Install the Grafana service with `dcos package install grafana`.
1. Open the DC/OS UI and wait for both services to become healthy.

# Working with metrics in Prometheus

The Prometheus service is already configured to fetch metrics from every node, mesos agent, and task in your cluster. It is not required to perform any further configuration, although you may add more datasources at any time by updating the configuration field of the Prometheus service. 

The Prometheus service exposes endpoints for AlertManager, the Prometheus UI, and Pushgateway. These are dsiplayed in the `Endpoints` tab. The URL of the Prometheus UI is http://prometheus.prometheus.l4lb.thisdcos.directory:9090. Depending on the network configuration of your cluster, you may need to use [dcos tunnel](/1.12/developing-services/tunnel/) to access it. You can execute the simple queries against existing metrics. 

   ![prometheus_cpu_usage](/1.12/img/prometheus_cpu_usage.png)

   Figure 1. A graph of system metrics

# Working with metrics in Grafana

Grafana exposes a single endpoint for the Grafana UI, which is shown in the `Endpoints` tab. The URL of the Grafana UI is http://grafana.grafana.l4lb.thisdcos.directory:3000. As with Prometheus, you may need to use `dcos tunnel` to access the UI. 

The default credentials for the UI are `admin:admin`. 

When you are logged in, you must do the following tasks:
- Add a datasource.
- Choose a name.
- Select the appropriate datasource type.
- Use the same URL that you had used to access the Prometheus UI.
- Keep all other fields set to their default values. 
- Click `Save and Test` button to ensure that the endpoint is working correctly. 

When you complete the above tasks, you can create a Grafana dashboard using metrics from your newly created datasource.

   ![grafana_nodes_overview](/1.12/img/grafana_nodes_overview.png)

   Figure 2. A Grafana dashboard, showing system metrics and tasks
