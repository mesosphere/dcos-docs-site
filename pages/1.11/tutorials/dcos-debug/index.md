---
layout: layout.pug
title: Debugging Applications on DC/OS
excerpt: DC/OS is a powerful platform for deploying and managing applications, but what can you do if your app is failing to deploy as expected?
menuWeight: 55
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>Important:</b> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is to demonstrate capabilities, and may not be suited for use in a production environment. Before using a similar solution in your environment, you must adapt, validate, and test.</td> </tr> </table>

DC/OS provides a platform for running complex distributed systems both for Big Data applications and also custom containerized applications. But what happens if your application keeps failing? Debugging in distributed systems is always difficult and while DC/OS provides a number of tools for debugging, it might be difficult to choose which of these tools to apply in which situation.

This tutorial only aims to provide a top-down introduction to debugging applications during and after their deployment on DC/OS. As such, it should not be considered an exhaustive resource for debugging on DC/OS, but rather a starting point.

You should have a working knowledge of DC/OS in order to complete this tutorial. However, if needed there are plenty of other [tutorials to get you up and running](/1.11/tutorials/).

It is helpful to keep in mind that failures are to be expected when working with distributed systems. Many components must be configured to work together, and this takes detailed preparation and awareness during installation and initial configuration. Fortunately, it also means a few of the most important steps can be taken care of before any debugging is necessary:

- [Design your applications for debuggability](https://schd.ws/hosted_files/mesosconeu17/a6/MesosCon%20EU%202017%20University%20Slides.pdf)
- [Follow best practices for deployments](https://mesosphere.com/blog/improving-your-deployments/)
- [Set up monitoring and alerts so you can resolve issues as early as possible](https://docs.mesosphere.com/1.10/cli/command-reference/dcos-node/dcos-node-diagnostics/)

 We will first look at [some potential problems](#problems) you might face when deploying an application on DC/OS. Next, we will look at the [standard set of tools](#tools) for debugging. Then, after introducing [a general strategy for using those tools](#strategy), we have two [concrete examples](#examples) to illustrate how the strategy works in practice.

We encourage everyone to first try debugging these yourself, but we also provide detailed guidance for debugging them.

<a name="problems"></a>

# **Problems** with Application Deployment

The range of problems that can be encountered and require debugging is far too large to be covered in a single blog-post. Some of the problems that may need troubleshooting on DC/OS include applications:

- Not deploying at all
- Deploying very slowly
- Deploying but do not start correctly (or behave incorrectly)
- Restarting repeatedly
- Not being reachable inside (or outside) of the DC/OS cluster

DC/OS consists of [a number of different components](https://docs.mesosphere.com/1.11/overview/architecture/components/) - most notably [Apache Mesos](http://mesos.apache.org/) and [Marathon](https://mesosphere.github.io/marathon/). As any of these components could be involved in the issue you are encountering, it might be difficult to even locate the component causing the issue. Accordingly, this tutorial aims to cover several types of such issues.

Of course, there are a myriad of other potential sorts of problems that can affect your cluster besides application-related failures: networking problems, DC/OS installation issues, and DC/OS internal configuration issues could each be causing issues on your cluster. These are unfortunately out of scope for this tutorial, but we encourage you to reach out via our [Community channels](https://dcos.io/community/) with ideas and feedback.

<a name="tools"></a>

# **Tools** for Debugging Application Deployment on DC/OS

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

- DC/OS metrics
    - endpoint exposing combined metrics from tasks/container, nodes, and applications
- Mesos metrics
    - endpoint exposing Mesos-specific metrics
- Marathon metrics
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


















<a name=strategy></a>

# **General Strategy**: Debugging Application Deployment on DC/OS

<a name=examples></a>

# **Hands On**: Debugging Application Deployment on DC/OS
