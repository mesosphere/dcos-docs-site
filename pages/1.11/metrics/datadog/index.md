---
layout: layout.pug
title: Sending DC/OS Metrics to Datadog
menuWeight: 3
excerpt: Sending DC/OS metrics to Datadog
beta: false
enterprise: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


The Datadog metrics plugin supports sending metrics from the DC/OS metrics service directly to [DatadogHQ](https://www.datadoghq.com/). The plugin includes the function of the Datadog agent. You must install a plugin on each node in your cluster. This plugin works with DC/OS 1.9.4 and later.

**Prerequisite:**

- You must have the [DC/OS CLI installed](/1.11/cli/install/) and be logged in as a superuser via the `dcos auth login` command.

# Install the DC/OS Datadog metrics plugin

For each node in your cluster, transfer your plugin binary and then add a `systemd` unit to manage the service. This unit differs slightly between master and agent nodes.

1. On every node in your cluster:

   1. Download the latest Datadog plugin binary from downloads.mesosphere.io: [datadog-plugin](https://downloads.mesosphere.io/dcos-metrics/plugins/datadog)
   1. Rename the plugin to `dcos-metrics-datadog` and move to `/opt/mesosphere/bin`.
   1. Assign permissions to the plugin: `chmod 0755 /opt/mesosphere/bin/dcos-metrics-datadog`.

1.  On every master node:
    1. Download the plugin `systemd` service file from downloads.mesosphere.io: [datadog-plugin.service](https://downloads.mesosphere.io/dcos-metrics/plugins/datadog.service)
    1. Copy the service file to `/etc/systemd/system/dcos-metrics-datadog.service`. Edit it, ensure that the role flag is set to 'master', and fill in your [Datadog API key](https://app.datadoghq.com/account/settings#api)

        ```
        [Unit]
        Description=DC/OS Metrics Datadog Plugin

        [Service]
        ExecStart=/opt/mesosphere/bin/dcos-metrics-datadog -dcos-role master -datadog-key <Datadog_API_key>
        ```

    2. Reload the `systemd` state by running `sudo systemctl daemon-reload`.
    3. Start the `systemd` service with `sudo systemctl start dcos-metrics-datadog`.
    4. Use the command  `sudo journalctl -u dcos-metrics-datadog` to view the system logs and verify that the plugin is running.

1.  On every agent node:
    1. Download the plugin `systemd` service file from downloads.mesosphere.io: [datadog-plugin.service](https://downloads.mesosphere.io/dcos-metrics/plugins/datadog.service)
    1. Copy the service file to `/etc/systemd/system/dcos-metrics-datadog.service`. 
    1. Edit it and ensure that the role flag is set to 'agent', and fill in your [Datadog API key](https://app.datadoghq.com/account/settings#api)

        ```
        [Unit]
        Description=DC/OS Metrics Datadog Plugin

        [Service]
        ExecStart=/opt/mesosphere/bin/dcos-metrics-datadog -dcos-role agent -datadog-key  <Datadog_API_key>
        ```

    3. Reload the `systemd` state by running `sudo systemctl daemon-reload`.
    4. Start the `systemd` service with `sudo systemctl start dcos-metrics-datadog`.
    5. View the system logs and verify the plugin is running with `sudo journalctl -u dcos-metrics-datadog`.
