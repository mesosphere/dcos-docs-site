---
layout: layout.pug
navigationTitle:  Logging
title: Logging
menuWeight: 3
excerpt: Understanding diagnostic and status logs for DC/OS core components and services
render: mustache
model: /1.13/data.yml
beta: false
enterprise: false
---

DC/OS cluster nodes generate logs that contain diagnostic and status information for DC/OS core components and DC/OS services. DC/OS comes with a built-in log pipeline which can transmit all kinds of logs to an aggregated log database.

## Service, task, and node logs

The logging component provides an HTTP API `/system/v1/logs/` that exposes the system logs. You can access information about DC/OS scheduler services, like Marathon or Kafka, with the following CLI command:

```bash
dcos service log --follow <scheduler-service-name>
```

You can access DC/OS task logs by running this CLI command:

```bash
dcos task log --follow <service-name>
```

You access the logs for the master node with the following CLI command:

```bash
dcos node log --leader
```

To access the logs for an agent node, run `dcos node` to get the Mesos IDs of your nodes, then run the following CLI command:

```bash
dcos node log --mesos-id=<node-id>
```

You can download all the log files for your service from the **Services > Services** tab in the [DC/OS web interface](/1.13/gui/). You can also monitor `stdout`/`stderr`.

For more information, see the Service and Task Logs [quick start guide](/1.13/monitoring/logging/quickstart/).

<p class="message--note"><strong>NOTE: </strong> DC/OS can send copies of task logs to the host's journald, but this is disabled by default because of a known systemd performance problem, for details see the <a href="/1.13/installing/production/advanced-configuration/configuration-reference/#mesos-container-log-sink">configuration documentation</a></p>.

## System logs

DC/OS components use `systemd-journald` to store their logs. To access the DC/OS core component logs, [SSH into a node][5] and run this command to see all logs:

```bash
journalctl -u "dcos-*" -b
```

You can view the logs for specific [components](/1.13/overview/architecture/components/) by entering the component name. For example, to access Admin Router logs, run this command:

```bash
journalctl -u dcos-nginx -b
```

You can find which components are unhealthy in the DC/OS web interface **Nodes** tab.

![system health](/1.13/img/GUI-Nodes-Main_View_Agents-1_12.png)

Figure 1. System health log showing nodes

# Log aggregation

Streaming logs from machines in your cluster is not always the best solution for examining events and debugging issues. <!-- In cases where you need a history of what has happened, you require a method for storing and aggregating logs. DC/OS comes with a built-in log pipeline based on [Fluent Bit](https://fluentbit.io/), an open source log processor and forwarder. Fluent Bit runs on each node, both masters and agents, in DC/OS. It gathers metrics from each component by tailing logs from journald. Tasks running on Mesos can also optionally [transmit logs to Fluent Bit](/1.13/monitoring/logging/configure-task-logs/). -->Currently we suggest one of these options for log aggregation:

- [Log Management with ELK](/1.13/monitoring/logging/aggregating/elk/)
- [Log Management with Splunk](/1.13/monitoring/logging/aggregating/splunk/)


[5]: /1.13/administering-clusters/sshcluster/
