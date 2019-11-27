---
layout: layout.pug
navigationTitle:  高可用性
title: 高可用性
menuWeight: 6
render: mustache
model: /mesosphere/dcos/1.13/data.yml
excerpt: 了解 DC/OS 中的高可用特性和最佳实践
enterprise: false
---


# 领导者/追随者架构

高可用性 (HA) 系统的常见模式是领导者/追随者概念。这有时也被称为主控/代理、主要/副本或这些内容的某些组合。当您有一个权威进程及 N 个备用进程时使用。在某些系统中，备用进程也可能可以服务于请求或执行其他操作。例如，当与主控和副本一起运行 Mysql 等数据库时，该副本可以服务于只读请求，但不能接受写入；只有主控才接受写入。在 DC/OS中，许多组件都遵循领导者/追随者模式。我们将讨论其中部分组件及其工作方式。

#### Mesos

Mesos 可以高可用性模式运行，需要运行三个或五个主控。在 HA 模式下运行时，一个主控被选为领导者，其他主控则是追随者。每个主控都有一个复制了的日志，其中包含有关群集的某种状态。ZooKeeper 执行选举以选择领导主控。有关这方面的更多信息，请参阅 [Mesos HA 文档](https://mesos.apache.org/documentation/latest/high-availability/)。

#### Marathon

Marathon 可以高可用性模式与一个选举的领导者一起运行，使得可以运行多个 Marathon 实例（HA 为至少两个）。Marathon 使用 ZooKeeper 进行领导者选举。追随者不接受写入或 API 请求；相反，追随者代理所有 API 请求代理给领先的 Marathon 实例。

#### ZooKeeper

DC/OS 中的多个服务使用 ZooKeeper 以取得一致性。ZooKeeper 可用作分布式锁定服务、状态存储库和消息传递系统。ZooKeeper 使用 [Paxos-like](https://en.wikipedia.org/wiki/Paxos_(computer_science)) 日志复制和领导者/追随者架构，以保持多个 ZooKeeper 实例之间的一致性。有关 ZooKeeper 如何工作的详细说明，请参阅 [ZooKeeper 内部文档](https://zookeeper.apache.org/doc/r3.4.8/zookeeperInternals.html)。

# 故障域隔离
故障域隔离是构建 HA 系统的重要组成部分。为正确处理故障情形，系统必须跨故障域分布，以便在故障后存活。故障域有不同的类型，其中几个例子包括：

- 物理域：包括机器、机架、数据中心、地区和可用性区域。
- 网络域：同一网络内的机器可能会受网络分区的影响。例如，共享网络交换机可能发生故障或者配置无效。

通过 DC/OS，您可以在机架之间将主控分配给 HA。代理可以跨地区分配，建议您用描述其位置的属性来标记代理。ZooKeeper 等同步服务也应留在同一区域内，以减少网络延迟。有关详细信息，请参阅实现高可用性的 [配置区域和地区](/mesosphere/dcos/1.13/installing/production/advanced-configuration/configuring-zones-regions/)。

需要 HA 的应用程序应跨故障域分配。Marathon 可以使用 [`UNIQUE` 和 `GROUP_BY` 约束算子](https://mesosphere.github.io/marathon/docs/constraints.html) 来实现。

# 问题的分离

高可用性服务应当分离，责任在服务之间分担。例如，Web 服务应从数据库和共享缓存中分离。

# 消除单一故障点

单一故障点有多种形式。例如，当系统中的每个服务共用一个 ZooKeeper 群集时，类似 ZooKeeper 的服务可能成为单一故障点。您可以通过为单独的服务运行多个 ZooKeeper 群集来降低这些风险。Exhibitor [{{ model.packageRepo }} 包](https://github.com/mesosphere/exhibitor-dcos) 可以简化该操作。

其他常见的单一故障点包括：

- 单个数据库实例（如 MySQL）
- 一次性服务
- 非 HA 负载均衡器

# 快速故障检测

快速故障检测有多种形式。ZooKeeper 等服务可用于提供故障检测，例如检测网络分区或主机故障。服务健康状况检查也可用于检测某些类型的故障。作为最佳实践，服务应揭示健康检查端点，这可以被 Marathon 等服务所使用。

# 快速故障切换

发生故障时，故障切换 [应尽可能快](https://en.wikipedia.org/wiki/Fail-fast)。快速故障切换可通过以下方式实现：

 * 使用 HA 负载均衡器，如 [Marathon-LB](/mesosphere/dcos/services/marathon-lb/1.13/)，或内部 [第 4 层负载均衡器](/mesosphere/dcos/1.13/networking/load-balancing-vips/)。
 * 根据 [12 因素应用] (http://12factor.net/) 原则构建应用程序。
 * 在构建服务时遵循 REST 最佳做法：尤其是避免在请求之间在服务器上存储客户端状态。

许多 DC/OS 服务在出现错误时遵循故障快速切换模式。具体而言，出现不可恢复的情况时（如失去领导作用），Mesos 和 Marathon 都将关闭。
