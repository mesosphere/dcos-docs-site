---
layout: layout.pug
title: Enable Mesos Metrics
navigationTitle: Enable Mesos Metrics
menuWeight: 3
excerpt: Monitoring Mesos with Telegraf
enterprise: false
---

DC/OS 1.12's metrics pipeline can be configured to gather [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/) from each Mesos agent and master. This page explains how to add the appropriate configuration to DC/OS.

<p class="message--note"><strong>NOTE: </strong>This functionality is experimental, and modifying files in `/opt/mesosphere` is not supported. </p>


**Prerequisite:**

- You must have the [DC/OS CLI installed](/1.12/cli/install/) and be logged in as a superuser via the `dcos auth login` command.

# Configuring Telegraf to collect metrics from Mesos masters

1. Create a file named `mesos-master.conf` with the following content:

    ```
    # Gathers all Mesos metrics
    [[inputs.mesos]]
      # The interval at which to collect metrics
      interval = "60s"
      # Timeout, in ms.
      timeout = 30000
      # A list of Mesos masters.
      masters = ["http://$DCOS_NODE_PRIVATE_IP:5050"]
    ```

1. On every master node in your cluster, do the following tasks:

   1. Upload the `mesos-master.conf` file to `/opt/mesosphere/etc/telegraf/telegraf.d/mesos-master.conf`.
   1. Restart the Telegraf process with your new configuration by running `sudo systemctl restart dcos-telegraf` command.

1. Create a file named `mesos-agent.conf` with the following content:

    ```
    # Gathers all Mesos metrics
    [[inputs.mesos]]
      # The interval at which to collect metrics
      interval = "60s"
      # Timeout, in ms.
      timeout = 30000
      # A list of Mesos slaves.
      slaves = ["http://$DCOS_NODE_PRIVATE_IP:5051"]
    ```

1. On every agent node in your cluster, do the following tasks:

   1. Upload the `mesos-agent.conf` file to `/opt/mesosphere/etc/telegraf/telegraf.d/mesos-agent.conf`.
   1. Restart the Telegraf process with your new configuration by running `sudo systemctl restart dcos-telegraf` command.

 
A complete list of the metrics produced by Mesos can be found in the Mesos documentation on [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/). Mesos metric names may be modified by the TSDB in which they are stored. For example, the forward-slash character is illegal in Prometheus metric names; the `master/uptime_secs` name is therefore available in Prometheus as `master_uptime_secs`. 

