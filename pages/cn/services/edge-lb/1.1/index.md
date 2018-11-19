---
layout: layout.pug
navigationTitle: Edge-LB 1.1
title: Edge-LB 1.1
menuWeight: 0
excerpt: Edge-LB 将流量代理并负载均衡到在 DC/OS 上运行的所有服务。

enterprise: false
---

Edge-LB 将流量代理和负载均衡到在 DC/OS 上运行的所有服务。Edge-LB 提供北-南（外部到内部）负载均衡，而 [Minuteman 组件](/cn/1.11/networking/load-balancing-vips/) 提供东-西（内部到内部）负载均衡。

Edge-LB 利用 HAProxy，HAProxy 提供核心负载均衡和代理功能，例如，基于 TCP 和 HTTP 的应用程序的负载均衡、SSL 支持和健康状况检查。此外，Edge-LB 为零停机服务部署策略提供了一流的支持，例如，蓝色/绿色部署。Edge-LB 可以实时订阅 Mesos 并更新 HAProxy 配置。

# 架构

Edge-LB 具有 3 部分架构：
- [API 服务器](#edge-lb-api-server)
- [池](#edge-lb-pool)
- [负载均衡器](#edge-lb-load-balancer)

这些组件在 DC/OS 的顶部运行。

Edge-LB 作为 DC/OS 服务运行，由 [Marathon] 启动(/latest/deploying-services/)。Edge-LB 的 API 服务器组件启动负载均衡器池。从 Marathon 的角度来看，池也是另一个 DC/OS 服务。

下图显示了配置和外部请求如何通过 Edge-LB 进入应用程序后端任务。

将配置发送到 API 服务器，以控制池管理。

外部流量通过硬件负载均衡器进入负载均衡器池。池中的一个 Edge-LB 负载均衡器接受流量，并将其路由到 DC/OS 集群中的相应服务。

![Edge-LB 架构](/services/edge-lb/1.1/img/edge-lb-flow.png)

图 1. Edge-LB 架构

## <a name="edge-lb-api-server"></a>Edge-LB API 服务器

Edge-LB API 服务器是响应 CLI 命令并管理池的服务。

## <a name="edge-lb-pool"></a>Edge-LB 池

Edge-LB 池是一组配置相同的负载均衡器。进入池的流量在池内的负载均衡器之间均衡。负载均衡器池管理负载均衡器实例的数量及其位置等属性。池是 Edge-LB 内负载均衡器配置的最小单位。同一个池内的负载均衡器都相同。您可以配置 Edge-LB，以拥有附带不同配置的多个负载均衡器池。

## <a name="edge-lb-load-balancer"></a>Edge-LB 负载均衡器

这些是负载均衡器软件（例如，HAProxy）的单个实例。这些实例接受流量并将其路由到 DC/OS 集群中的相应服务。

# 多个 Edge-LB 实例

多个 Edge-LB 池可在多个 DC/OS 公用节点上进行配置，以创建高可用性负载均衡环境，并支持增加的吞吐量。有两个主要外部架构支持：

- 外部负载均衡器：配置多个 Edge-LB 池，使得 DC/OS 公用节点上的 Edge-LB 负载均衡器位于外部负载均衡器后部。将最终用户或客户端直接转到外部负载均衡器设备，然后负载均衡多个 Edge-LB 池之间的流量。外部负载均衡器可以是基于云的负载均衡器，例如，AWS Elastic 负载均衡器 (ELB)、Azure 负载均衡器或物理负载均衡器（例如，F5 或 Cisco ACE 设备）。


- 轮询 DNS：配置 DNS，使单个 DNS 条目响应与不同的 Edge-LB 池对应的 IP 地址。DNS 将在每个 Edge-LB 池的 VIP 之间进行轮询。
