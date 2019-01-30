---
layout: layout.pug
excerpt: 了解分布式 DNS
title: 分布式 DNS
navigationTitle: 分布式 DNS
menuWeight: 3
---

任务在 DC/OS 中频繁四处移动，资源必须通过应用程序协议动态解析，并且通过名称来指代。这意味着 DNS 是 DC/OS 的一个组成部分。我们已选择 DNS 作为 DC/OS 中所有组件之间发现的通用语言，而不是在每个项目中实现 ZooKeeper 或 Mesos 客户端。

为此，我们使用在每个 DC/OS 管理节点上运行的 Mesos-DNS。在客户端系统中，我们将每个管理节点放入目录 `/etc/resolv.conf`。如果管理节点关闭，DNS 对该管理节点的查询将超时。DNS 转发器 (Spartan) 通过两次调度对多个管理节点的 DNS 查询并返回第一个结果来解决此问题。为进一步缓解风险，DNS 转发器 (Spartan) 将查询路由至其确定的最适合执行查询的节点。具体示说，如果某个域在 `mesos` 结束，它将向 Mesos 管理节点发送查询。如果没有在 `mesos` 结束，它会将查询发送至两个已配置的上游节点。

# 实现
DNS 转发器 (Spartan) 非常简单。它具有双重分派逻辑并托管一个域 `spartan`，该域只有一个记录 -- `ready.spartan`。该记录的目的是调查 DNS 转发器 (Spartan) 的可用性。包括 ICMP 在内的许多服务都会在开始之前 ping 此地址。DNS 转发器 (Spartan) 从 Exhibitor 了解信息。因此，Exhibitor 在管理节点上 [正确配置][1] 至关重要。或者，如果集群使用静态管理节点配置，它将从静态配置文件中加载它们。

## ZooKeeper
DNS 转发器 (Spartan) 还可实现 ZooKeeper 的高可用性。您始终可以使用地址 `zk-1.zk`、`zk-2.zk`、`zk-3.zk`、`zk-4.zk`、`zk-5.zk`。如果 ZooKeeper 少于五个，DNS 转发器 (Spartan) 将在单个 ZooKeeper 指定多个记录。

## 监视器
由于 DNS 是这样一个专用的敏感子系统，因此我们选择用监视器进行保护。每个节点上安装的服务每隔五分钟运行一次，并检查是否可以查询 `ready.spartan`。为避免谐波效应，它休眠到初始开始时间之后一分钟，以避免猛烈使用 Spartan。您可以在系统运行状况 [仪表盘][2] 中，监控作为 DNS 转发器 (Spartan) Watchdog 的监视器的系统运行状况。

除此监视器以外，我们还运行 `genresolv`，用于检查 DNS 转发器 (Spartan) 是否存活以生成 `resolv.conf`。如果它认为 DNS 转发器 (Spartan) 不存活，则会使用已配置到 DC/OS 集群中的上游解析器重写 `resolv.conf`。

## DNS 转发器接口
DNS 转发器 (Spartan) 创建自己的网络接口。此网络接口实际上是被称为 `spartan` 的简单设备。此设备主机托管三个 IP：`198.51.100.1/32`、`198.51.100.2/32`、`198.51.100.3/32`。您可以在系统运行状况 [仪表盘][2] 中，监控 DNS 转发器 (Spartan) 组件的健康状况。

[1]: /cn/1.11/installing/production/advanced-configuration/configuration-reference/
[2]: /cn/1.11/gui/dashboard/
