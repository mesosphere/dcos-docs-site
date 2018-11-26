---
layout: layout.pug
excerpt: 第 4 部分 - 连接应用程序/服务发现
title: 教程 - 连接应用程序/服务发现
navigationTitle: 服务发现
menuWeight: 4
---

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的仅仅是为了演示功能，它可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您应该进行调整、验证和测试。</td> 
</tr> 
</table>

欢迎阅读 DC/OS 101 教程第 4 部分


# 先决条件
* [正在运行的 DC/OS 集群](/cn/1.11/tutorials/dcos-101/cli/)，[已安装 DC/OS CLI](/cn/1.11/tutorials/dcos-101/cli/)。
* [app1](/cn/1.11/tutorials/dcos-101/app1/) 已部署并在您的集群中运行。


# 目的
本教程前一部分中的 [app] (https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) 使用 `redis.marathon.l4lb.thisdcos.directory` 作为连接 Redis 的地址，端口为 6379。由于 Redis 可能正在集群中的任何代理程序上运行，并且可能在不同的端口上运行，因此该地址如何解析到实际运行的 Redis 实例？

在本部分中，您将通过探索 DC/OS 中应用程序的不同选项，了解 DC/OS 服务发现。

# 服务发现
 [服务发现](/cn/1.11/networking/)使应用程序能够不依赖于于其在集群中的运行位置进行寻址，这在应用程序可能出现故障并在不同主机上重新启动时尤其有用。

 DC/OS 提供两种服务发现选项：

 1. Mesos-DNS
 1. 命名虚拟 IP。


通过 SSH 进入集群中的 Mesos 管理节点，以查看这些不同的服务发现方法的工作方式：

`dcos node ssh --master-proxy --leader`

# Mesos-DNS

 [Mesos-DNS](/cn/1.11/networking/mesos-dns/) 为每个任务分配 DNS 条目，这些条目可从集群中的任何节点解析。这些条目的命名模式为 *task.scheduler.mesos*

 作业的默认调度程序为 [Marathon](/cn/1.11/overview/architecture/components/#marathon)，因此，Redis 服务的 Mesos-DNS 名称为 *redis.marathon.mesos*。

 我们将使用 [dig](https://linux.die.net/man/1/dig) 命令以检索地址记录（也称为 A 记录）。Dig 是一个命令行实用程序，用于查询 DNS 服务器。如果在没有参数的情况下使用，它将使用系统范围配置的 DNS 服务器进行查询，在 DC/OS 集群中将其配置为指向 Mesos-DNS：

  `dig redis.marathon.mesos`

 答案应与此响应类似：

  ```
  ;; ANSWER SECTION:
  redis.marathon.mesos. 60  IN  A 10.0.0.43
  ```

 响应告诉我们，在 10.0.0.43 处有一个 `redis.marathon.mesos` 服务实例。

 A 记录仅包含有关主机的 IP 地址信息。若要连接到该服务，您还需要知道端口。为了实现这一操作，Mesos-DNS 还为每个包含端口号的 Marathon 应用程序分配服务或 SRV 记录。

 使用以下 dig 命令访问 SRV 记录：

  `dig srv _redis._tcp.marathon.mesos`

 答案应与此响应类似：

  ```
  ;; ANSWER SECTION:
  _redis._tcp.marathon.mesos. 60  IN  SRV 0 0 30585 redis-1y1hj-s1.marathon.mesos.

  ;; ADDITIONAL SECTION:
  redis-1y1hj-s1.marathon.mesos. 60 IN  A 10.0.0.43
  ```

 此输出告诉您 Redis 服务正在 `10.0.0.43:30585` 上运行

# 命名虚拟 IP

 * [命名 VIP](/cn/1.11/networking/load-balancing-vips/) 让您将名称/端口对分配到应用程序，这意味着您可以使用可预测的端口为应用程序提供有意义的名称。当使用应用程序的多个实例时，它们还提供内置的负载均衡。例如，您可以通过将以下内容添加到软件包定义中，将已命名的 VIP 分配给 Redis 服务：

  ```
  "VIP_0": "/redis:6379"
  ```

 然后使用以下模式生成全名：
 vip-name.scheduler.l4lb.thisdcos.directory:vip-port

 正如我们从示例[应用程序](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py)中看到的，这是 redis 软件包使用的机制，因此您可以从集群中的 `redis.marathon.l4lb.thisdcos.directory:6379` 访问 Redis 服务。

# 结果
您知道如何使用服务发现从 DC/OS 集群中连接到您的应用程序，并了解了 DC/OS 中可用的两种服务发现机制。

# 深入研究
[Mesos-DNS](#mesos-dns) 和[已命名的 VIP](#named-vips) 之间有什么区别？

## Mesos-DNS
Mesos-DNS 是在集群中查找应用程序的简单解决方案。虽然 DNS 受许多应用程序支持，但 Mesos-DNS 具有以下缺点：

 * DNS 缓存：应用程序有时会缓存 DNS 条目以提高效率，因此可能没有更新的地址信息（例如，在任务失败后）。
 * 您需要使用 SRV DNS 记录来检索有关已分配端口的信息。虽然应用程序通常能理解 DNS A 记录，但并非所有应用程序都支持 SRV 记录。


## 已命名的 VIP
已命名的 VIP 使用智能算法对 IP 地址/端口对进行负载均衡，以确保与原始请求者对应的流量的最佳路由，并且还提供用于高性能的本地缓存层。它们还让您为应用程序提供有意义的名称并选择特定端口。由于这些优于 Mesos-DNS 的优势，我们建议使用已命名的 VIP 作为 DC/OS 中默认的服务发现方法。
