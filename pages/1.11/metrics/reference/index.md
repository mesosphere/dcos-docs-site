---
layout: layout.pug
navigationTitle:  Metrics Reference
title: Metrics Reference
menuWeight: 2
excerpt: Understanding metrics collected by DC/OS
beta: false
enterprise: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->
Mesosphere DC/OS collects basic system metrics--such as CPU and memory--for nodes and containers automatically. Mesosphere DC/OS also collects metadata about the different categories of metrics. For more information about the metadata metrics, see [Dimensions](#Dimensions).

You should note that automatically-collected metrics are only available for containers that provide endpoint statistics. For example, Docker containers do not provide networking data for DC/OS to consume, so the networking metrics that are available for UCR containers are not available for Docker containers.

<a name="Node">

#  Node
<a name="NodeCPUMem">

## CPU and memory metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| cpu.cores         |    Percentage of cores used.     |
| cpu.idle         |     Percentage of CPUs idle.         |
| cpu.system         |    Percentage of system used.   |
| cpu.total         |   Percentage of CPUs used.  |
| cpu.user         |   Percentage of CPU used by the user.   |
| cpu.wait         |   Percentage idle while waiting for an operation to complete.    |
| load.1min         |     Load average for the past minute.       |
| load.5min         |   Load average for the past 5 minutes.        |
| load.15min         |    Load average for the past 15 minutes.        |
| memory.buffers         |   Number of memory buffers.     |
| memory.cached         |   Amount of cached memory.   |
| memory.free         |    Amount of free memory in bytes.   |
| memory.total         |   Total memory in bytes.   |
| process.count         |  Number of processes that are running.          |
| swap.free         |  Amount of free swap space.   |
| swap.total         |  Total swap space.    |
| swap.used         |    Amount of swap space used.    |
| system.uptime          |   The system reliability and load average.    |

<a name="NodeFiles">

## File system metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| filesystem.capacity.free    | Amount of available capacity in bytes. |
| filesystem.capacity.total    | Total capacity in bytes. |
| filesystem.capacity.used    |  Capacity used in bytes. |
| filesystem.inode.free    | Amount of available inodes in bytes. |
| filesystem.inode.total    | Total inodes in bytes. |
| filesystem.inode.used    | Inodes used in bytes.  |

<p class="message--note"><strong>NOTE: </strong>The tag `path` is automatically populated based on the mount path of the local file system (e.g., `/`, `/boot`, etc).</p>

<a name="NodeNetwork">

## Network interface metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| network.in.bytes    | Number of bytes downloaded. |
| network.in.dropped    | Number of downloaded bytes dropped. |
| network.in.errors    | Number of downloaded bytes in error. |
| network.in.packets    | Number of packets downloaded. |
| network.out.bytes    | Number of bytes uploaded. |
| network.out.dropped    | Number of uploaded bytes dropped. |
| network.out.errors    | Number of uploaded bytes in error.  |
| network.out.packets    | Number of packets uploaded. |

<p class="message--note"><strong>NOTE: </strong>The tag `interface` is automatically populated based on the type of the network interface (e.g., `spartan`, `d-dcos`, `minuteman`, etc).</p>

<a name="Container">

# Container

The following per-container resource utilization metrics are collected.

<a name="ConCPU">

## CPU usage metrics
   <!-- https://github.com/apache/mesos/blob/1.0.1/include/mesos/v1/mesos.proto -->

| Metric            | Description                  |
|-------------------|------------------------------|
| cpus.limit    | The number of CPU shares allocated. |
| cpus.system.time    | Total CPU time spent in kernel mode in seconds. |
| cpus.throttled.time    | Total time, in seconds, that CPU was throttled. |
| cpus.user.time    | Total CPU time spent in user mode. |

<a name="ConDisk">

## Disk metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| disk.limit    | Hard capacity limit for disk in bytes. |
| disk.used    | Hard capacity used in bytes.  |

<a name="ConMem">

## Memory metrics
   <!-- https://github.com/apache/mesos/blob/1.0.1/include/mesos/v1/mesos.proto -->

| Metric            | Description                  |
|-------------------|------------------------------|
| mem.limit    | Hard memory limit for a container. |
| mem.total    | Total memory of a process in RAM (as opposed to in swap). |   

<a name="Dimensions">

# Dimensions

Dimensions are metadata about the metrics. The following table lists the available dimensions and the entities where they appear.

| Dimension | Description | Entity |
|-----------|-------------|--------|
| mesos_id   | The Mesos ID of the node.  | node, container |
| cluster_id   |  The ID of the Mesos cluster. | node, container |
| container_id  | The ID of the container.  | metric, container |
| executor_id  |  The ID of the task executor. | metric, container |
| executor_name   |  The name of the task executor. | metric |
| framework_id   |  The ID of the framework. | metric, container |
| framework_name   | The name of the framework.  | container |
| framework_principal | The principal of the framework. | container |
| framework_role   | The framework role.  | container |
| hostname   | The IP address of the node.  | container, node |
| labels   |  Key-value pairs describing the metric.  | container |
| source   | The source of the metric. Equivalent to the executor ID. | metric |
| task_id   | The task ID. | container |
| task_name   | The task name.  | container |

For more information, see the [dcos-metrics repository](https://github.com/dcos/dcos-metrics).
