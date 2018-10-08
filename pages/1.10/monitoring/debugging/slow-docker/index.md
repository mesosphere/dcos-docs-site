---
layout: layout.pug
navigationTitle:  Slow Docker Apps and Deployments
title: Slow Docker Apps and Deployments
menuWeight: 40
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


If you recently upgraded to DC/OS 1.10 or configured `MESOS_CGROUPS_ENABLE_CFS=true` in your Mesos agent configuration, you may see slow-running Docker applications or slow deployments.

# Strict CPU limitations are now default

When using Apache Mesos, you can choose to use either CPU shares or strict CPU limitations. If you use CPU shares, your task can consume more CPU cycles than initially configured in your Marathon app definition, if your host system has free CPU cycles. If you are using strict CPU limitations, your task can only consume a maximum of CPU time based on your Marathon configuration.

Completely Fair Scheduler (CFS) strict CPU limitations is the default in DC/OS, but this configuration was respected only by the Mesos executor and not by the Docker executor. The fix [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134) in the latest Mesos release, and also included in DC/OS 1.10, removes this limitation.

Your services or deployments are likely running slowly because they require more CPU cycles than they are configured to consume.

# Steps to take

## Increase CPU allocation

If you have slow-running Docker services or deployments due to DC/OS upgrade or configuring `MESOS_CGROUPS_ENABLE_CFS=true`, increase the required CPU amount in your service definition. [From the CLI](/1.10/deploying-services/update-user-service/) or the **Services** tab of the DC/OS GUI, change the `"cpus"` property of your service definition to a higher value and test if increased CPU allocation solves your issues.

## Change Mesos agent configuration

In special cases, you may want to change Mesos agent configuration to not use strict CFS CPU limitations. Consider this if the majority of your applications have a CPU peak during startup and a lower consumption afterwards, or you have other advanced CPU loads. You should only change the default behavior if you do not need strict CPU separation.

You will need to change the configurations for your DC/OS (or Mesos) installation by changing your Mesos agent configuration.

**Note:** If you are considering changing this configuration, consult the [Mesos oversubscription](http://mesos.apache.org/documentation/latest/oversubscription/) documentation for additional considerations and configuration options.


### Configuration change

1. Create or modify the file `/var/lib/dcos/mesos-slave-common` on each agent node.

1. Add or set the line `MESOS_CGROUPS_ENABLE_CFS=false`.

1. Restart the Mesos agent process with `sudo systemctl restart dcos-mesos-slave`. **Note** If this is done before installing the Mesos agent it will pick up the configuration automatically.

1. After restarting all of the Mesos agents, restart all tasks. Restarting the agent won’t cause the tasks to restart but they also won’t pick up the new setting so need to be restarted.

