---
layout: layout.pug
navigationTitle: 设置分区和分域
title: 设置分区和分域
menuWeight: 15
excerpt: 使用 DC/OS 中的高可用性功能
---

本专题讨论 DC/OS 中的高可用性 (HA) 功能，以及在 DC/OS 上构建 HA 应用程序的最佳做法。

# 术语

## 分区
区域是具有隔离电源、网络和连接的故障域。通常，分区是企业内部或云提供商管理的单个数据中心或独立的故障域。例如，AWS 可用性分区或 GCP 分区。分区内的服务器通过高带宽（例如，1-10+ Gbps）、低延迟（高达 1 ms）和低成本链接建立连接。

## 分域
分域是由一个或多个分区组成的地理分域，例如一片主要都会区域。分域内的分区通过高带宽（例如，[1-4 Gbps](https://blog.serverdensity.com/network-performance-aws-google-rackspace-softlayer/)）、低延迟（高达 10 ms）、低成本建立链接。分域通常通过可变带宽通过公共互联网连接（例如，10-100 Mbps(https://cloudharmony.com/speedtest-for-aws)） 和延迟 ([100-500 ms](https://www.concurrencylabs.com/blog/choose-your-aws-region-wisely/)) 链接，在公告互联网上建立连接。

## 机架
机架通常由一组服务器（节点）组成。机架有自己的电源和开关，它们全都安装在同一框架上。在 AWS 等公共云平台上，没有等同于机架的概念。

# 一般建议

## 延迟
DC/OS 管理节点应通过高可用性和低延迟网络链路相互连接。必须这样做，因为在这些节点上运行的一些协作组件使用法定个数写入以实现高可用性。例如，Mesos 管理节点、Marathon 调度器和 ZooKeeper 使用法定个数写入。

同样，大多数 DC/OS 服务使用 ZooKeeper（或 `etcd`、`consul`等等）实现调度器首要实例选择和状态存储。要实现这一目标，服务调度器必须通过高可用性、低延迟网络链接连接到 ZooKeeper 组件。

## 路由
DC/OS 网络需要一个唯一的地址空间。集群实体不能共享相同的 IP 地址。例如，应用程序和 DC/OS 代理必须具有唯一 IP 地址。所有 IP 地址都应在集群内进行路由。

## 首要/从属架构

HA 系统中的常见模式是首要/从属概念。这有时也被称为主/从、正本/副本或这些内容的其他组合。当您拥有一个权威进程和几个备用进程时，可以使用此架构。在某些系统中，待机进程也能答复请求或执行其他操作。例如，当与正本/副本一起运行 MySQL 等数据库时，该副本可以答复只读请求，但不能接受写入（只有管理节点才接受写入）。

在 DC/OS 中，许多组件都遵循首要/从属模式。我们将在本文讨论其中部分组件及其工作方式。

#### Mesos

Mesos 可以高可用性模式运行，需要运行三个或五个管理节点。在 HA 模式下运行时，一个管理节点被选为首要节点，其他管理节点则是从属节点。每个管理节点都有一个复制日志，其中包含有关集群的某种状态。首要管理节点通过由 ZooKeeper 进行首要节点选举即可选出。如需更多信息，请参阅 [Mesos HA 文档](https://mesos.apache.org/documentation/latest/high-availability/)。

#### Marathon

Marathon 可以允许运行多个 Marathon 实例（ HA 模式下至少是两个），其中选中一个首要实例。Marathon 使用 ZooKeeper 选择首要实例。从属实例不接受写入或 API 请求；相反，从属实例代理所有 API 请求给 Marathon 首要实例。

#### ZooKeeper

DC/OS 中的许多服务都使用 ZooKeeper 以取得一致性。ZooKeeper 可用作分布式锁定服务、状态存储库和消息传递系统。ZooKeeper 使用 [Paxos-like](https://en.wikipedia.org/wiki/Paxos_%28computer_science%29) 日志复制和首要/从属架构，以保持多个 ZooKeeper 实例之间的一致性。参见 [ZooKeeper 内部文档](https://zookeeper.apache.org/doc/r3.4.8/zookeeperInternals.html)，了解有关 Zookeeper 工作原理的更多信息。

## 故障域隔离
故障域隔离是构建 HA 系统的重要组成部分。为正确处理故障情形，系统必须跨故障域分布，以便在故障后存活。以下是各种类型的故障域：

 * 物理域：包括机器、机架、数据中心、地区和可用性区域。
 * 网络域：同一网络内的机器可能会受网络分区的影响。例如，共享网络交换机可能发生故障或者有无效的配置。

如需更多信息，请参阅 [多分区](/cn/1.11/installing/production/advanced-configuration/configuring-zones-regions/multi-zone/) 和 [多分域](/cn/1.11/installing/production/advanced-configuration/configuring-zones-regions/multi-region/) 文档。

需要 HA 的应用程序也应跨故障域分配。Marathon 可以使用 [`UNIQUE` 和 `GROUP_BY` 约束算子](https://mesosphere.github.io/marathon/docs/constraints.html) 来实现。

## 问题的分离

HA 服务应当分离，责任在服务之间分派。例如，Web 服务应从数据库和共享缓存中分离。

## 消除单个故障点

单个故障点有多种形式。例如，当系统中的所有服务共用一个 ZooKeeper 集群时，类似 ZooKeeper 的服务可能成为单个故障点。可以通过运行多个 ZooKeeper 集群分别处理服务来降低风险。Exhibitor [Universe 包](https://github.com/mesosphere/exhibitor-dcos) 可以简化该操作。

其他常见的单个故障点包括：

- 单个数据库实例（如 MySQL）
- 一次性服务
- 非 HA 负载均衡器

## 快速故障检测

快速故障检测有多种形式。ZooKeeper 等服务可用于提供故障检测，例如检测网络分区或主机故障。服务运行状况也可用于检测某些类型的故障。

**注意：** 建议服务应披露运行状况终端，用于 Marathon 等服务。

## 快速故障切换

发生故障时，故障切换 [应尽可能快](https://en.wikipedia.org/wiki/Fail-fast)。

快速故障切换可通过以下方式实现：

 * 使用 HA 负载均衡器，如 [Marathon-LB](/cn/1.11/networking/marathon-lb/)，或内部 [第 4 层负载均衡器](/cn/1.11/networking/load-balancing-vips/)。
 * 根据 [12 因素应用] 原则构建应用程序(http://12factor.net/)。
 * 在构建服务时遵循 REST 最佳做法：尤其要避免在请求之间在服务器上存储客户端状态。

许多 DC/OS 服务在出现错误时遵循故障快速切换模式。具体而言，出现不可恢复的情况时（如失去首要节点），Mesos 和 Marathon 都将关闭。
