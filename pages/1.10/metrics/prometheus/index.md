---
layout: layout.pug
title: Sending DC/OS Metrics to Prometheus
menuWeight: 4.5
excerpt:
enterprise: false
---

The Prometheus metrics plugin supports sending metrics from the DC/OS metrics service to a [Prometheus](https://prometheus.io/) server. You must install a plugin on each node in your cluster. 

**Prerequisite:**

- You must have the [DC/OS CLI installed](/1.10/cli/install/) and be logged in as a superuser via the `dcos auth login` command.

# Install the DC/OS Prometheus metrics plugin

For each node in your cluster, download the plugin binary and then add a systemd unit to manage the service. This unit differs slightly between master and agent nodes.

1. On every node in your cluster:

   1. Download the latest Prometheus plugin binary from downloads.mesosphere.io: [prometheus-plugin](https://downloads.mesosphere.io/dcos-metrics/plugins/prometheus)
   1. Rename the plugin to `dcos-metrics-prometheus` and move to `/opt/mesosphere/bin`.
   1. Assign permissions to the plugin: `chmod 0755 /opt/mesosphere/bin/dcos-metrics-prometheus`.

1.  On every master node do the following steps:
    1. Download the plugin systemd service file from downloads.mesosphere.io: [prometheus-plugin.service](https://downloads.mesosphere.io/dcos-metrics/plugins/prometheus.service).
    1. Copy the service file to `/etc/systemd/system/dcos-metrics-prometheus.service`. Edit it and ensure that the dcos-role flag is set to 'master'.

        ```
        [Unit]
        Description=DC/OS Metrics Prometheus Plugin

        [Service]
        ExecStart=/opt/mesosphere/bin/dcos-metrics-prometheus --dcos-role master --prometheus-port 61091
        ```

    2. Reload the systemd state by running `sudo systemctl daemon-reload`.
    3. Start the systemd service with `sudo systemctl start dcos-metrics-prometheus`.
    4. View the system logs and verify the plugin is running with `sudo journalctl -u dcos-metrics-prometheus`.

1.  On every agent node do the following steps:
    1. Download the plugin systemd service file from downloads.mesosphere.io: [prometheus-plugin.service](https://downloads.mesosphere.io/dcos-metrics/plugins/prometheus.service)
    1. Copy the service file to `/etc/systemd/system/dcos-metrics-prometheus.service`. Edit it and ensure that the dcos-role flag is set to 'agent'.

        ```
        [Unit]
        Description=DC/OS Metrics Prometheus Plugin

        [Service]
        ExecStart=/opt/mesosphere/bin/dcos-metrics-prometheus --dcos-role agent --prometheus-port 61091
        ```

    2. Reload the systemd state by running `sudo systemctl daemon-reload`.
    3. Start the systemd service with `sudo systemctl start dcos-metrics-prometheus`.
    4. View the system logs and verify the plugin is running with `sudo journalctl -u dcos-metrics-prometheus`.

# Run a Prometheus server on DC/OS

There are several ways to run a Prometheus server. The simplest way to get started with self-hosted metrics on DC/OS is listed below:

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
described in the [quickstart](/1.10/metrics/quickstart/) documentation will allow you to query for `statsd_tester_time_uptime`, which should yield a graph that
looks like this:

   ![statsd_tester_time_uptime](/1.10/img/statsd_tester_time_uptime.png)

# Working with metrics in Grafana

You can find the Grafana UI similarly to the Prometheus UI, by hovering your cursor over the grafana application in the 'monitoring' folder and clicking on the
link that appears. Adding a Prometheus datasource on http://localhost:9090 called DC/OS Metrics will allow you to build dashboards with data from DC/OS. 
