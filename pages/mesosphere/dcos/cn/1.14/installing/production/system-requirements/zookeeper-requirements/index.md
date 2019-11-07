---
layout: layout.pug
title: ZooKeeper 资源
navigationTitle: ZooKeeper 资源
menuWeight: 10
excerpt: 对 DC/OS 群集中 ZooKeeper 的要求和建议
---
ZooKeeper 是一项集中协调服务，存储、维护并同步分布式系统的信息。ZooKeeper 及其管理服务维护状态信息并记录数据目录中节点活动的详细信息。由于对群集进行更改，这些更改记录在 ZooKeeper 事务日志中。当事务日志变得过大时，ZooKeeper 将创建群集节点当前状态的快照。

# 为什么规划 ZooKeeper 资源很重要
作为 DC/OS 平台架构的基本组成部分，ZooKeeper 为 DC/OS 群集执行几个关键任务。例如，ZooKeeper 识别哪个管理节点用作领导者并协调领导者选择，以便此信息可用于其他管理节点、代理节点和调度程序。

因为 ZooKeeper 状态、运作和性能可直接影响 DC/OS 群集的稳定性、弹性和性能，因此，重要的是优化 ZooKeeper 配置，以有效而高效地处理预期群集工作负载。例如，ZooKeeper 写入性能方面的问题往往会导致延迟相关问题并降低群集性能。

# 事务日志和快照
ZooKeeper 维持 Marathon 编排服务的状态信息，并且在其事务日志和快照中延续数据。对于 DC/OS 群集，ZooKeeper 快照和事务日志都存储在 `/var/lib/dcos/exhibitor` 目录中，并由 Exhibitor 服务管理。使用 DC/OS Exhibitor 的专用日志设备 (`dcos-exhibitor`) 日志文件可帮助避免资源争用和延迟问题。有关基本系统资源要求和磁盘分区的更多信息，请参见 [系统要求](/mesosphere/dcos/1.14/installing/system-requirements)。

# 识别潜在问题
您可以识别 ZooKeeper 相关问题的一个重要方法是，搜索 DC/OS Exhibitor (`dcos-exhibitor`) 日志文件以查看是否有与同步 (`fsync`) 操作相关的消息。如果写入事务日志时存在磁盘延迟问题，ZooKeeper 可能会记录类似以下内容的消息：

`WARN SyncThread:14  fsync-ing the write ahead log in SyncThread:14 took 14818ms which will adversely effect operation latency. See the ZooKeeper troubleshooting guide`

# 健康 DC/OS 群集的建议
因为 ZooKeeper 跟踪状态，因此它对网络延迟导致的超时很敏感。如果您遇到网络带宽超载的问题或客户端会话因网络连接太慢而被终止的问题，这些问题也会让 DC/OS 群集不太可靠。

为确保您拥有健康 DC/OS 群集，应遵循以下指导来部署和管理 ZooKeeper。

## 监控内存和交换
您应该验证 ZooKeeper 是否有足够的堆内存。内存分配不足会影响 ZooKeeper 的性能，尤其是在垃圾数据收集期间。然而，具体的内存要求取决于节点、客户端和已为群集部署的调度程序的数量，以及您需要运行的总体群集工作负载。

大多数情况下，还应配置 ZooKeeper 安装，以禁止内存交换。要让 ZooKeeper 操作能够及时正确运行，应避免允许使用交换空间。为 ZooKeeper 分配的最大堆大小应不大于可供 ZooKeeper 使用的实际内存。

监控磁盘设备读写性能的一种简单方法是，运行以下命令来测量服务器吞吐量和服务器延迟：
<p>
<code>dd if=/dev/zero of=/tmp/test1.img bs=1024 count=1</code><br> 
<code>dd if=/dev/zero of=/tmp/test2.img bs=1024 count=1000</code>

## 将管理节点与代理节点隔离

将管理节点与代理节点隔离，以防止存储器和 CPU 争用，尤其是当工作负载在代理节点开始时。

当 ZooKeeper 事务日志文件存储在与其他组件相同的固态磁盘 (SSD) 上时，如果 ZooKeeper 写性能成为减缓或延迟其他工人线程的处理的瓶颈，将会出现最常见的 ZooKeeper 问题。
    
ZooKeeper 不应与任何其他进程或服务共享资源。在执行更新或向客户端发送响应之前，ZooKeeper 将新事务写入日志。为 ZooKeeper 事务日志目录分配磁盘空间可以防止其他应用程序的 I/O 处理使磁盘过载。
    
应确保 ZooKeeper 目录配置成使用可以及时完成同步 (`fsync`) 操作的快速磁盘。

## 为管理节点调配 ZooKeeper 目录
应将每个管理节点的 `/var/lib/dcos` 目录放在单独的专用磁盘上，以减少延迟问题。使用专用分区可能还不够。将日志放入繁忙或共享设备会不利地影响性能。
    
## 检查系统和网络配置
除 ZooKeeper 特定的建议以外，还应监控系统和网络度量标准，并执行任何其他有助于降低来自其他进程和节点的 I/O 争用的管理操作。
