---
layout: layout.pug
navigationTitle: 度量标准参考
title: 度量标准参考
menuWeight: 7
excerpt: 了解 DC/OS 收集的度量标准
beta: false
enterprise: false
---
<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

Mesosphere DC/OS 可自动为节点和容器收集基本系统度量标准（例如 CPU 和内存）。Mesosphere DC/OS 还收集关于不同类别度量标准的元数据。有关元数据度量的更多信息，请参阅 [维度](#Dimensions)。

请注意，自动收集的度量标准仅适用于提供端点统计信息的容器。例如，Docker 容器不提供用于 DC/OS 的网络连接数据，因此可用于 UCR 容器的网络连接度量标准不适用于 Docker 容器。


# 节点

## CPU 和内存度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| cpu.idle | 空闲 CPU 百分比。|
| cpu.system | 所用系统百分比。|
| cpu.total | 所用 CPU 百分比。|
| cpu.user | 用户使用的 CPU 百分比。|
| cpu.wait | 等待操作完成时的空闲百分比。|
| load.1min | 过去一分钟的负载平均值。|
| load.5min | 过去 5 分钟的负载平均值。|
| load.15min | 过去 15 分钟的负载平均值。|
| memory.buffer | 内存缓冲区数。|
| memory.cached | 缓存内存的大小。|
| memory.free | 按字节计的可用内存量。|
| memory.total | 按字节计的总内存。|
| process.count | 正在运行的进程数。|
| swap.free | 自由交换空间的大小。|
| swap.total | 总交换空间。|
| swap.used | 已用交换空间的大小。|
| system.uptime | 系统正常运行时间。 |


## 文件系统度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| filesystem.capacity.free | 按字节计的可用容量大小。|
| filesystem.capacity.total | 按字节计的总容量。|
| filesystem.capacity.used | 按字节计的已用容量。|
| filesystem.inode.free | 按字节计的可用索引节数。|
| filesystem.inode.total | 按字节计的总索引节点数。|
| filesystem.inode.used | 按字节计的索引节点数。|

<p class="message--note"><strong>注意：</strong>标签 <code>路径</code> 根据本地文件系统的挂载路径自动填充（例如，<code>/</code>, <code>/boot</code> 等）。</p>


## 网络接口度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| network.in | 下载的字节数。|
| network.in.dropped | 丢失的已下载节字数。|
| network.in.errors | 出错的已下载字节数。|
| network.in.packet | 下载的数据包数量。|
| network.out | 上传的字节数。|
| network.out.dropped | 丢失的已上传字节数。|
| network.out.errors | 出错的已上传字节数。|
| network.out.packet | 上传的数据包数量。|

<p class="message--note"><strong>注意：</strong>标签 <code>接口</code> 根据网络接口的类型自动填充（例如，<code>spartan</code>、<code>d-dcos</code>、<code>minuteman</code> 等）。</p>


# 容器

收集以下按容器的资源利用率度量标准。


## CPU 使用率度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| cpu.limit | 分配的 CPU 份额数量。|
| cpus.system_time_secs | 按秒计的内核模式下花费的总 CPU 时间。|
| cpus.throttled_time_secs | 按秒计的 CPU 被限制总时间。|
| cpus.user_time_secs | 用户模式下花费的 CPU 总时间。|


## 磁盘度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| disk.limit_bytes | 按字节计的磁盘硬容量限制。|
| disk.used_bytes | 按字节计的已用硬容量。|


## 内存度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| mem.limit_bytes | 容器的硬内存限制。|
| mem.total_bytes | RAM 中进程的总内存（与交换时相反）。| 


## 网络度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| net.rx.bytes | 接收的字节数。|
| net.rx.dropped | 接收时丢失的数据包数。|
| net.rx.error | 接收时报告的错误数。|
| net.rx.packet | 收到的数据包数。|
| net.tx.bytes | 发送的字节数。|
| net.tx.dropped | 发送时丢失的数据包数。|
| net.tx.errors | 发送时报告的错误数。|
| net.tx.packet | 发送的数据包数。|


# 维度

维度是指关于度量标准的元数据。下表列出了可用的维度和它们出现所在的实体。

| 维度 | 描述 | 实体 |
|-----------|-------------|--------|
| mesos_id | 节点的 Mesos ID。| 节点，容器 |
| cluster_id | Mesos 群集的 ID。| 节点，容器 |
| container_id | 容器的 ID。| 公制，容器 |
| executor_name | 任务执行器的名称。| 度量标准 |
| framework_name | 框架的名称。| 容器 |
| 主机名 | 节点的 IP 地址。| 容器，节点 |
| 标签 | 描述度量标准的键值对。| 容器 |
| task_name | 任务名称。| 容器 |


如需更多信息，请参阅 [dcos-metrics 存储库](https://github.com/dcos/dcos-metrics) 文档。
