---
layout: layout.pug
navigationTitle:  Strategy
title: Strategy
excerpt: Tutorial - Applying troubleshooting strategies
menuWeight: 21
---
#include /include/tutorial-disclaimer.tmpl

<a name=strategy></a>

# General Strategy: Debugging Application Deployment on DC/OS

Now that we have defined a [set of tools](/1.12/tutorials/dcos-debug/tools/) for debugging applications on DC/OS, let us consider a step-by-step general troubleshooting strategy for actually implementing pir available tools in an application debugging scenario. Once we have gone over this general strategy, we will consider a few concrete scenarios of how to apply this strategy in the [practice section](/1.12/tutorials/dcos-debug/scenarios/).

Beyond considering any information special to your scenario, a reasonable approach to debugging an application deployment issue is to apply our debugging tools in the following order:

<a name="tools"></a>

- 1: [Check GUIs](#GUI-strat)
- 2: [Check Task Logs](#task-strat)
- 3: [Check Scheduler Logs](#schedule-strat)
- 4: [Check Agent Logs](#agent-strat)
- 5: [Test Task Interactively](#interactive-strat)
- 6: [Check Master Logs](#master-strat)
- 7: [Ask Community](#community-strat)


<a name="GUI-strat"></a>

### Step 1: Check the GUIs

Start by examining the [DC/OS GUI](/1.12/gui/) or use the CLI to [check the status](/1.12/deploying-services/task-handling/) of the task. If the task has an associated [health check](/1.12/deploying-services/creating-services/health-checks/), it is also a good idea to check the task’s health status.

If relevant, check the [Mesos GUI](/1.12/tutorials/dcos-debug/tools/#mesos-ui) or [Exhibitor/ZooKeeper GUI](/1.12/tutorials/dcos-debug/tools/#zoo-ui) for potentially relevant debugging information there.

<a name="task-strat"></a>

### Step 2: Check the Task Logs

If the GUIs cannot provide sufficient information, next check the [task logs](/1.12/tutorials/dcos-debug/tools/#task-logs) using the DC/OS GUI or the CLI. This provides a better understanding of what might have happened to the application. If the issue is related to our app not deploying (for example, the task status continues to wait indefinitely), try looking at the ['Debug' page](/1.12/monitoring/debugging/gui-debugging/#debugging-page). It could be helpful in understanding the resources being offered by Mesos.

<a name="schedule-strat"></a>

### Step 3: Check the Scheduler Logs

Next, when there is a deployment problem and the task logs do not provide enough information to fix the issue, it can be helpful to double-check the app definition. Then, after confirming the app definition, check the Marathon log or GUI to understand how it was scheduled or why not.

<a name="agent-strat"></a>

### Step 4: Check the Agent Logs

The [Mesos Agent logs](/1.12/tutorials/dcos-debug/tools/#mesos-agent-logs) provide information regarding how the task and that task's environment are being started. Recall that increasing the log level can be helpful in some cases to obtain more information with which to work.

<a name="interactive-strat"></a>

### Step 5: Test the Task Interactively

The next step is to [interactively look at the task running inside the container](/1.12/tutorials/dcos-debug/tools/#interactive). If the task is still running, `dcos task exec` or `docker exec` can be helpful to start an interactive debugging session. If the application is based on a Docker container image, manually starting it using `docker run` followed by `docker exec` can also get you started in the right direction.

<a name="master-strat"></a>

### Step 6: Check the Master Logs

If you want to understand why a particular scheduler has received certain resources or a particular status, then [the master logs can be very helpful](/1.12/tutorials/dcos-debug/tools/#master-logs). Recall that the master is forwarding all status updates between the agents and scheduler, so it might even be helpful in cases where the agent node might not be reachable (for example, network partition or node failure).

<a name="community-strat"></a>

### Step 7:  Ask the Community

As mentioned above, [the community can be very helpful](/1.12/tutorials/dcos-debug/tools/#community) by either using the [DC/OS Slack](http://chat.dcos.io/?_ga=2.29995196.285985511.1525709518-600356888.1525372520) or the [mailing list](https://groups.google.com/a/dcos.io/forum/#!forum/users) can be very helpful in debugging further.
