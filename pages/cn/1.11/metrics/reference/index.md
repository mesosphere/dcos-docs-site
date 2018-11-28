---
layout: layout.pug
navigationTitle: 度量标准参考
title: 度量标准参考
menuWeight: 2
excerpt: 了解 DC/OS 收集的度量标准
beta: false
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


这些度量标准由 DC/OS 自动收集。

# 节点

### CPU 和内存度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| cpu.core | 所用核心百分比。|
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
| system.uptime | 系统可靠性和负载平均值。|

### 文件系统度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| filesystem.capacity.free | 按字节计的可用容量大小。|
| filesystem.capacity.total | 按字节计的总容量。|
| filesystem.capacity.used | 按字节计的已用容量。|
| filesystem.inode.free | 按字节计的可用索引节数。|
| filesystem.inode.total | 按字节计的总索引节点数。|
| filesystem.inode.used | 按字节计的索引节点数。|

**注意：** 标签 `path` 根据本地文件系统的挂载路径自动填充（例如，`/`、`/boot`等）。

### 网络接口度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| network.in.bytes | 下载的字节数。|
| network.in.dropped | 丢失的已下载节字数。|
| network.in.errors | 出错的已下载字节数。|
| network.in.packet | 下载的数据包数量。|
| network.out.bytes | 上传的字节数。|
| network.out.dropped | 丢失的已上传字节数。|
| network.out.errors | 出错的已上传字节数。|
| network.out.packet | 上传的数据包数量。|

**注意：** 标签 `interface` 根据网络接口的类型自动填充（例如，`spartan`、`d-dcos`、`minuteman`等）。

# 容器

收集以下按容器的资源利用率度量标准。

### CPU 使用率度量标准
   <!-- https://github.com/apache/mesos/blob/1.0.1/include/mesos/v1/mesos.proto -->

| 度量标准 | 描述 |
|-------------------|------------------------------|
| cpu.limit | 分配的 CPU 份额数量。|
| cpu.system.time | 按秒计的内核模式下花费的总 CPU 时间。|
| cpu.throttled.time | 按秒计的 CPU 被限制总时间。|
| cpu.user.time | 用户模式下花费的 CPU 总时间。|

### 磁盘度量标准

| 度量标准 | 描述 |
|-------------------|------------------------------|
| disk.limit | 按字节计的磁盘硬容量限制。|
| disk.used | 按字节计的已用硬容量。|

### 内存度量标准
   <!-- https://github.com/apache/mesos/blob/1.0.1/include/mesos/v1/mesos.proto -->

| 度量标准 | 描述 |
|-------------------|------------------------------|
| mem.limit | 容器的硬内存限制。|
| mem.total | RAM 中进程的总内存（与交换时相反）。| 

### 网络度量标准
   <!-- http://mesos.apache.org/documentation/latest/port-mapping-isolator -->

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


## 维度

维度是指关于度量标准的元数据。下表列出了可用的维护和它们出现所在的实体。

| 维度 | 描述 | 实体 |
|-----------|-------------|--------|
| mesos_id | 节点的 Mesos ID。| 节点，容器 |
| cluster_id | Mesos 集群的 ID。| 节点，容器 |
| container_id | 容器的 ID。| 公制，容器 |
| executor_id | 任务执行器的 ID。| 公制，容器 |
| executor_name | 任务执行器的名称。| 度量标准 |
| framework_id | 框架的 ID。| 公制，容器 |
| framework_name | 框架的名称。| 容器 |
| framework_principal | 框架的主体。| 容器 |
| framework_role | 框架角色。| 容器 |
| 主机名 | 节点的 IP 地址。| 容器，节点 |
| 标签 | 描述度量标准的键值对。| 容器 |
| 来源 | 度量标准的来源。等同于执行器 ID。| 度量标准 |
| task_id | 任务 ID。| 容器 |
| task_name | 任务名称。| 容器 |


如需更多信息，请参阅 [dcos-metrics 存储库](https://github.com/dcos/dcos-metrics)。
