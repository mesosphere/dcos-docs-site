---
layout: layout.pug
navigationTitle: Metrics
title: Metrics
menuWeight: 100
excerpt: Understanding the metrics component of DC/OS
beta: false
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

The metrics pipeline for DC/OS 1.12 is [Telegraf](/1.12/overview/architecture/components/#telegraf). Telegraf provides metrics from DC/OS cluster hosts, containers running on those hosts, and from applications running on DC/OS via `statsd`. Telegraf is natively integrated with DC/OS. By default, it exposes metrics in Prometheus format, and in JSON format via an API.

## Overview
DC/OS collects three types of metrics as follows:

* **System:** - Metrics about each node in the DC/OS cluster.
* **Container:** - Metrics about cgroup allocations from tasks running in the DC/OS [Universal Container Runtime](/1.12/deploying-services/containerizers/ucr/) or [Docker Engine](/1.12/deploying-services/containerizers/docker-containerizer/) runtime.
* **Application:** - Metrics emitted from any application running on the Universal Container Runtime.

Metrics are tagged by origin and made available in Prometheus format on `port 61091` on each node. They are also available via the DC/OS [Metrics API](/1.12/metrics/metrics-api/).

Telegraf is a metrics pipeline which is shipped as part of the DC/OS distribution to collect metrics from system, container, and application. Telegraf runs on every host in the cluster. It is designed around a pluggable architecture. Several custom plugins written especially for DC/OS provide metrics on the performance of DC/OS workloads and DC/OS itself. 

Application metrics and custom metrics emitted by DC/OS applications are collected via `statsd`. A dedicated `statsd` server is started for each new task. Any metrics received by the `statsd` server are tagged with the task name and its service name. The address of the server is provided via environment variables (`STATSD_UDP_HOST` and `STATSD_UDP_PORT`). 

For more informaiton about the list of metrics that are automatically collected by DC/OS, read [Metrics Reference](/1.12/metrics/reference/) documentation.

## Troubleshooting
Use the following troubleshooting guidelines to resolve errors:

- Metrics about Telegraf's own performance may be collected by enabling the `inputs.internal` plugin. 
- Telegraf runs as a `systemd` unit. The status of `systemd` unit may be examined via `systemctl status dcos-telegraf`. 
- Logs are available from journald via `journalctl -u dcos-telegraf`.

