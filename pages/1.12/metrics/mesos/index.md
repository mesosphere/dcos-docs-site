---
layout: layout.pug
title: Enable Mesos Metrics
navigationTitle: Enable Mesos Metrics
menuWeight: 3
excerpt: Monitoring Mesos with Telegraf
enterprise: false
---

You can configure DC/OS, version 1.12 or newer, to gather [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/) from each Mesos agent and master. 

The Mesos input plugin in Telegraf is controlled by an option in the `config.yaml` file called `enable_mesos_input_plugin`. To enable the plugin, `enable_mesos_input_plugin` needs to be set to `true` (it is currently defaulted to `false`). Instructions on how to create a configuration file for on-prem installation can be found [here](/1.12/installing/production/deploying-dcos/installation/#create-a-configuration-file). To modify a configuration file on an existing on-prem cluster, you must [patch the existing DC/OS version](/1.12/installing/production/patching/#modifying-dcos-configuration). For cloud installations, configuration and installation instructions for each supported cloud provider can be found [here](/1.12/installing/evaluation/).

# Viewing metrics for Mesos masters and agents
 
You can review the complete list of the metrics produced by Mesos in the Mesos documentation on [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/). You should note that the database in which metrics are stored might require the metric names to be modified. For example, the forward-slash (/) character is illegal in Prometheus metric names, so the `master/uptime_secs` name is available in Prometheus as `master_uptime_secs`. 
