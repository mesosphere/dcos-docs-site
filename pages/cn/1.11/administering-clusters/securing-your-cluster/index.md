---
layout: layout.pug
navigationTitle: 保护集群
title: 保护集群
excerpt: 理解 DC/OS 中的安全特性
menuWeight: 7
---

## 一般安全概念

DC/OS 基于 Linux 内核和 userspace。保护任何 Linux 系统的最佳实践
均适用于保护 DC/OS，包括设置正确
文件权限、限制 root 和普通用户帐户、
使用 iptables 或其他防火墙保护网络接口，并定期
应用配合 DC/OS 使用的 Linux 分发的更新，以确保系统
库、实用程序和核心服务（如 systemd 和 OpenSSH）安全。

## 安全区

在最高级别上，我们可以区分 DC/OS 部署中的三个安全区
，即管理、私有和公共安全区。

### 管理区

**管理** 区可通过 HTTP/HTTPS 和 SSH 连接访问，并
提供对管理节点的访问。它还提供
通过 URL 路由对集群中的其他节点的反向代理访问。安全起见，DC/OS 云
模板允许配置白名单，这样仅特定 IP 地址范围
可以访问管理区。

#### 保护 Admin Router 的步骤

默认情况下，Admin Router 将允许未加密的 HTTP 流量。这被视为
不安全，您必须提供有效的 TLS 证书并重定向
所有 HTTP 流量到 HTTPS 以适当地保护对您的集群的访问。

在您获得有效的 TLS 证书之后，在每个管理节点上安装证书。
将证书和私钥复制到一个熟悉的位置，如在此位置下
`/etc/ssl/certs`.

如果您在 Admin Router 前运行 HAProxy，您应该保护它们之间的通信安全。有关保护您的通信的信息，请参阅[文档](/cn/1.11/security/oss/tls-ssl/haproxy-adminrouter/)。

### 私有区

**私有** 区是一个非可路由网络，只能从
管理区或从公共区通过边缘路由器来访问它。已部署
的服务在私人区运行。该区是运行大部分代理
节点的地方。

### 公共区

可选的 **公共** 区是运行公共可访问的应用程序
的地方。通常，此区中仅运行少量代理节点。边
缘路由器将流量转发到在私有区中运行的应用程序。

公共区中的代理节点被标记为特殊角色，以便
仅特定任务可以在此处进行排程。这些代理节点都有公共
和私有 IP 地址，只有特定端口应在其
iptables 防火墙中打开。

默认情况下，使用基于云的安装程序时，如 AWS
CloudFormation 模板，大量公共区端口暴露于
互联网中。在生产系统中，您不太可能
暴露所有这些端口。除了
80 和 443（用于 HTTP/HTTPS 流量）端口，建议您关闭所有端口，并使用
[Marathon-LB](/cn/1.11/networking/marathon-lb/) 和 HTTPS
管理入口流量。

### 典型 AWS 部署

包括 AWS 负载均衡器的典型 AWS 部署如下所示：

![安全区](/cn/1.11/img/security-zones.jpg)

图 1. 安全区

Admin Router

Admin Router 控制对管理区的访问。

传入至 DC/OS 集群的 HTTP 请求通过 Admin
Router 代理（在其内核使用 [Nginx](http://nginx.org) 和
[OpenResty](https://openresty.org)） 对于未经认证的请求，Admin Router 拒绝
对大多数 HTTP 端点的访问。要让
请求得到身份认证，需要在其授权标头中提供
有效的认证令牌。可通过
认证流程获得令牌，具体参见下一节所述。

经过认证的用户有权在其
集群中执行任意操作。即，DC/OS 中目前没有极细化的访问控制，
仅提供可访问服务和不可访问服务这两种控制。

请参阅 [安全部分](/cn/1.11/security/) 了解更多信息。
