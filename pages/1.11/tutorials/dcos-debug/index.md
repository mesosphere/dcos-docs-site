---
layout: layout.pug
title: Debugging Applications on DC/OS
excerpt: DC/OS is a powerful platform for deploying and managing applications, but what can you do if your app is failing to deploy as expected?
menuWeight: 55
---

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;"><b>Important:</b> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is to demonstrate capabilities, and may not be suited for use in a production environment. Before using a similar solution in your environment, you must adapt, validate, and test.</td> </tr> </table>

DC/OS provides a platform for running complex distributed systems both for Big Data applications and also custom containerized applications. But what happens if your application keeps failing? Debugging in distributed systems is always difficult and while DC/OS provides a number of tools for debugging, it might be difficult to choose which of these tools to apply in which situation.

This tutorial provides an overview to debugging applications and their deployments on DC/OS. As such, it should not be considered an exhaustive resource for debugging on DC/OS, but rather a starting point.

You should have a working knowledge of DC/OS in order to complete this tutorial. However, if needed there are plenty of other [tutorials to get you up and running](/1.11/tutorials/).

It is helpful to keep in mind that failures are to be expected when working with distributed systems. Many components must be configured to work together, and this takes detailed preparation and awareness during installation and initial configuration. Fortunately, it also means a few of the most important steps can be taken care of before any debugging is necessary:

- [Design your applications for debuggability](https://schd.ws/hosted_files/mesosconeu17/a6/MesosCon%20EU%202017%20University%20Slides.pdf)
- [Follow best practices for deployments](https://mesosphere.com/blog/improving-your-deployments/)
- [Set up monitoring and alerts so you can resolve issues as early as possible](https://docs.mesosphere.com/1.10/cli/command-reference/dcos-node/dcos-node-diagnostics/)

 We will first look at [some potential problems](#problems) you might face when deploying an application on DC/OS. Next, we will look at the [standard set of tools](#tools) for debugging. Then, after introducing [a general strategy for using those tools](#strategy), we have two [concrete examples](#examples) to illustrate how the strategy works in practice.

We encourage everyone to first try debugging these yourself, but we also provide detailed guidance for debugging them.

<a name="problems"></a>

# Problems with Application Deployment

The range of problems that can be encountered and require debugging is far too large to be covered in a single blog-post. Some of the problems that may need troubleshooting on DC/OS include applications:

- Not deploying at all
- Deploying very slowly
- Deploying but do not start correctly (or behave incorrectly)
- Restarting repeatedly
- Not being reachable inside (or outside) of the DC/OS cluster

DC/OS consists of [a number of different components](https://docs.mesosphere.com/1.11/overview/architecture/components/) - most notably [Apache Mesos](http://mesos.apache.org/) and [Marathon](https://mesosphere.github.io/marathon/). As any of these components could be involved in the issue you are encountering, it might be difficult to even locate the component causing the issue. Accordingly, this tutorial aims to cover several types of such issues.

Of course, there are a myriad of other potential sorts of problems that can affect your cluster besides application failures: networking problems, DC/OS installation issues, and DC/OS internal configuration issues could each be causing issues on your cluster. These are unfortunately out of scope for this tutorial, but we encourage you to reach out via our [Community channels](https://dcos.io/community/) with ideas and feedback.

<a name="tools"></a>

# Tools for Debugging Application Deployment on DC/OS

DC/OS comes with a number of tools for debugging. In this section we will try to provid=58e an overview of the relevant tools for application debugging.

In particular we discuss:

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

Despite the DC/OS UI showing most of the information that you’d need for debugging, sometimes accessing the Mesos UI itself can be helpful, for example when checking failed tasks or registered frameworks. The Mesos UI can be accessed via https://<cluster>/mesos.

[Pic of Mesos UI](https://mesosphere.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-15-at-17.56.16.png)

<a name="zoo-ui"></a>

### ZooKeeper UI

[Pic of ZooKeeper/Exhibitor UI](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-13.png)


<a name="logs"></a>

## Logs

Logs are useful tools to see events and conditions that occurred before the problem. Very often logs include error messages that shed light on the cause of the error. As logging is an important topic, we also recommend to have a look at the [DC/OS logging documentation](/1.11/monitoring/logging/#system-logs), for more information.

DC/OS has a number of different sources for logs, including these which we will look at more detail below:

- [Tasks/Applications](#tasks-logs)
- [Mesos Agents](#agent-logs)
- [Mesos Master](#master-logs)
- [Service Scheduler](#scheduler-logs) (e.g., Marathon)
- [System Logs](#system-logs)

DC/OS unifies these different logs and makes them accessible via different options: the DC/OS UI, the DC/OS CLI, or HTTP endpoints. Also logs are log-rotated by default in order to avoid filling all available disk space.

**Tip** If you require a scalable way to manage and search your logs it might be worth building an [ELK stack for log aggregation and filtering](/1.11/monitoring/logging/aggregating/filter-elk/).

Also, as with other systems, in some cases it is helpful to increase the level of detail written to the log temporarily to obtain detailed troubleshooting information. For most components this can be done by accessing an endpoint. For example, when you want to increase [the log level of a Mesos Agent](http://mesos.apache.org/documentation/latest/endpoints/logging/toggle/) for 5 minutes following the server receiving the call:

#### 1. Connect to Master Node

```bash
$ dcos node ssh --master-proxy --leader
```

#### 2. Raise Log Level on Mesos Agent 10.0.2.219

```bash
$ curl -X POST 10.0.2.219:5051/logging/toggle?level=3&duration=5mins
```

<a name="task-logs"></a>

### Tasks/Application Logs










<a name="metrics"></a>

## Metrics

<a name="interactive"></a>

## Interactive

<a name="endpoints"></a>

## HTTP Endpoints

<a name="community-tool"></a>

## Community

<a name="other-tools"></a>

## Other Tools




















<a name=strategy></a>

# General Strategy: Debugging Application Deployment on DC/OS

<a name=examples></a>

# Hands On: Debugging Application Deployment on DC/OS
