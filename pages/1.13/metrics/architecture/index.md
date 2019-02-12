---
layout: layout.pug
title: Metrics Plugin Architecture
navigationTitle: Metrics Plugin Architecture
menuWeight: 0
excerpt: How DC/OS collects and publishes metrics
enterprise: false
---

Metrics in DC/OS, version 1.12 and newer, are based on [Telegraf](https://github.com/dcos/telegraf). Telegraf provides an agent-based service that runs on each master and agent node in a DC/OS cluster. By default, Telegraf gathers metrics from all of the processes running on the same node, processes them, then sends the collected information to a central metrics database. 

Telegraf has a plugin-driven architecture. The plugin architecture enables Telegraf to collect information from any supported input plugin and write results to any supported output plugin. The plugins are compiled into the Telegraf binary for execution, and you can selectively enable and customize plugins using configuration file options. 

By default, DC/OS enables the following Telegraf plugins:

 1. `system` input plugin collects information about the node, for example, CPU, memory, and disk usage.
 1. `statsd` input plugin collects `statsd` metrics from DC/OS components.
 1. `prometheus` input plugin collects metrics from DC/OS components and `mesos` tasks.
 1. `mesos` input plugin collects metrics about the `mesos` process itself.
 1. `dcos_statsd` input plugin starts a new `statsd` server for each `mesos` task.
 1. `dcos_containers` collects resource information about containers from the `mesos` process.
 1. `override` plugin is used to add **node-level** metadata, for example, the cluster name.
 1. `dcos_metadata` plugin is used to add **task-level** metadata, for example, the executor name and task name.
 1. `dcos_metrics` output plugin serves the `dcos-metrics` JSON API, which is used by the CLI.
 1. `prometheus_client` output plugin serves metrics in Prometheus format.

When Telegraf starts on a node, it loads a configuration file and the contents of a configuration directory or directories. You can specify the plugins you want to enable by creating a configuration file with the appropriate settings and copying the file into the `/var/lib/dcos/telegraf/telegraf.d` directory before restarting Telegraf. Only files ending with `.conf` will be included in the Telegraf configuration. Note: Any mistakes in the configuration files will prevent Telegraf from starting up successfully.

Telegraf abstracts the complexity of collecting metrics from every process running in the cluster by providing a single source for metrics on each node. Telegraf also adds identifying metadata--such as the originating task name--to the metrics it collects to make the metric more human-readable. Without this metadata, metrics for tasks running on Mesos would be difficult to identify by their originating container ID, which is a long random hash. 

The [DC/OS fork of Telegraf](https://github.com/dcos/telegraf) includes technical documentation and sample configurations for each plugin.
