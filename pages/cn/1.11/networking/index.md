---
layout: layout.pug
navigationTitle: 网络
title: 网络
menuWeight: 70
excerpt: 了解 DC/OS 网络堆栈

enterprise: false
---

DC/OS 网络堆栈提供 
- [与容器的 IP 连接](#IP-connectivity)
- 内置 [基于 DNS 的服务发现](#DNS-discovery)
- 第 4 层和第 7 层 [负载均衡](#load-balancing)

# <a name="IP-connectivity"></a>IP 连接性
在 DC/OS 上运行的容器可使用以下三种网络模式之一获取 IP 地址：
* [主机模式网络](#host-mode)
* [桥接模式网络](#bridge-mode)
* [容器模式网络](#container-mode)

这三种网络模式都可用于所有容器，无论用于启动它们的容器运行时（UCR 或 Docker）如何。

## <a name="host-mode"></a>主机模式网络
在主机模式下，容器与其他 DC/OS 系统服务（如 Mesos 和 Marathon）在同一网络上运行。它们共享相同的 Linux 网络命名空间，看到的 IP 地址和端口与通过 DC/OS 系统服务看到的相同。主机模式网络最具限制性；它不允许容器使用整个 TCP/UDP 端口范围，且应用程序必须能够使用代理节点上可用的任何端口。

## <a name="bridge-mode"></a>桥接模式网络
在桥接模式下，容器在 Linux 网桥上启动，在 DC/OS 代理节点中创建。在该模式下运行的容器获得各自的 Linux 网络命名空间和 IP 地址；它们可以使用整个 TCP/UDP 端口范围。在固定应用程序端口时，此模式非常有用。使用此模式的主要问题是容器只能由另一代理节点上运行的容器通过端口映射规则访问。UCR 和 Docker 都为在桥接模式网络上启动的任何容器安装端口映射规则。

## <a name="container-mode"></a>容器模式网络
在该模式下，允许容器在各种软件定义网络 (SDN) 上运行。DC/OS 支持 UCR 容器的 [CNI（容器网络接口）](https://github.com/containernetworking/cni)标准和 Docker 容器的 [CNM（容器网络模型）](https://github.com/docker/libnetwork)标准。使用 CNI 和 CNM，DC/OS 能够将容器连接到支持 CNI 或 CNM 标准的 SDN 提供商定义的任何虚拟网络上。在这三种模式中，这是最灵活且功能最丰富的模式，因为容器获得了自己的 Linux 网络命名空间，并且底层 SDN 网络保证了容器之间的连接性，无需依赖代理节点上的端口映射规则。此外，由于 SDN 可通过防火墙提供网络隔离，并且非常灵活，因此可让操作员轻松运行多租户集群。该网络模式还允许容器的网络与主机网络完全隔离，通过保护其免受来自在 DC/OS 上运行的恶意容器的 DDOS 攻击，为主机网络提供额外的安全级别。


# <a name="DNS-discovery"></a>基于 DNS 的服务发现
DC/OS 包括基于 DNS 的高可用性的分布式服务发现。所有在 DC/OS 上运行的容器均有此功能，无论它们使用的网络模式如何。DC/OS 中基于 DNS 的服务发现机制由以下两个组件支持：

- 名为 Mesos DNS 的集中式组件，在每个管理节点上运行。
- 名为 `dcos-dns` 的分布式组件，作为被称为 `dcos-net` 的 Erlang 虚拟机中的应用程序运行。Erlang 虚拟机 `dcos-net` 在集群中的每个节点（代理和管理）上运行。

## Mesos DNS
Mesos DNS 是一个集中式的复制 DNS 服务器，在每个管理节点上运行。Mesos DNS 的每个实例都会轮询首要 Mesos 管理节点，并为由 DC/OS 启动的每个应用程序生成完全限定的域名 (FQDN)。所有这些 FQDN 的顶级域 (TLD) 为 `.mesos`。如需更多信息，请参阅 [Mesos DNS 文档](/cn/1.11/networking/DNS/mesos-dns/)。

## DCOS DNS
`dcos-dns` 是在每个代理节点和管理节点上运行的分布式 DNS 服务器，作为被称为 `dcos-net` 的 Erlang 虚拟机的一部分。这使其高度可用。在首要管理节点上运行的实例定期轮询首要管理节点的状态，并为由 DC/OS 启动的每个应用程序生成 FQDN。然后，它将此信息发送给集群中的其他 DCOS DNS 服务器。所有这些 FQDN 的 TLD 都为 `.directory`。

`dcos-dns` 拦截发源于代理节点的所有 DNS 查询。如果查询以 `.directory` TLD 结束，则它会在本地解析；如果以 `.mesos` 结束，则 `dcos-dns` 会把查询转发给在管理节点上运行的 `mesos-dns` 之一。否则，它会根据 TLD，将查询转发给已配置的上游 DNS 服务器。

`dcos-dns` 也充当 DNS 服务器，适合任何利用名为 [dcos-l4lb] 的 DC/OS 内部负载均衡器进行负载均衡的服务(/cn/1.11/networking/load-balancing-vips/)。通过 dcos-l4lb 进行负载均衡的服务均获得 [virtual-ip-address (VIP)](/cn/1.11/networking/load-balancing-vips/virtual-ip-addresses/) 以及 `"*.l4lb.thisdcos.directory"` 域中的 FQDN。然后，FQDN 将存储在 dcos-dns 中，并发送给集群中的其他 DCOS DNS 服务器。这为任何由 Minuteman 进行负载均衡的任务提供了高度可用的分布式 DNS 服务。如需更多信息，请参阅 [dcos-net 存储库](https://github.com/dcos/dcos-net/blob/master/docs/dcos_dns.md)。

# <a name="load-balancing"></a>负载均衡
DC/OS 为第 4 层和第 7 层负载均衡提供了不同的选项。以下章节介绍在这两个层上提供的各种特性。

## 第 4 层
[dcos-l4lb](/cn/1.11/networking/load-balancing-vips/) 是默认安装的分布式第 4 层东西向负载均衡器。它具有高度可扩展性和高可用性，提供零跃负载均衡，没有单个阻塞点，并容忍主机故障。 `dcos-l4lb` 作为 Erlang 虚拟机中的应用程序运行 `dcos-net`，其在集群中的所有代理节点和管理节点上运行。

## 第 7 层
DC/OS 中有两个软件包，即 [Edge-LB](/cn/services/edge-lb/) 和 [Marathon-LB](/cn/services/marathon-lb/)，为 DC/OS 服务提供第 7 层负载均衡。这两个软件包均使用 HAProxy 作为其数据平面，对进入集群的南北向流量进行负载均衡。虽然这些软件包主要用于提供第 7 层负载均衡（支持 HTTP 和 HTTPS），但它们也可为 TCP 和 SSL 流量提供第 4 层负载均衡。尽管这两个软件包使用的数据平面基本相同，但其提供的控制平面却截然不同。

### Edge-LB [enterprise type="small"]
Edge-LB 可支持 HAProxy 负载均衡实例池，可实现多租户支持。它配有自己的 CLI，可配置和启动实体池；它不仅支持 Marathon 应用程序，还支持由其他希望将其应用程序公开到集群之外 Mesos 框架管理的应用程序。Edge-LB 仅适用于 DC/OS Enterprise。

### Marathon-LB
Marathon-LB 要简单得多，只管理 HAProxy 的单个实例。它只能对 Marathon 启动的应用执行负载均衡。Marathon-LB 适用于 DC/OS 的开源版和企业版。

## 比较分析
尽管 Marathon-LB 和 Edge-LB 均设计用于处理南北向入口流量，但它们可用于内部东西向第 7 层负载均衡，必要时甚至是第 4 层东西向负载均衡。下表显示了对 DC/OS 中不同负载均衡解决方案的比较分析。


| 解决方案 | `dcos-l4lb` | Edge-LB | Marathon-LB |
|-----                               |-----------|---------|---|
| 开源 | X | | X |
| 企业 | X | X | X |
| 南北向（外部到内部） | | X | X |
| 东西向（内部到内部） | X | X | X |
| 第 4 层（传输层） | X | X | X |
| 第 7 层（应用层） | | X | X |
| Marathon 服务 | X | X | X |
| 非 Marathon 服务 | X | X | |
| 零跃负载均衡 | X | | |
| 无单一故障点 | X | | |


# 关于软件重构的说明
在 DC/OS 1.11 中，大多数网络组件（如 `dcos-dns`、`dcos-l4lb`、`dcos-overlay`）是作为在集群中所有节点上运行的名为 `dcos-net` 的单个 `systemd` 单元的一部分运行的应用程序。以 DC/OS 1.11 之前，每个应用程序 `dcos-dns`、`dcos-l4lb` 和 `dcos-overlay` 作为单独 `systemd` 单元运行。在 DC/OS 1.11 之前，`dcos-dns` 的职责由 `spartan` 履行，`dcos-l4lb` 由 `minuteman` 履行，`dcos-overlay` 由 `navstar` 履行。在 DC/OS 1.11 中，不同的 `systemd` 单元被聚合为单个服务。遵循这种操作模式的主要优点是，它可以更高效地利用资源（更低的 CPU 消耗和更低的内存），并且还使网络服务更加可靠。这种方法也使得代码的维护更容易。

与先前版本的 DC/OS 相比，DC/OS 1.11 提供了相同或更好的功能，但能更高效地使用资源。因此，即使该软件重构已经改变了用于在 DC/OS 内提供网络服务的内部机制，但从功能角度来看，应该看不到任何差异。
