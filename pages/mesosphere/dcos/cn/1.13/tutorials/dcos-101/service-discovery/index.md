---
layout: layout.pug
navigationTitle: 发现部署的服务
title: 发现部署的服务
excerpt: 演示如何发现并连接到您的 DC/OS 群集中的服务（第 7 部分）
menuWeight: 7
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
在上一教程中，您部署了连接到 Redis 服务的 [示例应用程序](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py)。如果您查看该应用程序的脚本，则可能已经注意到以下连接到 Redis 服务的行：

```
print("Running on node '"+  os.getenv("HOST") + "' and port '" + os.getenv("PORT0"))
r = redis.StrictRedis(host='redis.marathon.l4lb.thisdcos.directory', port=6379, db=0)
if r.ping():
       print("Redis Connected. Total number of keys:", len(r.keys()))
else:
       print("Could not connect to redis")
```

在示例应用程序脚本的此摘录中，您可以看到应用程序使用：
- **redis.marathon.l4lb.thisdcos.directory** 作为服务地址。
- 端口 **6379** 作为服务端口。

但是，请注意，分布式计算环境的优势之一是，服务（如，本示例中的 Redis 服务）可能在群集中的任何代理上运行。此外，用于访问服务的主机地址和端口号可以根据群集中的更改（例如故障节点）而动态更改。

本教程探讨 DC/OS 如何确定特定服务实例正在运行的 IP 地址和端口。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您可以通过至少一个管理节点和三个代理节点来访问运行中的 [DC/OS 群集](../start-here/)。
- 您可以访问安装了 [DC/OS CLI](../cli/) 的计算机。
- 您在群集中部署和运行了示例 [dcos-101/app1](../first-app/) 应用程序。
- 您在用于连接到群集的计算机上拥有可用的域信息命令行实用程序 `dig`。`dig` 实用程序是大多数 Linux 分发中默认安装的 DNS BIND 实用程序的一部分。

# 学习目的
完成本教程，您将学习到：
- DC/OS 中可用的服务发现选项。
- DC/OS 如何解析服务地址以查找运行的实例。

# 服务发现选项
在 DC/OS 群集中，[服务发现](/mesosphere/dcos/1.13/networking/) 提供了一种查找应用程序的方法，无论它们在群集中运行何处。通过服务发现，您可以通过以下两种方式之一查找 DC/OS 群集中部署的服务正在运行的位置：

 - 通过 **Mesos 域命名服务 (Mesos-DNS)** 解析任务的专用或公共代理节点 IP 地址。

 - 通过手动设置 **命名虚拟 IP 地址**，该地址未通过 Mesos 域命名服务解析。

保持服务发现与传统 DNS 名称解析（其中服务记录与特定物理或虚拟 IP 地址相关联）分开，在应用程序失败并可能在不同主机上重新启动的情况下尤为有用。

<a name="mesos-dns"></a> 

## 使用 Mesos-DNS
最常见的服务发现选项是 Mesos-DNS。Mesos-DNS 为在群集内查找应用程序提供了一种相对简单的方法。[Mesos-DNS](../../../networking/DNS/mesos-dns/) 为每个任务分配 DNS 条目。然后，可从群集中的任何节点解析这些特定于任务的 DNS 条目。

Mesos-DNS 条目的命名模式为：
*task.scheduler.mesos*

由于您已部署的 Redis 服务的默认计划程序是 [Marathon](../../../overview/architecture/components/#marathon)，因此 Redis 服务的 Mesos-DNS 名称是 *redis.marathon.mesos* 或 *redis-tutorial.marathon.mesos*。

### 查找主机地址 (A) 记录
您可以使用 DNS 查询工具（例如 [dig](https://linux.die.net/man/1/dig)）从 DNS 域名服务器中检索地址 (A) 和服务 (SRV) 记录。在 DC/OS 群集中，管理节点管理命名服务，并在默认情况下将其配置为使用 Mesos-DNS 作为主 DNS 服务。

1. 通过运行以下命令，打开安全外壳 (SSH) 会话来访问管理节点领导者：

      ```bash
      dcos node ssh --master-proxy --leader
      ```

1. 如果提示您确认连接到主机，请键入 `yes`。

1. 通过运行以下命令，查找 Redis 服务的 DNS 地址 (A) 记录 (`redis-tutorial.marathon.mesos` 在此示例中）：

      ```bash
      dig redis-tutorial.marathon.mesos
      ```

1. 查看此命令的输出以确定服务运行的位置：

      ```
      ; <<>> DiG 9.11.2-P1 <<>> redis-tutorial.marathon.mesos
      ;; global options: +cmd
      ;; Got answer:
      ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 36245
      ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

      ;; QUESTION SECTION:
      ;redis-tutorial.marathon.mesos.	IN	A

      ;; ANSWER SECTION:
      redis-tutorial.marathon.mesos. 60 IN	A	10.0.1.95

      ;; Query time: 0 msec
      ;; SERVER: 198.51.100.1#53(198.51.100.1)
      ;; WHEN: Tue Jun 25 18:04:19 UTC 2019
      ;; MSG SIZE  rcvd: 63
      ```

      在 ANSWER 部分中，您可以看到此示例中的服务正在 IP 地址为 10.0.1.95 的主机上运行。

### 查找主机服务端口 (SRV) 记录
若要连接到该服务，您还需要知道端口。在检索此信息时，Mesos-DNS 为每个 Marathon 应用程序分配包含端口号的服务 (SRV) 记录。

1. 通过运行以下命令，查找 Redis 服务的 DNS 服务 (SRV) 记录 (在此示例中是 `redis-tutorial.marathon.mesos` ）：

      ```bash
      dig srv _redis-tutorial._tcp.marathon.mesos
      ```

1. 查看此命令的输出以确定服务运行的端口：

      ```
      ; <<>> DiG 9.11.2-P1 <<>> srv _redis-tutorial._tcp.marathon.mesos
      ;; global options: +cmd
      ;; Got answer:
      ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 31738
      ;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

      ;; QUESTION SECTION:
      ;_redis-tutorial._tcp.marathon.mesos. IN	SRV

      ;; ANSWER SECTION:
      _redis-tutorial._tcp.marathon.mesos. 60	IN SRV	0 1 24936 redis-tutorial-xyipd-s1.marathon.mesos.

      ;; ADDITIONAL SECTION:
      redis-tutorial-xyipd-s1.marathon.mesos.	60 IN A	10.0.1.95

      ;; Query time: 0 msec
      ;; SERVER: 198.51.100.1#53(198.51.100.1)
      ;; WHEN: Tue Jun 25 18:15:33 UTC 2019
      ;; MSG SIZE  rcvd: 127
      ```

      在 ANSWER 部分中，您可以看到此示例中的服务正在端口 24936 上运行。IP 地址 10.0.1.95。

通过这两个命令提供的信息，您知道该群集中的 Redis 服务在代理节点主机 10.0.1.95 上运行，并且使用端口 24936。

### 使用 Mesos-DNS 的限制
使用 Mesos-DNS 进行服务发现适用于许多应用程序，但具有以下缺点：

- 应用程序有时会缓存 DNS 条目以提高效率。如果应用程序缓存 DNS 信息，则 Mesos-DNS 服务可能无法提供更新的地址信息，例如，在任务失败之后。

- 您必须使用 SRV DNS 记录来检索有关已分配端口的信息。虽然大多数应用程序支持 DNS 地址 (A) 查找请求，但并非所有应用程序都支持 DNS 服务 (SRV) 记录。

<a name="named-vips"></a> 

## 使用命名虚拟 IP 地址
[命名虚拟 IP 地址 (VIPs)](../../../networking/load-balancing-vips/) 使您能够手动将名称和端口号对分配至应用程序。通过此类型的服务发现，您可以向应用程序提供带可预测的端口信息的可识别名称。

虚拟 IP 地址还允许您在应用程序存在多个实例时利用 DC/OS 内部第 4 层负载均衡。例如，您可以通过将以下内容添加到软件包的应用定义中，将命名虚拟 IP 地址分配给 Redis 服务：

```json
"VIP_0": "/redis:6379"
```

 然后使用以下格式生成全名：
 
 *vip-name.scheduler.l4lb.thisdcos.directory:vip-port*

这是示例 [应用](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.py) 中使用的发现方法，允许在 `redis.marathon.l4lb.thisdcos.directory:6379` 从群集中访问 Redis 服务。

命名虚拟 IP 地址提供以下优势：
- IP 地址/端口对的负载均衡可以使用与原始请求者相关的优化流量路由的算法。

- 虚拟 IP 地址提供实现高性能的本地缓存层。

- 您可以为应用程序提供有意义的名称并选择特定端口。

由于这些优点优于 Mesos-DNS，因此在大多数情况下，应使用命名虚拟 IP 地址在 DC/OS 中进行服务发现。

# 后续步骤
您知道如何使用服务发现从 DC/OS 群集中连接到您的应用程序，并了解了 DC/OS 中可用的两种服务发现机制。

# 相关主题
现在您已经对 [Mesos-DNS](#mesos-dns) 和 [命名虚拟 IP 地址](#named-vips) 网络有了基本了解，您可能希望更详细地探索这些和其他 [networking](../../.../networking/) 选项。
