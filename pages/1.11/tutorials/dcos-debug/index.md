---
layout: layout.pug
title: Debugging Applications on DC/OS
excerpt: DC/OS is a powerful platform for deploying and managing applications, but what can you do if your app is failing to deploy as expected?
menuWeight: 55
---

<!-- i. Support Disclaimer -->

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>Important:</b> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is to demonstrate capabilities, and may not be suited for use in a production environment. Before using a similar solution in your environment, you must adapt, validate, and test.</td> </tr> </table>

<!-- ii. Intro/Set Expectations for this Tutorial -->

DC/OS provides a platform for running complex distributed systems both for Big Data applications and also custom containerized applications. But what happens if your application keeps failing? Debugging applications in distributed systems is always difficult. So while DC/OS provides a number of tools for debugging, it might be difficult to choose which of these tools to apply in which situation.

This tutorial only aims to provide a top-down introduction to debugging applications during and after their deployment on DC/OS. As such, it should not be considered an exhaustive resource for debugging on DC/OS, but rather a starting point.

You should have a working knowledge of DC/OS in order to complete this tutorial. However, if needed there are plenty of other [tutorials to get you up and running](/1.11/tutorials/).

It is helpful to keep in mind that failures are to be expected when working with distributed systems. Many components must be configured to work together, and this takes detailed preparation and awareness during installation and initial configuration. Fortunately, it also means a few of the most important steps can be taken care of before any debugging is necessary:

- [Design your applications for debuggability](https://schd.ws/hosted_files/mesosconeu17/a6/MesosCon%20EU%202017%20University%20Slides.pdf)
- [Follow best practices for deployments](https://mesosphere.com/blog/improving-your-deployments/)
- [Set up monitoring and alerts so you can resolve issues as early as possible](https://docs.mesosphere.com/1.10/cli/command-reference/dcos-node/dcos-node-diagnostics/)

 We will first look at [some potential problems](#problems) you might face when deploying an application on DC/OS. Next, we will look at the [standard set of tools](#tools) for debugging. Then, after introducing [a general strategy for using those tools](#strategy), we have two [concrete examples](#hands-on) to illustrate how the strategy works in practice.

We encourage everyone to first try debugging these challenges yourself, but we also provide detailed guidance for debugging them.

<!-- I. Problems Section -->

<a name="problems"></a>

# Problems with Application Deployment

The range of problems that can be encountered and require debugging is far too large to be covered in a single blog-post. Some of the problems that may need troubleshooting on DC/OS include applications:

- Not deploying at all
- Deploying very slowly
- Deploying but do not start correctly (or behave incorrectly)
- Restarting repeatedly
- Not being reachable inside (or outside) of the DC/OS cluster

DC/OS consists of [a number of different components](https://docs.mesosphere.com/1.11/overview/architecture/components/) - most notably [Apache Mesos](http://mesos.apache.org/) and [Marathon](https://mesosphere.github.io/marathon/). As any of these components could be involved in the issue you are encountering, it might be difficult to even locate the component causing the issue. Accordingly, this tutorial aims to cover several types of such issues.

Of course, there are a myriad of other potential sorts of problems that can affect your cluster besides application-related failures: networking problems, DC/OS installation issues, and DC/OS internal configuration issues could each be causing issues on your cluster. These are unfortunately out of scope for this tutorial, but we encourage you to reach out via our [Community channels](https://dcos.io/community/) with ideas and feedback.

<!-- II. Tools Section -->

<a name="tools"></a>

# Tools for Debugging Application Deployment on DC/OS

DC/OS comes with a number of tools for debugging. In this section, we look at the relevant tools for application debugging:

- [DC/OS UIs](#dcos-uis)

- [Logs](#logs)

- [Metrics](#metrics)

- [Debugging Tasks Interactively](#interactive)

- [HTTP Endpoints](#endpoints)

- [Community](#community-tool)

- [Other tools](#other-tools)

<a name="dcos-uis"></a>

## DC/OS UIs

While DC/OS provide a set of different UIs for various components, these are particularly applicable for debugging application deployment issues:

- [DC/OS UI](#dcos-ui)

- [Mesos UI](#mesos-ui)

- [Zookeeper/Exhibitor UI](#zoo-ui)

<a name="dcos-ui"></a>

### DC/OS UI

The **DC/OS UI** is a great place to start debugging as it provides quick access to:

- **Cluster Resource Allocation** to provide an overview of available cluster resources
- **Task Logs** to provide insight into tasks failures
- **Task Debug Information** to provide information about the most recent task offers and/or why a task did not start

[Pic of DC/OS UI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-21.png)

<a name="mesos-ui"></a>

### Mesos UI

Despite the DC/OS UI showing most of the information that you’d need for debugging, sometimes accessing the Mesos UI itself can be helpful, for example when checking failed tasks or registered frameworks. The Mesos UI can be accessed via `https://<cluster-address>/mesos`.

[Pic of Mesos UI](https://mesosphere.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-15-at-17.56.16.png)

<a name="zoo-ui"></a>

### ZooKeeper UI

As much of the cluster and framework state is stored in Zookeeper, it can be helpful to check its state. This can be done by using Exhibitor UI via `https://<cluster-address>/exhibitor`. This is particularly helpful as frameworks such as Marathon, Kafka, Cassandra, as many store information in Zookeeper. A failure during uninstalling of one of those frameworks might leave entries behind. So then, if you experience difficulties when reinstalling a framework you have uninstalled earlier, this UI is worth checking.

[Pic of ZooKeeper/Exhibitor UI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-13.png)

<a name="logs"></a>

## Logs

Logs are useful tools to see events and conditions that occurred before the problem. Very often logs include error messages that shed light on the cause of the error. As logging is an important topic, we also recommend to have a look at the [DC/OS logging documentation](/1.11/monitoring/logging/#system-logs), for more information.

DC/OS has a number of different sources for logs, including these which we will look at more detail below:

- [Task/Application Logs](#tasks-logs)
- [Service Scheduler Logs](#scheduler-logs) (e.g., Marathon)
- [Mesos Agent Logs](#agent-logs)
- [Mesos Master Logs](#master-logs)
- [System Logs](#system-logs)

DC/OS unifies these different logs and makes them accessible via different options: the DC/OS UI, the DC/OS CLI, or HTTP endpoints. Also logs are log-rotated by default in order to avoid filling all available disk space.

**Tip** If you require a scalable way to manage and search your logs it might be worth building an [ELK stack for log aggregation and filtering](/1.11/monitoring/logging/aggregating/filter-elk/).

Also, as with other systems, in some cases it is helpful to increase the level of detail written to the log temporarily to obtain detailed troubleshooting information. For most components this can be done by accessing an endpoint. For example, if you want to increase [the log level of a Mesos Agent](http://mesos.apache.org/documentation/latest/endpoints/logging/toggle/) for 5 minutes after the server receives the API call, you could simply follow something like this two step process:

##### Connect to Master Node

```bash
$ dcos node ssh --master-proxy --leader
```

##### Raise Log Level on Mesos Agent 10.0.2.219

```bash
$ curl -X POST 10.0.2.219:5051/logging/toggle?level=3&duration=5mins
```

<a name="task-logs"></a>

### Task/Application Logs

Task/application logs are often helpful in understanding the state of the application.

By default applications logs are written (together with execution logs) to the `STDERR` and `STDOUT` files in the task workdirectory. When looking at the task in the DC/OS UI you can just simply view the logs as shown below.

[Pic of task log](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-16.png)

You can also do the same from the DC/OS CLI:

```bash
$ dcos task log --follow <service-name>
```

<a name="scheduler-logs"></a>

### Scheduler/Marathon Logs

Recall that the scheduler matches tasks to available resources and [Marathon](https://mesosphere.github.io/marathon/) is our default scheduler when starting an application. Scheduler logs, and Marathon logs in particular, are a great source of information to help you understand why and how something was scheduled (or not) on which node. The scheduler also receives task status updates, so the log also contains detailed information about task failures.

You can retrieve and view a scheduler log about a specific service through the list of services found in the DC/OS UI, or via the following command:

```bash
$ dcos service log --follow <scheduler-service-name>
```

Note that as Marathon is the “Init” system of DC/OS and hence is running as SystemD unit (same of the other system components). You need the CLI command to access its logs.

<a name="agent-logs"></a>

### Mesos Agent Logs

Mesos agent logs are a helpful tool for understanding how an application was started by the agent and also why it might have failed. You can launch the Mesos UI using  https://<cluster_name>/mesos and examine the agent logs as shown below, or use `dcos node log --mesos-id=<node-id>` from the DC/OS CLI, where you can find the corresponding `node-id` dcos node. Enter:

```bash
$ dcos node
```

where you will see something similar to the following output:

```bash
HOSTNAME        IP                         ID                    TYPE

10.0.1.51    10.0.1.51   ffc913d8-4012-4953-b693-1acc33b400ce-S3  agent

10.0.2.50    10.0.2.50   ffc913d8-4012-4953-b693-1acc33b400ce-S1  agent

10.0.2.68    10.0.2.68   ffc913d8-4012-4953-b693-1acc33b400ce-S2  agent

10.0.3.192   10.0.3.192  ffc913d8-4012-4953-b693-1acc33b400ce-S4  agent

10.0.3.81    10.0.3.81   ffc913d8-4012-4953-b693-1acc33b400ce-S0  agent

master.mesos.  10.0.4.215    ffc913d8-4012-4953-b693-1acc33b400ce   master (leader)
```

Then, in this example, you could enter:

```bash
$ dcos node log --mesos-id=ffc913d8-4012-4953-b693-1acc33b400ce-S0 --follow
```

to get the following log output:

```bash
2018-04-09 19:04:22: I0410 02:38:22.711650  3709 http.cpp:1185] HTTP GET for /slave(1)/state from 10.0.3.81:56595 with User-Agent='navstar@10.0.3.81 (pid 3168)'

2018-04-09 19:04:24: I0410 02:38:24.752534  3708 logfmt.cpp:178] dstip=10.0.3.81 type=audit timestamp=2018-04-10 02:38:24.752481024+00:00 reason="Valid authorization token" uid="dcos_net_agent" object="/slave(1)/state" agent="navstar@10.0.3.81 (pid 3168)" authorizer="mesos-agent" action="GET" result=allow srcip=10.0.3.81 dstport=5051 srcport=56595
```

[Pic of Mesos agent UI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-23.png)

<a name="master-logs"></a>

### Mesos Master Logs

The Mesos Master is responsible for matching available resources to the scheduler and also forwards task status updates from the Agents to the corresponding scheduler. This makes the Mesos Master logs a great resource for understanding the overall state of the cluster.

Please be aware that typically there are (or at least should be in an HA setup) multiple Mesos Masters and you should identify the currently leading Master to get the most up-to-date logs (in some cases it might make sense to retrieve logs from another Mesos master as well: e.g., a master node has failed over and you want to understand why).

You can either retrieve the Master logs from the Mesos UI via `<cluster-name>/mesos`, via `dcos node log --leader`, or for a specific master node using `ssh master` and `journalctl -u dcos-mesos-master`.

<a name="system-logs"></a>

### System Logs

We have now covered the most important log sources in the DC/OS environment, but there are many more logs available. Every DC/OS component writes a log. For instance, [each DC/OS component](/1.11/overview/architecture/components/) is running as one systemd unit for which you can [retrieve the logs directly](/latest/monitoring/logging/#system-logs) on the particular node by accessing that node via SSH and then typing `journalctl -u <systemd-unit-name>`. In my experience, the two most popular system units considered during debugging (besides Mesos and Marathon) are the `docker.service` and the `dcos-exhibitor.service`.

As an example, consider the system unit for the docker daemon on the Mesos agent `ffc913d8-4012-4953-b693-1acc33b400ce-S0` (recall the `dcos node` command retrieves the Mesos ID).

First we connect to that agent via SSH using the corresponding SSH key:

```bash
$ dcos node ssh --master-proxy --mesos-id=ffc913d8-4012-4953-b693-1acc33b400ce-S0
```

Then we use `journatlctl`, to look at the Docker logs:

```bash
$ journalctl -u docker
```

which outputs something like this:

```bash
-- Logs begin at Mon 2018-04-09 23:50:05 UTC, end at Tue 2018-04-10 02:52:41 UTC. --

Apr 09 23:51:50 ip-10-0-3-81.us-west-2.compute.internal systemd[1]: Starting Docker Application Container Engine...

Apr 09 23:51:51 ip-10-0-3-81.us-west-2.compute.internal dockerd[1262]: time="2018-04-09T23:51:51.293577691Z" level=info msg="Graph migration to content-addressability took 0.00 seconds"
```

<a name="metrics"></a>

## Metrics

Metrics are useful because they help identify problems before they become problems. Imagine a container using up all allocated memory and you can detect that while it is running but before it gets killed.

In DC/OS there are three main endpoints for metrics:

- [DC/OS metrics](https://github.com/dcos/dcos-metrics)
    - endpoint exposing combined metrics from tasks/container, nodes, and applications
- [Mesos metrics](http://mesos.apache.org/documentation/latest/monitoring/)
    - endpoint exposing Mesos-specific metrics
- [Marathon metrics](https://mesosphere.github.io/marathon/docs/metrics.html)
    - endppoint exposing Marathon-specific metrics

The best way to leverage metrics for debugging is to set up a dashboard with the important metrics related to the services you want to monitor, for example [using prometheus and grafana](https://github.com/dcos/dcos-metrics/blob/master/docs/quickstart/prometheus.md#dcos-metrics-with-prometheus-and-grafana). Ideally then, you can identify potential problems before they become real issues. Moreover, when issues do indeed arise, such a dashboard can be extremely helpful in determining the cause (for example, maybe a cluster has no free resources). For each of the endpoints listed above, there is a link fropm the list item including recommendations for the metrics you should monitor.

<a name="interactive"></a>

## Interactive

If the tasks logs are not helpful, then you may want use your favorite Linux tools (e.g., `curl`, `cat`, `ping`, etc) to understand what is really going on inside the application from an interactive point of view. You can use `dcos task exec` if you are using [Universal Container Runtime (UCR)](/latest/deploying-services/containerizers/ucr/) or SSH into the node and use `docker exec` if your are using the docker containerizer. For example, by using `dcos task exec -it <mycontainerid>` in bash, you are presented with an interactive bash shell inside that container.

If you alter the state of the container, you must update the stored `app-definition` and restart the container from the updated `app-definition`. Otherwise your changes will be lost the next time the container restarts.

<a name="endpoints"></a>

## HTTP Endpoints

DC/OS has a large number of additional endpoints. Here are some of the most useful ones for debugging:

- `<cluster>/mesos/master/state-summary`

This endpoint gives you a json encoded summary of the agents, tasks, and frameworks inside the cluster. This is especially helpful when looking at the different resources as it shows you whether there are reserved resources for a particular role (we will see more details of this in one of the Hand-On exercises).

This endpoint lists all tasks in the queue to be scheduled by Marathon.

- `<cluster>/marathon/v2/queue`

This endpoint is valuable when troubleshooting scaling or deployment problems.

**TIP** See the [complete list of Mesos endpoints](http://mesos.apache.org/documentation/latest/endpoints/).

<a name="community-tool"></a>

## Community

The [DC/OS community](https://dcos.io/community/?_ga=2.183442662.1394567794.1525106895-1279864600.1520288020) is a great place to ask additional questions either via [Slack](http://chat.dcos.io/?_ga=2.183442662.1394567794.1525106895-1279864600.1520288020) or the [mailing list](https://groups.google.com/a/dcos.io/forum/#!forum/users). Keep in mind that both [Mesos](http://mesos.apache.org/community/) and [Marathon](https://mesosphere.github.io/marathon/support.html) have their own communities in addition to the DC/OS community.

<a name="other-tools"></a>

## Other Tools

There are other debugging tools as well, both [internal to DC/OS](/1.11/monitoring/debugging/), as well as external tools such as [Sysdig](https://sysdig.com/blog/monitoring-mesos/) or [Instana](https://www.instana.com/). These tools can be especially helpful in determining non DC/OS specific issues, e.g., Linux Kernel or networking problems.

<!-- III. Strategy Section -->

<a name=strategy></a>

# General Strategy: Debugging Application Deployment on DC/OS

At this point, you’re probably thinking “That’s a great set of tools, but how do I know which tool to apply for any given problem?”

First, let’s take a look at a general strategy for troubleshooting on DC/OS. Then, let’s dive into some more concrete examples of how to apply this strategy in the [hands-on section](#hands-on) below.

If there is no additional information, a reasonable approach is to consider the potential problem sources in the following order:

- 1: [Check Task Logs](#task-strat)
- 2: [Check Scheduler Logs](#schedule-strat)
- 3: [Check Agent Logs](#agent-strat)
- 4: [Test Task Interactively](#interactive-strat)
- 5: [Master](#master-strat)
- 6: [Community](#community-strat)

<a name="task-strat"></a>

## Step 1: Check Task Logs

Start by examining the GUI (or use the CLI) to [check the status](/latest/deploying-services/task-handling/) of the task.

If the task has an associated [health check](/latest/deploying-services/creating-services/health-checks/), it’s also a good idea to check the task’s health status.

Next, checking the task logs, either via the DC/OS UI or the CLI, helps us to understand what might have happened to the application. If the issue is related to our app not deploying (i.e., the task status is waiting) looking at the ['Debug' page](/1.10/monitoring/debugging/gui-debugging/#debugging-page) might be helpful to understand the resources being offered by Mesos.

<a name="schedule-strat"></a>

## Step 2: Check Scheduler Logs

If there is a deployment problem, it can be helpful to double check the app definition and then check the Marathon UI or log to figure out how it was scheduled or why not.

<a name="agent-strat"></a>

## Step 3: Check Agent Logs

The Mesos Agent logs provide information regarding how the task (and its environment) is being started. Recall that increasing the log level might be helpful in some cases.

<a name="interactive-strat"></a>

## Step 4: Test Task Interactively

The next step is to interactively look at the task running inside the container. If the task is still running, `dcos task exec` or `docker exec` can be helpful to start an interactive debugging session. If the application is based on a Docker container image, manually starting it using `docker run` followed by `docker exec` can also get you started in the right direction.

<a name="master-strat"></a>

## Step 5: Check Master Logs

If you want to understand why a particular scheduler has received certain resources or a particular status, then the master logs can be very helpful. Recall that the master is forwarding all status updates between the agents and scheduler, so it might even be helpful in cases where the agent node might not be reachable (for example, network partition or node failure).

<a name="community-strat"></a>

## Step 6:  Community
As mentioned above, the community, either using the DC/OS Slack or the mailing list can be very helpful in debugging further.

<!-- IV. Hands On Examples Section -->

<a name=hands-on></a>

# Hands On: Debugging Application Deployment on DC/OS

Now it’s time to apply our new knowledge and start debugging! We encourage you to try to solve these exercises by yourself before skipping to the solution.

## Prerequisites

- running [DC/OS cluster](/1.11/installing/oss/)
    - 4 private agent nodes
    - 1 public agent node
- configured [DC/OS CLI](https://docs.mesosphere.com/1.11/cli/install/)

Note that these exercises require a running [DC/OS cluster](/1.11/installing/oss/) and a configured [DC/OS CLI](https://docs.mesosphere.com/1.11/cli/install/). Further note that we are using a cluster with 4 private agents and 1 public agent *that is not running any workloads prior to this challenge*. Therefore, of course, your results may vary if use a different cluster setup.

<a name=c1></a>

## Challenge 1: Resource Allocation

### Setup

For challenge 1 please deploy [this app definition](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-scaling1.json) as follows:

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-scaling1.json
```

If you check the app status using the DC/OS GUI, you should see something similar to the following:

[Pic of GUI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-14.png)

With the status of the application most likely to be “Waiting” followed by some number of thousanths “x/1000”. "Waiting" refers to the overall application status and the number; "x" here represents how many instances have successfully deployed (6 in this example).

You can also check this status from the CLI:

```bash
$ dcos marathon app list
```

would produce the following output in response:

```bash
ID              MEM   CPUS  TASKS   HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD

/app-scaling-1  128    1    6/1000   ---      scale     True       mesos    sleep 10000
```

Or, if you want to see all ongoing deployments, enter:

```bash
$ dcos marathon deployment list
```

to see something like the following:

```bash
APP             POD  ACTION  PROGRESS  ID

/app-scaling-1  -    scale     1/2     c51af187-dd74-4321-bb38-49e6d224f4c8
```

So now we know that some (6/1000) instances of the application have successfully deployed, but the overall deployment status is “Waiting”. But what does this mean?

### Resolution

The “Waiting” state means that DC/OS (or more precisely Marathon) is waiting for a suitable resource offer. So it seems to be an deployment issue and we should start by checking the available resources.

If we look at the DC/OS dashboard we should see a pretty high CPU allocation similar to the following (exact percentage depends on your cluster):

[Pic of CPU Allocation](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-20.png)

Since we are not yet at 100% allocation, but we are still waiting to deploy, let’s look at the recent resource offers in the debug view of the DC/OS GUI.

[Pic of relevant instance of GUI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-21.png)

We can see that there are no matching CPU resources, but we recall that the overall CPU allocation was only at 75%. However, when we take a look at the 'Details' section further below, we can see how the latest offers from different host match the resource requirements of our app. So, for example, the first offer coming from host `10.0.0.96` matched the role, constraint (not present in this `app-definition`) memory, disk, port resource requirements --- but failed the CPU resource requirements. The last offer also seems to have the resource requirements. Let us understand what that means exactly by looking at this offer in more detail.

[Pic of details](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-22.png)

So some of the remaining CPU resources are in a different [Mesos resource role](http://mesos.apache.org/documentation/latest/roles/) and so cannot be used by our application which runs in role '*' (which is the default role).

To check the roles of different resources let us have a look at the state-summary endpoint, which you can access via https://<master-ip>/mesos/state-summary.

That endpoint will give us a rather long json output, so it is helpful to use jq to make the output readable.

```bash
curl -skSL

-X GET

-H "Authorization: token=$(dcos config show core.dcos_acs_token)"

-H "Content-Type: application/json"

"$(dcos config show core.dcos_url)/mesos/state-summary" |

jq '.'
```

When looking at the agent information we can see two different kinds of agent.

The first kind has no free CPU resources and also no reserved resources, although this might be different if you had other workloads running on your cluster prior to these exercises. Note that these unreserved resources correspond to the default role '*' in which we are trying to deploy our tasks.

[Pic of cluster information](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-19.png)

The second kind has unused CPU resources, but these resources are reserved in the role 'slave_public'.

We now know that the issue is that there are not enough resources in the desired resource role across the entire cluster. As a solution we could either scale down the application (1000 instances does seem a bit excessive), or we need to add more resources to the cluster.

### General Pattern

If the framework for your app (e.g. Marathon) is not accepting resource offers you should check whether there are sufficient resources available in the respective resource role.

This was a straightforward scenario with too few CPU resources. Typically resource issues are more likely caused by more complex factors - such as improperly configured [port resources](/1.11/deploying-services/service-ports/) or [placement constraints](/1.11/deploying-services/marathon-constraints/). Nonetheless, this general workflow pattern still applies.

### Cleanup

Remove the app with:

`$ dcos marathon app remove /app-scaling-1`

**Challenge 1 complete!**

<a name=c2></a>

## Challenge 2: Out of Memory

### Setup

Deploy the file [`app-oom.json`](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-oom.json):

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-deb
```

Now when we take a look at the DC/OS GUI, we see some strange results under CPU Allocation:

[Pic of CPU allocation](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-25.png)

How is it that CPU Allocation is oscillating? Let’s take a look at the app details in the GUI:

[Pic of Task tab](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-24.png)

It looks like our app runs for a few seconds and then fails. Let’s find out why.

### Resolution

Let’s start by looking at the app logs, either in the GUI or via the CLI. You can find the app logs in the GUI by :

[Pic of app logs](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-15.png)

The log output “Eating Memory” is a pretty generous hint that the issue might be related to memory, but there is no direct failure message (and you should keep in mind that *most apps are not so friendly as to log that they are eating up memory*).

As suspected, this might be an application-related issue, and this app is scheduled via Marathon. So let’s check the Marathon logs using the CLI:

```bash
$ dcos service log marathon
```

One helpful time saving-tip is to `grep` for 'TASK_FAILED'.

We see a log entry similar to:

```bash
Mar 27 00:46:37 ip-10-0-6-109.us-west-2.compute.internal marathon.sh[5866]: [2018-03-27 00:46:36,960] INFO  Acknowledge status update for task app-oom.4af344fa-3158-11e8-b60b-a2f459e14528: TASK_FAILED (Memory limit exceeded: Requested: 64MB Maximum Used: 64MB
```

**Now we have confirmed that we exceeded the previously set container memory limit in [`app-oom.json`](https://github.com/dcos-labs/dcos-debugging/blob/master/1.10/app-oom.json#L6)**

If you’ve been paying close attention you might shout now “wait a sec” because you noticed that the memory limit we set in the app definition is 32 MB, but the error message mentions 64MB. DC/OS automatically reserves some overhead memory for the [executor](/1.11/overview/architecture/task-types/#executors) which in this case is 32 MB.

Please note that OOM `kill` is performed by the Linux kernel itself, hence we can also check the kernel logs directly:

```bash
dcos node ssh --master-proxy --mesos-id=$(dcos task app-oom --json | jq -r '.[] | .slave_id')

journalctl -f _TRANSPORT=kernel

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [ pid ]   uid  tgid total_vm      rss nr_ptes nr_pmds swapents oom_score_adj name

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16846]     0 16846    30939    11021      62       3        0             0 mesos-container

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16866]     0 16866   198538    12215      81       4        0             0 mesos-executor

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16879]     0 16879     2463      596      11       3        0             0 sh

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16883]     0 16883  1143916    14756      52       6        0             0 oomApp

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: Memory cgroup out of memory: Kill process 16883 (oomApp) score 877 or sacrifice child

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: Killed process 16883 (oomApp) total-vm:4575664kB, anon-rss:57784kB, file-rss:1240kB, shmem-rss:0kB

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: oom_reaper: reaped process 16883 (oomApp), now anon-rss:0kB, file-rss:0kB, shmem-rss:0kB
```

The resolution in such cases is to either increase the resource limits for that container, in case it was configured too low to begin with. Or, as in this case, fix the memory leak in the application itself.

### General Pattern

As we are dealing with a failing task it is good to check the application and scheduler logs (in this case our scheduler is Marathon). If this isn’t sufficient it can help to look at the Mesos Agent logs and/or to use `dcos task exec` when using UCR (or ssh to the node and use `docker exec` when using the Docker containerizer).

### Cleanup

Remove the app with

```bash
$ dcos marathon app remove /app-oom
```

**Challenge 2 complete!**

<a name="c3"></a>

## Challenge 3: Docker Images

### Setup

Deploy this [`dockerimage.json`](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/dockerimage.json) file:

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/dockerimage.json
```

We see the app fail almost immediately:

[Pic of failure](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-17.png)

### Resolution

As we learned [earlier](#strategy), with app failures the [first step](#task-strat) is to check the [task logs](#task-logs).

[Pic of empty log output](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-18.png)

Unfortunately, it is completely empty. Normally we would at least see some output from the setup of the task. What could be happening?

[Step 2] is to check the scheduler logs - in this case Marathon:

```bash
$ dcos service log marathon
```

which should produce something like the following output in response:

```bash
Mar 27 21:21:11 ip-10-0-5-226.us-west-2.compute.internal marathon.sh[5954]: [2018-03-27 21:21:11,297] INFO  Received status update for task docker-image.c4cdf565-3204-11e8-8a20-82358f3033d1: TASK_FAILED (

Mar 27 21:21:11 ip-10-0-5-226.us-west-2.compute.internal marathon.sh[5954]: ') (mesosphere.marathon.MarathonScheduler:Thread-1723)
```

However, this does not shed much light on why the task failed. So then to [Step 3](#agent-strat) of our [strategy](#strategy), and check the [Mesos agent logs](#agent-logs):

```bash
$ dcos node log --mesos-id=$(dcos task docker-image  --json | jq -r '.[] | .slave_id') --lines=100
```

producing a response resembling the following output:

```bash
8-4520-af33-53cade35e8f9-0001 failed to start: Failed to run 'docker -H unix:///var/run/docker.sock pull noimage:idonotexist': exited with status 1; stderr='Error: image library/noimage:idonotexist not found

2018-03-27 21:27:15: '

2018-03-27 21:27:15: I0327 21:27:15.325984  4765 slave.cpp:6227] Executor 'docker-image.9dc468b5-3205-11e8-8a20-82358f3033d1' of framework 6512d7cc-b7f8-4520-af33-53cade35e8f9-0001 has terminated with unknown status
```

It looks like the specific Docker image could not be found, perhaps because it doesn’t exist. Does the image exist in the specified location (in this case noimage:idonotexist in dockerhub)? If not, you will have to correct the location or move the file to the specified location. Was there an error in the location or filename specified? Also, check whether the container image registry (especially when using a private registry) is accessible.

### General Pattern

Being an application error, we again start by looking at task logs, followed by scheduler logs.

In this case we have a Docker daemon-specific issue. Many such issues can be uncovered by examining the Mesos Agent logs. In some cases, where we need to dig deeper, accessing the Docker daemon logs is required. First, ssh into the master node:

```bash
$ dcos node ssh --master-proxy --mesos-id=$(dcos task --all | grep docker-image | head -n1 | awk '{print $6}')
```

then to get the logs:

```bash
$ journalct1 -u docker
```

Please note the more complex pattern used here to retrieve the mesos-id in comparison to the earlier example. This pattern lists already failed tasks and running tasks, while the earlier pattern only lists running tasks.

### Cleanup

Run:

```bash
$ dcos marathon app remove docker-image
```

**Challenge 2 complete!**

## Ready, Set, Debug!

There are more hands-on exercises in the [dcos-debugging github repository](https://github.com/dcos-labs/dcos-debugging/tree/master/1.10).  Also feel free to contribute your own debugging scenarios to this repository.

So dive in, challenge yourself, and master the art of debugging DC/OS!
