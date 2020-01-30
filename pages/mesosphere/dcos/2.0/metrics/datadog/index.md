---
layout: layout.pug
title: Export DC/OS Metrics to Datadog
navigationTitle: Export DC/OS Metrics to Datadog
menuWeight: 4
excerpt: Sending DC/OS metrics to Datadog
render: mustache
model: /mesosphere/dcos/2.0/data.yml
beta: true
---


DC/OS&trade; 1.12 and later sends metrics using [Telegraf&trade;](/mesosphere/dcos/2.0/overview/architecture/components/#telegraf), which may be configured to export metrics to Datadog. There is no need to install a metrics plugin, as in DC/OS 1.9, 1.10, and 1.11. This page explains how to add the appropriate configuration to DC/OS.


**Prerequisite:**

- You must have the [DC/OS CLI installed](/mesosphere/dcos/2.0/cli/install/) and be logged in as a superuser via the `dcos auth login` command.

# Configuring Telegraf to export metrics to Datadog

1. Create a file named `datadog.conf` with the following content:

    ```sh
    # Transmit all metrics to Datadog
    [[outputs.datadog]]
      ## Datadog API key
      apikey = "my-secret-key"
      ## Connection timeout
      # timeout = "5s"
    ```

1. Replace the `apikey` value with your Datadog API key.

1. On every node in your cluster, do the following tasks:

   1. Upload the `datadog.conf` file to `/var/lib/dcos/telegraf/telegraf.d/datadog.conf`.
   1. Restart the Telegraf process with your new configuration by running `sudo systemctl restart dcos-telegraf` command.
   1. Check the Datadog UI to see the incoming DC/OS metrics. 
