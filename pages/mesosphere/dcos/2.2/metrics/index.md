---
layout: layout.pug
navigationTitle: Metrics
title: Metrics
menuWeight: 100
excerpt: Understanding the metrics component of DC/OS
render: mustache
model: /mesosphere/dcos/2.2/data.yml
beta: false
enterprise: false
---

# Overview

DC/OS includes a comprehensive metrics service, providing metrics from DC/OS cluster hosts, containers, and applications running on those hosts. It collects, tags, and transmits metrics from every node, container, and application in your DC/OS cluster. Metrics are available via the DC/OS metrics API, allowing for easy integration with a wide range of monitoring solutions.

# Types of Metrics

DC/OS collects four types of metrics as follows:

- **System:** Metrics about each node in the DC/OS cluster.
- **Component:** Metrics about the components which make up DC/OS.
- **Container:** Metrics about `cgroup` allocations from tasks running in the DC/OS [Universal Container Runtime](/mesosphere/dcos/2.2/deploying-services/containerizers/ucr/) or [Docker Engine](/mesosphere/dcos/2.2/deploying-services/containerizers/docker-containerizer/) runtime.
- **Application:** Metrics emitted from any application running on the Universal Container Runtime.

# Operations on Metrics

You can perform the following operations on Metrics:

1. **Adding Metrics:** You can add custom metrics to the DC/OS metrics service from your applications. DC/OS metrics listens for `StatsD` metrics from every application running with the Mesos containerizer. A `StatsD server` is exposed for each container, which allows you to tag all metrics by origin. Its address is available to the application by injecting the standard environment variables `STATSD_UDP_HOST` and `STATSD_UDP_PORT`.

   Alternatively, you can serve metrics in Prometheus format by exposing an according endpoint. To notify the metrics service that your task is serving Prometheus metrics you need to add at least one port with the label `DCOS_METRICS_FORMAT=prometheus`. According ports will then be scraped once per minute for the task's lifetime.
   Metrics collected in this manner will be tagged with the originating task's and its framework name.

   Here's an example app definition with a port definition that has the aforementioned label and a `cmd` to expose some `/metrics`.

   ```json
   {
     "id": "/metrics-example-app",
     "portDefinitions": [
       {
         "name": "prometheus",
         "port": 0,
         "labels": { "DCOS_METRICS_FORMAT": "prometheus" }
       }
     ],
     "container": {
       "type": "MESOS",
       "docker": { "image": "python:3" }
     },
     "cpus": 0.1,
     "mem": 128,
     "cmd": "echo \"# TYPE test_metric untyped\ntest_metric 123456\n\" > metrics;\npython3 -m http.server $PORT0\n"
   }
   ```

   When the above example is running, you can obtain the `test_metric` by either requesting the endpoint within the cluster directly - e.g. via `curl alertmanager.prometheus.l4lb.thisdcos.directory:9093/metrics` - or using `dcos task metrics details <TASK_ID>`. The output of the latter should look similar to the following. Note `test_metric` in the last line.

   ```
   NAME VALUE
   mem.cache_bytes 1794048
   mem.file_bytes 1794048
   cpus.user_time_secs 0.49
   cpus.throttled_time_secs 1.57
   cpus.system_time_secs 0.13
   mem.total_bytes 25055232
   perf.timestamp 1561374937.08
   mem.anon_bytes 20635648
   cpus.nr_throttled 20
   mem.limit_bytes 167772160
   mem.rss_bytes 20635648
   cpus.nr_periods 3230
   cpus.limit 0.20
   test_metric 123456
   ```

   For more information, read the documentation on [how to add custom metrics into the DC/OS metrics API using Python](https://mesosphere.com/blog/custommetrics/).

2. **Tagging Metrics:** The tags are automatically added to the metrics in order to identify, support easy drill-down, filter, and group metrics data. The tags are not limited to the following list:

   - Container identification (for all container and application metrics): container_id, executor_id, framework_id, framework_name
   - Application identification (e.g., for Marathon apps): application_name
   - System identification: agent_id
     Example: An administrator can identify the group of metrics based on the following tags:
     - `agent_id` - Detects a situation which is system-specific (e.g., a faulty disk).
     - `framework_id` - Detects which Mesos frameworks are using the most resources in the system.
     - `container_id` - Shows the same information except with per-container granularity.

3. **Forwarding Metrics:** After you have collected the metrics from the applications and hosts, it can be forwarded to various metrics stores. Configure Telegraf plugin to forward the metrics data from the cluster.

4. **Monitoring and Visualizing Metrics:** It is recommended to install the DC/OS Monitoring service to monitor and visualize metrics in your DC/OS cluster. See the [service documentation](/mesosphere/dcos/services/dcos-monitoring/1.0.0/operations/install/) for instructions on how to install and use the service.

# Telegraf

Metrics in DC/OS 1.12 and newer versions use [Telegraf](/mesosphere/dcos/2.2/overview/architecture/components/#telegraf) to collect and process data. Telegraf provides a plugin-driven architecture. The custom DC/OS plugins provide metrics on the performance of DC/OS workloads and DC/OS itself. Telegraf provides metrics from DC/OS cluster hosts, containers running on those hosts, and from applications running on DC/OS using the `StatsD` process. It is natively integrated with DC/OS. By default, it exposes metrics in Prometheus format from `port 61091` on each node, and in JSON format through the DC/OS [Metrics API](/mesosphere/dcos/2.2/metrics/metrics-api/). Telegraf is included in the DC/OS distribution and runs on every host in the cluster.

## Using Telegraf

Telegraf collects application and custom metrics through the `dcos_statsd` plugin. A dedicated `StatsD` server is started for each new task. Any metrics received by the `StatsD` server are tagged with the task name and its service name. The address of the server is provided by environment variables (`STATSD_UDP_HOST` and `STATSD_UDP_PORT`).

<p class="message--note"><strong>NOTE: </strong>When a task is completed, metrics that are emitted but not gathered by Telegraf will be discarded.</p>

The metrics collected by `dcos_statsd` are gathered every 30 seconds. The task must run for at least 30 seconds to ensure a task's metrics are gathered.

For more information about the list of metrics that are automatically collected by DC/OS, read [Metrics Reference](/mesosphere/dcos/2.2/metrics/reference/) documentation.

# Troubleshooting

Use the following troubleshooting guidelines to resolve errors:

- You can collect metrics about Telegraf's own performance by enabling the `inputs.internal` plugin.
- You can check the status of the Telegraf `systemd` unit by running `systemctl status dcos-telegraf`.
- Logs are available from journald via `journalctl -u dcos-telegraf`.
