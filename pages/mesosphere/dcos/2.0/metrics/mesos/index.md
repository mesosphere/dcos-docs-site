---
layout: layout.pug
title: Mesos Metrics
navigationTitle: Mesos Metrics
menuWeight: 3
excerpt: Monitoring Mesos with Telegraf
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

The Apache&reg; Mesos&reg; input plugin in Telegraf&trade; gathers [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/) from each Mesos agent and master. The plugin is enabled by default in DC/OS&trade; 1.12 version or later.

The Mesos input plugin is controlled by an option in the `config.yaml` file called `enable_mesos_input_plugin`. To disable the plugin, `enable_mesos_input_plugin` needs to be set to `false`. Instructions on how to create a configuration file for on-prem installation can be found [here](/mesosphere/dcos/2.0/installing/production/deploying-dcos/installation/#create-a-configuration-file). To modify a configuration file on an existing on-prem cluster, you must [patch the existing DC/OS version](/mesosphere/dcos/2.0/installing/production/patching/#modifying-dcos-configuration). For cloud installations, configuration and installation instructions for each supported cloud provider can be found [here](/mesosphere/dcos/2.0/installing/evaluation/).

# Viewing metrics for Mesos masters and agents
 
You can review the complete list of the metrics produced by Mesos in the Mesos documentation on [observability metrics](http://mesos.apache.org/documentation/latest/monitoring/). You should note that the database in which metrics are stored might require the metric names to be modified. For example, the forward-slash (/) character is illegal in Prometheus metric names, so the `master/uptime_secs` name is available in Prometheus as `master_uptime_secs`. 
