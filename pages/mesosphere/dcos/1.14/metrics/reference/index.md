---
layout: layout.pug
navigationTitle:  Metrics Reference
title: Metrics Reference
menuWeight: 7
excerpt: Understanding metrics collected by DC/OS
render: mustache
model: /mesosphere/dcos/1.14/data.yml
beta: false
enterprise: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

Mesosphere DC/OS collects basic system metrics--such as CPU and memory--for nodes and containers automatically. Mesosphere DC/OS also collects metadata about the different categories of metrics. For more information about the metadata metrics, see [Dimensions](#Dimensions).

You should note that automatically-collected metrics are only available for containers that provide endpoint statistics. For example, Docker containers do not provide networking data for DC/OS to consume, so the networking metrics that are available for UCR containers are not available for Docker containers.

<a name="Node"></a>

#  Node
<a name="NodeCPUMem"></a>

## CPU and memory metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `cpu.idle `        |     Percentage of CPUs idle.         |
| `cpu.system`         |    Percentage of system used.   |
| `cpu.total`         |   Percentage of CPUs used.  |
| `cpu.user`         |   Percentage of CPU used by the user.   |
| `cpu.wait`         |   Percentage idle while waiting for an operation to complete.    |
| `load.1min`         |     Load average for the past minute.       |
| `load.5min`         |   Load average for the past 5 minutes.        |
| `load.15min`         |    Load average for the past 15 minutes.        |
| `memory.buffers`         |   Number of memory buffers.     |
| `memory.cached`         |   Amount of cached memory.   |
| `memory.free`         |    Amount of free memory in bytes.   |
| `memory.total`         |   Total memory in bytes.   |
| `process.count`         |  Number of processes that are running.          |
| `swap.free`         |  Amount of free swap space.   |
| `swap.total`         |  Total swap space.    |
| `swap.used`         |    Amount of swap space used.    |
| `system.uptime`          |   The system uptime.    |

<a name="NodeFiles"></a>

## File system metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `filesystem.capacity.free`    | Amount of available capacity in bytes. |
| `filesystem.capacity.total`    | Total capacity in bytes. |
| `filesystem.capacity.used`    |  Capacity used in bytes. |
| `filesystem.inode.free`    | Amount of available inodes in bytes. |
| `filesystem.inode.total`    | Total inodes in bytes. |
| `filesystem.inode.used`    | Inodes used in bytes.  |

<p class="message--note"><strong>NOTE: </strong>The tag <code>path</code> is automatically populated based on the mount path of the local filesystem (for example, <code>/</code>, <code>/boot</code>, etc).</p>

<a name="NodeNetwork"></a>

## Network interface metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `network.in`    | Number of bytes downloaded. |
| `network.in.dropped`    | Number of downloaded bytes dropped. |
| `network.in.errors`    | Number of downloaded bytes in error. |
| `network.in.packets`    | Number of packets downloaded. |
| `network.out`    | Number of bytes uploaded. |
| `network.out.dropped`    | Number of uploaded bytes dropped. |
| `network.out.errors`    | Number of uploaded bytes in error.  |
| `network.out.packets`    | Number of packets uploaded. |

<p class="message--note"><strong>NOTE: </strong>The tag <code>interface</code> is automatically populated based on the type of the network interface (for example, <code>spartan</code>, <code>d-dcos</code>, <code>minuteman</code>, etc).</p>

## Process

The following per-process resource utilization metrics are collected.

| Metric            | Description                  |
|-------------------|------------------------------|
| procstat.cpu_time_guest | The amount of time that the CPU is running a virtual CPU for a guest operating system. |
| procstat.cpu_time_guest_nice | The amount of time that the CPU is running a virtual CPU for a guest operating system, which is low-priority and can be interrupted by other processes. |
| procstat.cpu_time_idle | The amount of time that the CPU is idle. |
| procstat.cpu_time_iowait | The amount of time that the CPU is waiting for I/O operations to complete. |
| procstat.cpu_time_irq | The amount of time that the CPU is servicing interrupts. |
| procstat.cpu_time_nice | The amount of time that the CPU is in user mode with low-priority processes, which can easily be interrupted by higher-priority processes. |
| procstat.cpu_time_soft_irq | The amount of time that the CPU is servicing software interrupts. |
| procstat.cpu_time_steal | The amount of time that the CPU is in stolen time, which is time spent in other operating systems in a virtualized environment. |
| procstat.cpu_time_system | The amount of time that the CPU is in system mode. |
| procstat.cpu_time_user |The amount of time that the CPU is in user mode. |
| procstat.cpu_usage | The percentage of time that the process is active in any capacity. |
| procstat.involuntary_context_switches | The number of times the process was involuntarily context-switched. |
| procstat.memory_data | The amount of memory the process uses for data. |
| procstat.memory_locked | The amount of memory the process has locked. |
| procstat.memory_rss | The amount of real memory (resident set) that the process is using. |
| procstat.memory_stack | The amount of stack memory the process is using. |
| procstat.memory_swap | The amount of swap memory the process is using. |
| procstat.memory_vms | The amount of virtual memory the process is using. |
| procstat.nice_priority | The current usage of nice priority for the process.|
| procstat.num_threads | The number of threads in the process. |
| procstat.pid | Process identifier (ID). |
| procstat.realtime_priority | The current usage of realtime priority for the process. |
| procstat.rlimit_cpu_time_hard | The hard resource limit on the process for memory used for data. |
| procstat.rlimit_cpu_time_soft | The soft resource limit on the process for memory used for data. |
| procstat.rlimit_file_locks_hard | The hard file locks resource limit for the process. |
| procstat.rlimit_file_locks_soft | The soft file locks resource limit for the process. |
| procstat.rlimit_memory_data_hard | The hard resource limit on the process for memory used for data. |
| procstat.rlimit_memory_data_soft | The soft resource limit on the process for memory used for data. |
| procstat.rlimit_memory_locked_hard | The hard resource limit on the process for locked memory. |
| procstat.rlimit_memory_locked_soft | The soft resource limit on the process for locked memory. |
| procstat.rlimit_memory_rss_hard | The hard resource limit on the process for physical memory. |
| procstat.rlimit_memory_rss_soft | The soft resource limit on the process for physical memory. |
| procstat.rlimit_memory_stack_hard | The hard resource limit on the process stack. |
| procstat.rlimit_memory_stack_soft | The soft resource limit on the process stack. |
| procstat.rlimit_memory_vms_hard | The hard resource limit on the process for virtual memory. |
| procstat.rlimit_memory_vms_soft | The soft resource limit on the process for virtual memory. |
| procstat.rlimit_nice_priority_hard | The hard resource limit on the ceiling for the process's nice priority value. |
| procstat.rlimit_nice_priority_soft | The soft resource limit on the ceiling for the process's nice priority value. |
| procstat.rlimit_num_fds_hard | The hard resource limit on the file descriptors for the process. |
| procstat.rlimit_num_fds_soft | The soft resource limit on the file descriptors for the process. |
| procstat.rlimit_realtime_priority_hard | The hard resource limit on the ceiling for the process's real-time priority value. |
| procstat.rlimit_realtime_priority_soft | The soft resource limit on the ceiling for the process's real-time priority value. |
| procstat.rlimit_signals_pending_hard | The hard resource limit on the number of signals that are pending for delivery to the process. |
| procstat.rlimit_signals_pending_soft | The soft resource limit on the number of signals that are pending for delivery to the process. |
| procstat.signals_pending | The number of signals pending to be handled by the process. |
| procstat.voluntary_context_switches | The number of times the process was context-switched voluntarily. |

Source: [AWS DOCS - Collect Process Metrics with the procstat Plugin](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)

<a name="Container"></a>

# Container

The following per-container resource utilization metrics are collected.

<a name="ConCPU"></a>

## CPU usage metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `cpus.limit`    | The number of CPU shares allocated. |
| `cpus.system_time_secs`    | Total CPU time spent in kernel mode in seconds. |
| `cpus.throttled_time_secs`    | Total time, in seconds, that CPU was throttled. |
| `cpus.user_time_sec`s    | Total CPU time spent in user mode. |

<a name="ConDisk"></a>

## Disk metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `disk.limit_bytes`    | Hard capacity limit for disk in bytes. |
| `disk.used_bytes`    | Hard capacity used in bytes.  |

<a name="ConMem"></a>

## Memory metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `mem.limit_bytes`    | Hard memory limit for a container. |
| `mem.total_bytes`    | Total memory of a process in RAM (as opposed to in swap). |   

<a name="ConNetwork"></a>

## Network metrics

| Metric            | Description                  |
|-------------------|------------------------------|
| `net.rx.bytes`    | Bytes received. |
| `net.rx.dropped`    | Packets dropped on receive.  |
| `net.rx.errors`    | Errors reported on receive. |
| `net.rx.packets`    |  Packets received.  |
| `net.tx.bytes`    |  Bytes sent. |
| `net.tx.dropped`    | Packets dropped on send.  |
| `net.tx.errors`    | Errors reported on send. |
| `net.tx.packets`    | Packets sent. |

<a name="Dimensions"></a>

# Dimensions

Dimensions are metadata about the metrics. The following table lists the available dimensions and the entities where they appear.

| Dimension | Description | Entity |
|-----------|-------------|--------|
| `mesos_id`   | The Mesos ID of the node.  | node, container |
| `cluster_id`   |  The ID of the Mesos cluster. | node, container |
| `container_id`  | The ID of the container.  | metric, container |
| `executor_name`   |  The name of the task executor. | metric |
| `framework_name`   | The name of the framework.  | container |
| `hostname`   | The IP address of the node.  | container, node |
| `labels`   |  Key-value pairs describing the metric.  | container |
| `task_name`   | The task name.  | container |


Read the following resource for more information on Metrics:
1. [Additional Mesos volume and Network metrics](http://mesos.apache.org/documentation/latest/monitoring/) documentation.

