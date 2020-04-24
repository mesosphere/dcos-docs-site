---
layout: layout.pug
navigationTitle: Monitoring 
title: Monitoring 
menuWeight: 20
excerpt: Guide of basic Monitoring of the Mixed OS DC/OS cluster
model: /mesosphere/dcos/2.1/data.yml
render: mustache
---

# Monitoring 

<p class="message--important"><strong>IMPORTANT: </strong>We strongly recommend that you read the [DC/OS Metrics Plug-In Architecture](/mesosphere/dcos/2.0/metrics/architecture/) content before continuing.</p>

The monitoring workflow for DC/OS for Windows Beta is enabled and is similar to DC/OS monitoring for Linux and Windows nodes. When you install DC/OS Monitoring on a Linux bootstrap node, Prometheus and Grafana are automatically installed. Prometheus collects the metrics from each of the Telegraf services in the cluster.

Telegraf provides an agent-based service that runs on the agent node in a DC/OS cluster, and is the main tool for metrics aggregation on a Windows node. By default, Telegraf:
- Gathers metrics from all of the processes running on the same node.
- Processes the metrics.
- Sends the collected information to a central metrics database.

You can then display the metrics in Grafana.

By default, DC/OS on Windows node enables the following Telegraf plugins:

| Plugin            | Description                                                     |
|-------------------|:----------------------------------------------------------------------------------------------------------|
| CPU               | The CPU input plug-in gathers metrics about cpu usage                                                     |
| mem               | The mem input plug-in collects system memory metric                                                       |
| disk              | The disk input plug-in gathers metrics about disk usage by the mount point                                |
| net               | The Net input plug-in gathers metrics about network interface usage (Linux only)                          |
| win_perf_counters | The Windows Performance Counters input plug-in reads Performance Counters on the Windows operating system |
| system            | The System input plug-in gathers general stats on system load, uptime, and number of users logged in      |
| internal          | The mem input plug-in collects system memory metric                                                       |
| docker            | The Docker input plug-in uses the Docker Engine API to gather metrics on running Docker containers        |
| mesos             | The Apache Mesos input plug-in gathers metrics from Mesos                                                 |
| prometheus_client | Output plug-in serves metrics in Prometheus format.                                                       |

## Install dcos-monitoring

The [dcos/telegraf](https://github.com/dcos/telegraf) fork includes content and sample configurations for each default Telegraf plug-in.

- Install the dcos-monitoring application from the Catalog.

![dcos-monitoring](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/dcos-mon.png)

- After installation, you will be able to use the Grafana dashboard. Grafana allows you to query, visualize, alert on, and understand your metrics.
You will see:

![grafana](/mesosphere/dcos/2.1/tutorials/windows/upgrade/img/grafana.png)
