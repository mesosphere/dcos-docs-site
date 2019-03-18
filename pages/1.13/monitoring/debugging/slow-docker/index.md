---
layout: layout.pug
navigationTitle:  Slow Docker Apps and Deployments
title: Slow Docker Apps and Deployments
menuWeight: 40
excerpt: Troubleshooting slow Docker apps and deployments

enterprise: false
---

<p class="message--note"><strong>NOTE: </strong>If you recently upgraded to DC/OS 1.10 or later, and configured <code>MESOS_CGROUPS_ENABLE_CFS=true</code> in your Mesos agent configuration, you may see slow-running Docker applications or slow deployments.</p>

# Strict CPU limitations are now default

The Apache Mesos kernel of DC/OS allows you to use either Completely Fair Scheduler strict CPU limitations (CFS CPU) or CPU shares. By default strict CPU limitations are used in DC/OS from version 1.10 onward in order to achieve better performance in high density use cases. However, in some use cases it is desirable to be able to offer up available CPU cycles to apps that take priority. Using CPU shares, DC/OS can be configured to allow Marathon apps to consume more CPU cycles than in their original app definition.

Your services or deployments are likely running slowly because they require more CPU cycles than they are configured to consume. 

# Steps to take

## Increase CPU allocation

If you have slow-running Docker services or deployments on DC/OS 1.10 or later, increase the required CPU amount in your service definition. [From the CLI](/1.13/deploying-services/update-user-service/) or the [Services](/1.13/gui/services/) tab of the DC/OS GUI, change the `cpus` property of your service definition to a higher value and test if increased CPU allocation solves your issues.

## Boost resources using DC/OS Pods

Often, containerized applications have resource-intensive startup phases. Traditionally, tasks with high startup requirements were simply allocated extra resources for the duration of their lifetime, at the cost of lower cluster utilization once those resources were no longer needed. By taking advantage of the resource accounting strategy of DC/OS Pods, an "empty" startup container/task can be created to request additional resources and leave them available to the task that actually needs them, then complete and relinquish those resources after a reasonable time has passed. See this [blog post on resource boosting](https://mesosphere.com/blog/application-jvm-startup/) for more information and a sample pod definition.

## Change Mesos agent configuration

In special cases, you may want to change your Mesos agent configuration to not use strict CFS CPU limitations. Consider this if the majority of your applications have a CPU peak during startup and a lower consumption afterwards, or you have other advanced CPU loads. You should only change the default behavior if you do not need strict CPU separation.

You will need to change the configurations for your DC/OS (or Mesos) installation by changing your Mesos agent configuration. If you are considering changing this configuration, consult the [Mesos oversubscription](http://mesos.apache.org/documentation/latest/oversubscription/) documentation for additional considerations and configuration options.

### Configuring the agents to use CPU shares

1. Create or modify the file `/var/lib/dcos/mesos-slave-common` on each agent node.

1. Add or set the line `MESOS_CGROUPS_ENABLE_CFS=false`.

1. Restart the Mesos agent process with `sudo systemctl restart dcos-mesos-slave`. If this is done before installing the Mesos agent it will pick up the configuration automatically.

1. After restarting all of the Mesos agents, restart all tasks. Restarting the agent will not cause the tasks to restart but they also will not pick up the new settings, so they must be restarted.

