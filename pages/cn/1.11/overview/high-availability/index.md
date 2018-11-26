---
layout: layout.pug
navigationTitle: 高可用性
title: 高可用性
menuWeight: 6
excerpt: 了解 DC/OS 中的高可用特性和最佳实践

enterprise: false
---


# 首要/从属架构

高可用性 (HA) 系统的常见模式是首要/从属概念。这有时也被称为主/从、正本/副本或这些内容的其他组合。当您拥有一个权威进程和N个待机进程时，可以使用此架构。在某些系统中，待机进程也能发送请求或执行其他操作。例如，当与主控和副本一起运行 Mysql 等数据库时，该副本可以服务于只读请求，但不能接受写入；只有主控才接受写入。在 DC/OS 中，许多组件都遵循首要/从属模式。我们将讨论其中部分组件及其工作方式。

#### Mesos

Mesos 可以高可用性模式运行，需要运行三个或五个管理节点。在 HA 模式下运行时，一个管理节点被选为首要节点，其它管理节点则是从属节点。每个管理节点都有一个复制日志，其中包含有关集群的某种状态。ZooKeeper 执行选举以选择首要管理节点。有关这方面的更多信息，请参阅 [Mesos HA 文档](https://mesos.apache.org/documentation/latest/high-availability/)。

#### Marathon

Marathon 可以在高可用性模式中运行，，使得可以与一个选举的首要节点一起运行多个 Marathon 实例（HA 下至少两个）。Marathon 使用 ZooKeeper 选择首要实例。从属实例不接受写入或 API 请求；相反，从属实例将所有 API 请求代理给 Marathon 首要实例。

#### ZooKeeper

DC/OS 中的多个服务使用 ZooKeeper 以保持稳定性。ZooKeeper 可用作分布式锁定服务、状态存储库和消息传递系统。ZooKeeper 使用 [Paxos-like](https://en.wikipedia.org/wiki/Paxos_(computer_science)) 日志复制和首要/从属架构，以保持多个 ZooKeeper 实例之间的一致性。有关 ZooKeeper 如何工作的详细说明，请参阅 [ZooKeeper 内部文档](https://zookeeper.apache.org/doc/r3.4.8/zookeeperInternals.html)。

# 故障域隔离
故障域隔离是构建 HA 系统的重要组成部分。为正确处理故障情形，系统必须跨故障域分布，以便在故障后存活。故障域有不同的类型，其中几个例子包括：

- 物理域：包括机器、机架、数据中心、地区和可用性区域。
- 网络域：同一网络内的机器可能会受网络分区的影响。例如，共享网络交换机可能发生故障或者配置无效。


通过 DC/OS，您可以在机架之间将管理节点分配给 HA。代理可以跨地区分配，建议您用描述其位置的属性来标记代理。ZooKeeper 等同步服务也应留在同一区域内，以减少网络延迟。如需更多信息，请参阅配置高可用性 [文档](/cn/1.11/installing/production/advanced-configuration/configuring-zones-regions/)。

需要 HA 的应用程序应跨故障域分配。Marathon 可以使用 [`UNIQUE` 和 `GROUP_BY` 约束算子](https://mesosphere.github.io/marathon/docs/constraints.html) 来实现这点。

# 问题的分离

高可用性服务应当分离，责任在服务之间分担。例如，Web 服务应从数据库和共享缓存中分离。

# 消除单一故障点

单个故障点有多种形式。例如，当系统中的所有服务共用一个 ZooKeeper 集群时，类似 ZooKeeper 的服务可能成为单个故障点。您可以通过为不同的服务运行多个 ZooKeeper 集群来降低这些风险。Exhibitor [Universe 包](https://github.com/mesosphere/exhibitor-dcos) 使其变得简单。

其他常见的单个故障点包括：

- 单个数据库实例（如 MySQL）
- 一次性服务
- 非 HA 负载均衡器

# 快速故障检测

快速故障检测有多种形式。ZooKeeper 等服务可用于提供故障检测，例如检测网络分区或主机故障。服务运行状况检查也可用于检测某些类型的故障。作为最佳实践，服务应揭示运行状况检查端点，这可以被 Marathon 等服务所使用。

# 快速故障切换

发生故障时，故障切换 [应尽可能快](https://en.wikipedia.org/wiki/Fail-fast)。快速故障切换可通过以下方式实现：

 * 使用 HA 负载均衡器，如 [Marathon-LB](/cn/1.11/networking/marathon-lb/)，或内部 [第 4 层负载均衡器](/cn/1.11/networking/load-balancing-vips/)。
 * 根据 [12 因素应用] 原则构建应用程序(http://12factor.net/)。
 * 在构建服务时遵循 REST 最佳做法：尤其要避免在请求之间在服务器上存储客户端状态。

许多 DC/OS 服务在出现错误时遵循故障快速切换模式。具体而言，出现不可恢复的情况时（如失去首要地位），Mesos 和 Marathon 都将关闭。
