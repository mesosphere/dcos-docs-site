---
layout: layout.pug
navigationTitle:  Mesos-DNS
title: Mesos-DNS
menuWeight: 3
excerpt: 了解 Mesos DNS
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


[Mesos-DNS][1] 在群集内提供服务发现。它完全集成到 DC/OS，让群集上的应用程序和服务可以通过 [域名系统 (DNS)][2] 找到彼此，类似于服务在整个互联网中发现彼此的方式。

[Marathon][3] 启动的应用程序分配有名称，例如 `search.marathon.mesos` 或 `log-aggregator.marathon.mesos`。Mesos-DNS 将名称解析到节点的 IP 地址和应用程序所使用的端口。DC/OS 应用程序和服务通过创建 DNS 查询或通过 REST API 提出 HTTP 请求来发现其他应用程序的 IP 地址和端口。

# 设计

Mesos-DNS 专为可靠性和简单性而设计。它需要的配置很少，启动时能够自动指向 DC/OS 管理节点。Mesos-DNS 定期查询管理节点（默认为每 30 秒），以便从所有运行的服务检索所有运行任务的状态，并为这些任务生成 A 和 SRV DNS 记录。随着任务在 DC/OS 群集上启动、完成、失败或重启，Mesos-DNS 会更新 DNS 记录以反映最新状态。

如果 Mesos-DNS 进程失败，`systemd` 自动会将其重启。然后，Mesos-DNS 从 DC/OS 管理节点检索最新状态，并开始服务 DNS 请求，无需另外协调。Mesos-DNS 不需要共识机制、持久存储或复制日志，因为它并不执行对应用程序的心跳、健康监控或终身管理；此功能已内置到 DC/OS 管理节点、代理节点和服务中。

您可以通过添加额外的管理节点，以大量代理节点使群集中的 DNS 请求负载均衡；不需要另外配置。

![Mesos-DNS](/mesosphere/dcos/1.13/img/mesos-dns.png)

图 1. Mesos-DNS 集成

如图所示，Mesos-DNS 可选地与现有 DNS 基础架构集成。Mesos-DNS 直接回复代理节点在 DC/OS 群集中寻找应用程序和服务的查找请求。如果代理节点作出要求 DC/OS 群集之外主机名的 DNS 请求，Mesos-DNS 会查询外部域名服务器。只有在 DC/OS 群集节点必须为网络中其他地方或互联网上的系统解析主机名时，才需要外部域名服务器。

 [1]:https://github.com/mesosphere/mesos-dns
 [2]: http://en.wikipedia.org/wiki/Domain_Name_System
 [3]:https://github.com/mesosphere/marathon
