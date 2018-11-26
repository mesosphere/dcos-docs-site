---
layout: layout.pug
navigationTitle: 负载均衡和虚拟 IP (VIP)
title: 负载均衡和虚拟 IP (VIP)
menuWeight: 0
excerpt: 了解负载均衡和虚拟 IP

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS 提供东西向第 4 层负载均衡器 (Minuteman)，可实现多层微服务架构。它充当 TCP 第 4 层负载均衡器，利用 Linux 内核中的负载均衡功能实现接近线路速率的吞吐量和延迟。

这些特性包括：
- 应用程序的分布式负载均衡。
- 促进集群内的东西向通信。
- 用户指定 DC/OS 服务的 FQDN 地址。
- 尊重运行状况检查。
- 自动为服务 FQDN 分配虚拟 IP。

您可以通过在应用定义中分配 [VIP] 来使用第 4 层负载均衡器(/1.11/networking/load-balancing-vips/virtual-ip-addresses/)。通过VIP创建一个任务或一组任务后，它们将自动可用于集群中的所有节点，包括管理节点。

启动一组任务时，DC/OS 将它们分配给集群中的一组节点。在每个集群代理节点上运行的 Minuteman 实例对负载均衡决策进行协调。每个代理节点上的 Minuteman 对 Linux 内核中的 IPVS 模块进行编程，其中所有任务的条目与给定服务相关联。这使得 Linux 内核可以按接近线路速率的速度进行负载均衡决策。Minuteman 跟踪这些任务的可用性和可达到性，并保持 IPVS 数据库与所有运行良好的后端均更新到最新的状态，意味着 Linux 内核可为每个进行负载均衡的请求选择实时后端。

### 要求

- 不要用防火墙保护节点之间的通信（允许所有 TCP/UDP）。
- 不要更改 `net.ipv4.ip_local_port_range` sysctl 参数的默认值。它应在 32768 到 60999 的范围内。
- 必须使用支持的 [操作系统](/cn/1.11/installing/production/system-requirements/)。

#### 持久连接
保持长时间运行的持久连接，否则您可以快速填满 TCP 套接字表。Linux 系统上的默认本地端口允许源连接的范围是从 32768 到 61000。这使得可以在给定源 IP 和目标地址和端口对之间建立 28232 连接。TCP 连接必须在收回前经历时间等待状态。Linux 内核的默认 TCP 时间等待期为 120 秒。如果没有持久连接，您将因每秒建立 235 个新连接而耗尽连接表。

#### 运行状况检查
使用 Mesos 进行运行状况检查。Mesos 运行状况检查显示在负载均衡层。Marathon 仅将**命令** [运行状况检查](/cn/1.11/deploying-services/creating-services/health-checks/) 转换为 Mesos 运行状况检查。您可以通过以下类似命令来模拟 HTTP 运行状况检查：

 ```bash
 test "$(curl -4 -w '%{http_code}' -s http://localhost:${PORT0}/|cut -f1 -d" ")" == 200
 ```

这可确保返回的 HTTP 状态代码为 200。它还假定您的应用程序邦定到本地主机。`${PORT0}` 被 Marathon 设置为变量。您不应使用 TCP 运行状况检查，因为它们可能提供有关服务活跃度的误导性信息。

**注意：** Docker 容器命令运行状况检查在 Docker 容器之内运行。例如，如果使用 cURL 检查 NGINX，则 NGINX 容器必须安装 cURL，或者容器必须 `/opt/mesosphere` 在 RW 模式下挂载。

## 故障排除

### DC/OS 覆盖虚拟网络
如果指定的 VIP 地址在网络中其他地方使用，将会出现问题。尽管 VIP 是一个 3 元组，但最好确保 VIP 专用的 IP 仅供负载均衡软件使用，并且在网络中根本未使用。因此，应该从 RFC1918 范围中选择 IP。

### 端点
端口 61420 必须打开才能让负载均衡器正常工作。因为负载均衡器维持部分网格，因此它需要确保节点之间的连接性不受阻碍。

## 后续步骤

- [为应用程序分配 VIP](/cn/1.11/networking/load-balancing-vips/virtual-ip-addresses/)
- [了解实施详情](https://github.com/dcos/minuteman)
