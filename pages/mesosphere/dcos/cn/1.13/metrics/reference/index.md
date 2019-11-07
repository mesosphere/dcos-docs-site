---
layout: layout.pug
navigationTitle:  度量标准参考
title: 度量标准参考
menuWeight: 7
excerpt: 了解 DC/OS 收集的度量标准
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
beta: false
enterprise: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

Mesosphere DC/OS 可自动为节点和容器收集基本系统度量标准（例如 CPU 和内存）。Mesosphere DC/OS 还收集关于不同类别度量标准的元数据。有关元数据度量的更多信息，请参阅 [维度]（#Dimensions）。

请注意，自动收集的度量标准仅适用于提供端点统计信息的容器。例如，Docker 容器不提供用于 DC/OS 的网络连接数据，因此可用于 UCR 容器的网络连接度量标准不适用于 Docker 容器。

<a name="Node"></a>

# 节点
<a name="NodeCPUMem"></a>

## CPU 和内存度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `cpu.idle `        |     CPU 空闲百分比。         |
| `cpu.system`         |    使用的系统百分比。   |
| `cpu.total`         |   使用 CPU 的百分比。  |
| `cpu.user`         |   用户使用的 CPU 百分比。   |
| `cpu.wait`         |   等待操作完成时的空闲百分比。    |
| `load.1min`         |     过去一分钟的负载平均值。       |
| `load.5min`         |   过去 5 分钟的负载平均值。        |
| `load.15min`         |   过去 15 分钟的负载平均值。        |
| `memory.buffers`         |   存储器缓冲区数量。     |
| `memory.cached`         |   缓存内存的数量。   |
| `memory.free`         |    按字节计的可用内存量。   |
| `memory.total`         |   按字节计的总内存。   |
| `process.count`         |   正在运行的进程数。          |
| `swap.free`         |  自由交换空间的大小。   |
| `swap.total`         |  总交换空间。    |
| `swap.used`         |    已用交换空间的大小。    |
| `system.uptime`          |   系统正常运行时间。    |

<a name="NodeFiles"></a>

## 文件系统度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `filesystem.capacity.free`    | 按字节计的可用容量大小。 |
| `filesystem.capacity.total`    | 按字节计的总容量。 |
| `filesystem.capacity.used`    |  按字节计的已用容量。 |
| `filesystem.inode.free`    | 按字节计的可用索引节点数。 |
| `filesystem.inode.total`    | 按字节计的总索引节点数。 |
| `filesystem.inode.used`    | 按字节计的已用索引节点数。  |

<p class="message--note"><strong>注意：</code>标签<code>路径<code>根据本地文件系统的挂载路径自动填充（例如，</strong>/</code>、<code>/boot</code>、等）。</p>

<a name="NodeNetwork"></a>

## 网络接口度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `network.in`    | 下载的字节数。 |
| `network.in.dropped`    | 丢失的已下载字节数。 |
| `network.in.errors`    | 错误下载的字节数。 |
| `network.in.packets`    | 下载的数据包数。 |
| `network.out`    | 上传的字节数。 |
| `network.out.dropped`    | 丢失的已上传字节数。 |
| `network.out.errors`    | 错误上传的字节数。 |
| `network.out.packets`    | 上传的数据包数。 |

<p class="message--note"><strong>注意：</strong>标签<code>接口</code>根据网络接口的类型自动填充（例如，<code>spartan</code>、<code>d-dcos</code>、<code>minuteman</code>等）。</p>

## 进程

收集以下按进程的资源利用率度量标准。

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| procstat.cpu_time_guest | CPU 运行客操作系统虚拟 CPU 的时间。 |
| procstat.cpu_time_guest_nice | CPU 运行客操作系统虚拟 CPU 的时间，这是低优先级，可能会被其他进程中断。 |
| procstat.cpu_time_idle | CPU 空闲的时间量。 |
| procstat.cpu_time_iowait | CPU 等待 I/O 操作完成的时间量。 |
| procstat.cpu_time_irq | CPU 服务于中断的时间量。 |
| procstat.cpu_time_nice | CPU 在用户模式下具有低优先级进程的时间量，这很容易会被优先级较高的进程中断。 |
| procstat.cpu_time_soft_irq | CPU 服务于软件中断的时间量。 |
| procstat.cpu_time_steal | CPU 处于被盗时间的时间量，这是在虚拟化环境中花在其他操作系统上的时间。 |
| procstat.cpu_time_system | CPU 处于系统模式的时间量。 |
| procstat.cpu_time_user | CPU 处于用户模式的时间量。 |
| procstat.cpu_usage | 进程在任何容量中处于活动状态的时间百分比。 |
| procstat.involuntary_context_switches | 进程不自主上下文切换的次数。 |
| procstat.memory_data | 进程用于数据的内存量。 |
| procstat.memory_locked | 进程已锁定的内存量。 |
| procstat.memory_rss | 进程正在使用的实际内存量（驻留集）。 |
| procstat.memory_stack | 进程正在使用的堆栈内存量。 |
| procstat.memory_swap | 进程正在使用的交换内存量。 |
| procstat.memory_vms | 进程正在使用的虚拟内存量。 |
| procstat.nice_priority | 进程的良好状态优先级的当前使用率。|
| procstat.num_threads | 进程中线程的数量。 |
| procstat.pid | 进程标识符 (ID)。 |
| procstat.realtime_priority | 进程的实时优先级的当前使用率。 |
| procstat.rlimit_cpu_time_hard | 进程上用于数据的内存的硬资源限制。 |
| procstat.rlimit_cpu_time_soft | 进程上用于数据的内存的软资源限制。 |
| procstat.rlimit_file_locks_hard | 进程的硬文件锁资源限制。 |
| procstat.rlimit_file_locks_soft | 进程的软文件锁资源限制。 |
| procstat.rlimit_memory_data_hard | 进程上用于数据的内存的硬资源限制。 |
| procstat.rlimit_memory_data_soft | 进程上用于数据的内存的软资源限制。 |
| procstat.rlimit_memory_locked_hard | 进程上用于锁定的内存的硬资源限制。 |
| procstat.rlimit_memory_locked_soft | 进程上用于锁定的内存的软资源限制。 |
| procstat.rlimit_memory_rss_hard | 进程上用于物理内存的硬资源限制。 |
| procstat.rlimit_memory_rss_soft | 进程上用于物理内存的软资源限制。 |
| procstat.rlimit_memory_stack_hard | 进程堆栈的硬资源限制。 |
| procstat.rlimit_memory_stack_soft | 进程堆栈的软资源限制。 |
| procstat.rlimit_memory_vms_hard | 进程上用于虚拟内存的硬资源限制。 |
| procstat.rlimit_memory_vms_soft | 进程上用于虚拟内存的软资源限制。 |
| procstat.rlimit_nice_priority_hard | 进程良好状态优先级值上限的硬资源限制。 |
| procstat.rlimit_nice_priority_soft | 进程良好状态优先级值上限的软资源限制。 |
| procstat.rlimit_num_fds_hard | 进程文件描述符的硬资源限制。 |
| procstat.rlimit_num_fds_soft | 进程文件描述符的软资源限制。 |
| procstat.rlimit_realtime_priority_hard | 进程实时优先级值上限的硬资源限制。 |
| procstat.rlimit_realtime_priority_soft | 进程实时优先级值上限的软资源限制。 |
| procstat.rlimit_signals_pending_hard | 待交付到进程的信号数量的硬资源限制。 |
| procstat.rlimit_signals_pending_soft | 待交付到进程的信号数量的软资源限制。 |
| procstat.signals_pending | 待进程处理的信号数。 |
| procstat.voluntary_context_switches | 进程自主上下文切换的次数。 |

来源：[AWS DOCS - 使用 procstat 插件收集进程度量标准](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-procstat-process-metrics.html)

<a name="Container"></a>

# 容器

收集以下按容器的资源利用率度量标准。

<a name="ConCPU"></a>

## CPU 使用率度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `cpus.limit`    | 分配的 CPU 份额数量。 |
| `cpus.system_time_secs`    | 按秒计的内核模式下花费的总 CPU 时间。 |
| `cpus.throttled_time_secs`    | 按秒计的 CPU 被限制总时间。 |
| `cpus.user_time_sec`s    | 用户模式下花费的 CPU 总时间。 |

<a name="ConDisk"></a>

## 磁盘度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `disk.limit_bytes`    | 按字节计的磁盘硬容量限制。 |
| `disk.used_bytes`    | 按字节计的已用硬容量。 |

<a name="ConMem"></a>

## 内存度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `mem.limit_bytes`    | 容器的硬内存限制。 |
| `mem.total_bytes`    | RAM 中进程的总内存（与交换时相反）。 |   

<a name="ConNetwork"></a>

## 网络度量标准

| 度量标准            | 描述                  |
|-------------------|------------------------------|
| `net.rx.bytes`    | 接收的字节数。 |
| `net.rx.dropped`    | 接收时丢失的数据包数。 |
| `net.rx.errors`    | 接收时报告的错误数。 |
| `net.rx.packets`    | 接收的数据包数。 |
| `net.tx.bytes`    | 发送的字节数。 |
| `net.tx.dropped`    | 发送时丢失的数据包数。 |
| `net.tx.errors`    | 发送时报告的错误数。 |
| `net.tx.packets`    | 发送的数据包数。 |

<a name="Dimensions"></a>

# 维度

维度是指关于度量标准的元数据。下表列出了可用的维护和它们出现所在的实体。

| 维度 | 描述 | 实体 |
|-----------|-------------|--------|
| `mesos_id`    | 节点的 Mesos ID。 | 节点，容器 |
| `cluster_id`    | Mesos 群集的 ID。 | 节点，容器 |
| `container_id`  | 容器的 ID。  | 度量标准，容器 |
| `executor_name`   |  任务执行器的名称。 | 度量标准 |
| `framework_name`   | 框架名称。  | 容器 |
| `hostname`   | 节点的 IP  地址。  | 容器，节点 |
| `labels`   |  描述度量标准的键值对。  | 容器 |
| `task_name`   | 任务名称。  | 容器 |


请查看以下资源，获取有关度量标准的更多信息：
1. [其他 Mesos 卷和网络度量标准](http://mesos.apache.org/documentation/latest/monitoring/) 文档。

