---
layout: layout.pug
title: The Metrics Pipeline
navigationTitle: The Metrics Pipeline
menuWeight: 3
excerpt: How DC/OS manages metrics
enterprise: false
---

DC/OS 1.12's metrics pipeline is based on [Telegraf](https://github.com/dcos/telegraf).

Telegraf runs on each node in a DC/OS cluster, both masters and agents. By default, it gathers metrics from processes running on the same node, processes them, and sends them on to a central metrics database. 

Telegraf has a plugin-driven architecture, and many plugins are available. Telegraf plugins are included at compile-time, and enabled via configuration files. By default, DC/OS' Telegraf enables the following plugins:

 1. `system` input plugin collects information about the node, eg CPU, memory, and disk usage.
 1. `statsd` input plugin collects statsd metrics from DC/OS components.
 1. `prometheus` input plugin collects metrics from DC/OS components and mesos tasks.
 1. `mesos` input plugin collects metrics about the mesos process.
 1. `dcos_statsd` input plugin starts a new statsd server for each mesos task.
 1. `dcos_containers` collects resource information about containers from mesos.
 1. `override` plugin is used to add node-level metadata, eg cluster name.
 1. `dcos_metadata` plugin is used to add task-level metadata, eg executor name and task name.
 1. `dcos_api` output plugin serves the dcos-metrics JSON API, used by the CLI.
 1. `prometheus_client` output plugin serves metrics in Prometheus format.

Telegraf loads a configuration file and the contents of a configuration directory when it starts. Plugins may be enabled by creating the appropriate configuration and dropping it into `/opt/mesosphere/etc/telegraf/telegraf.d`, before restarting Telegraf. 

The Telegraf pipeline is intended to abstract the complexity of collecting metrics from every process running in the cluster. It does this by providing a single source for metrics of all kinds on each node. It also resolves the identity of metrics arriving from tasks running on Mesos. These metrics are often identified by nothing more than their originating container ID, a long random hash. The Telegraf pipeline adds metadata such as the originating task name , in order to make them human-readable. 

The [DC/OS fork of Telegraf](https://github.com/dcos/telegraf) includes technical documentation and sample configurations for each plugin.
