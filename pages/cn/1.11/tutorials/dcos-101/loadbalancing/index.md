---
layout: layout.pug
navigationTitle: 负载均衡
excerpt: 第 8 部分 - 负载均衡
title: 教程 - 负载均衡
menuWeight: 8
---


<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的仅仅是为了演示功能，它可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您应该进行调整、验证和测试。</td> 
</tr> 
</table>
欢迎阅读 DC/OS 101 教程第 8 部分。


# 先决条件
* [正在运行的 DC/OS 集群](/cn/1.11/tutorials/dcos-101/cli/)，[已安装 DC/OS CLI](/cn/1.11/cli/install/)。
* [app2 和 Marathon-LB](/cn/1.11/tutorials/dcos-101/app2/) 已部署并在您的集群中运行。

# 目的
在本部分中，您将您的应用程序扩展到多个实例，并了解内部和外部服务在应用程序扩展后如何选择使用的实例。

# 步骤
负载均衡器决定应用程序内部或外部服务应使用的实例。使用 DC/OS，您有两种不同的内置负载均衡器选项：

1. [Marathon-LB](/cn/1.11/networking/marathon-lb/)
1. [命名 VIP](/cn/1.11/networking/load-balancing-vips/)。

您已经在[服务发现](/cn/1.11/tutorials/dcos-101/service-discovery/)中探讨了这些负载均衡机制，并且在[之前的](/cn/1.11/tutorials/dcos-101/marathon-lb/)教程中，您使用 Marathon-LB 公开了 app2。现在让我们再深入探讨一下。
* 首先，将 app2 扩展为两个实例：

  `dcos marathon app update /dcos-101/app2 instances=2`
* **Marathon-LB**
 *像以前一样通过 `http://<public-node>10000` 检查 app2。重复执行此操作时，您应该看到 app2 的不同实例所提供的请求。
 * 您还也可以通过 `http://<public-node>:9090/haproxy?stats` 检查 Marathon-LB 统计数据
* **命名 VIP**
 * 通过 SSH 连接到主导管理节点：`dcos node ssh --master-proxy --leader`
 * 使用 curl 从应用程序中获取原始 HTML 输出：

      `curl dcos-101app2.marathon.l4lb.thisdcos.directory:10000`

 重复执行此操作时，您应该看到不同实例所提供的请求。
* 将 app2 减少到一个实例：

  `dcos marathon app update /dcos-101/app2 instances=1`

# 结果
您使用 Marathon-LB 和 VIP 对应用程序的两个不同实例进行负载均衡请求。

# 深入研究
选择负载均衡机制时，请考虑这些功能和优点。

 * [Marathon-LB](/cn/1.11/networking/marathon-lb/) 是主要用于外部请求的第 7 层负载均衡器。它基于知名的 HAProxy 负载均衡器，并使用 Marathon 的事件总线实时更新其配置。作为第 7 层负载均衡器，它支持基于会话的功能，如 HTTP 粘滞会话和零停机部署。
 * [命名 VIP](/cn/1.11/networking/load-balancing-vips/) 是用于内部 TCP 流量的第 4 层负载均衡器机制。由于它们与内核紧密集成，因此它们提供负载均衡的 IP 地址，可以在集群中的任何位置使用。
