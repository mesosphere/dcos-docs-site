---
layout: layout.pug
title: Mesos Metrics
navigationTitle: Mesos Metrics
menuWeight: 3
excerpt: Monitoring Mesos with Telegraf
enterprise: false
---

The Mesos input plugin in Telegraf gathers [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/) from each Mesos agent and master. The plugin is enabled by default in DC/OS 1.13 version or newer.

The Mesos input plugin is controlled by an option in the `config.yaml` file called `enable_mesos_input_plugin`. To disable the plugin, `enable_mesos_input_plugin` needs to be set to `false`. Instructions on how to create a configuration file for on-prem installation can be found [here](/1.13/installing/production/deploying-dcos/installation/#create-a-configuration-file). To modify a configuration file on an existing on-prem cluster, you must [patch the existing DC/OS version](/1.13/installing/production/patching/#modifying-dcos-configuration). For cloud installations, configuration and installation instructions for each supported cloud provider can be found [here](/1.13/installing/evaluation/).

# Viewing metrics for Mesos masters and agents
 
You can review the complete list of the metrics produced by Mesos in the Mesos documentation on [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/). You should note that the database in which metrics are stored might require the metric names to be modified. For example, the forward-slash (/) character is illegal in Prometheus metric names, so the `master/uptime_secs` name is available in Prometheus as `master_uptime_secs`. 
