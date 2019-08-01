---
layout: layout.pug
navigationTitle: 保护群集
title: 保护群集
excerpt: 理解 DC/OS 中的安全特性
menuWeight: 7
---

# 一般安全概念

DC/OS 基于 Linux 内核和用户空间。保护任何 Linux 系统的最佳实践
均适用于保护 DC/OS，包括设置正确
文件权限、限制 root 和普通用户帐户、
使用 `iptables` 或其他防火墙保护网络接口，并定期
应用配合 DC/OS 使用的 Linux 分发的更新，以确保系统
库、实用程序和核心服务（如 systemd 和 OpenSSH）安全。

# 网络安全

您必须采用适当的网络机制，防止未经授权访问群集节点。

根据群集环境，这可能包括：
- 使用物理或虚拟子网隔离 [DC/OS 安全区]（#安全区）；
- 使用路由器防火墙或安全组限制对端口的访问；
- 在节点上使用防火墙软件（例如 `iptables`）限制对端口的访问。

使用这些机制提供以下连接：
- 在管理节点之间：允许在所有端口上建立连接。
- 在代理节点之间：允许在所有端口上建立连接。
- 从管理节点到代理节点：允许在所有端口上建立连接。
- 从代理节点到管理节点：允许在 TCP 端口 8201 和 26257 之外的所有端口上建立连接。
- 从外部设备到管理节点：阻止除 TCP 端口 80 和 443 之外的所有端口上的连接请求。
- 从外部设备到专用代理节点：阻止所有端口上的连接请求。
- 从外部设备到共用代理节点：阻止所有端口上的连接请求 [广告端口范围](/mesosphere/dcos/cn/1.12/installing/production/system-requirements/ports/#agent)。

您可能希望向外部设备开放端口 22，以允许使用安全外壳（`ssh`）的管理任务。
虽然 DC/OS 组件当前不支持专用网络选择，但您可以将
`ssh` 配置为可以使用 [`ListenAddress`](https://man.openbsd.org/sshd_config#ListenAddress)指示访问专用管理网络。

# 安全区

在最高级别上，我们可以区分 DC/OS 部署中的三个安全区
，即管理、私用和公共安全区。

## 管理区

可通过 HTTP/HTTPS 和 SSH 连接访问 **管理** 区，并
提供对管理节点的访问。它还提供
通过 URL 路由对群集中的其他节点的反向代理访问。安全起见，DC/OS 云
模板允许配置白名单，这样仅特定 IP 地址范围
可以访问管理区。

### Admin Router

Admin Router 控制对管理区的访问。

传入 DC/OS 群集的 HTTP 请求通过 Admin Router 代理（使用 [Nginx](http://nginx.org) ，其核心是 [OpenResty](https://openresty.org)）。Admin Router 拒绝访问大多数 HTTP 端点以获取未经身份认证的请求。为了请求进行身份认证，它必须在其身份认证标头中提供有效的认证令牌。可通过验证流程获得令牌。请参阅 [安全文档](/mesosphere/dcos/cn/1.12/security/)了解详情。

经过认证的用户有权在其群集中执行任意操作。也就是说，除了是否有权访问服务之外，DC/OS 目前还没有细分的访问权限控制。

#### 保护 Admin Router 的步骤

默认情况下，Admin Router 将允许未加密的 HTTP 流量。我们认为这样不安全，您必须提供有效的 TLS 证书并将所有 HTTP 流量重定向到 HTTPS，才能妥善保障安全访问群集。在您获得有效的 TLS 证书之后，在每个管理节点上安装证书。将证书和私钥复制到用户所熟知的位置，如在 `/etc/ssl/certs` 位置下。

如果您在 Admin Router 前运行 HAProxy，您应该保护它们之间的通信。有关保护您的通信的信息，请参阅[文档](/mesosphere/dcos/cn/1.12/security/oss/tls-ssl/haproxy-adminrouter/)。

## 专用区

**私用** 区是一个非可路由网络，访问仅限于
管理区或从公共区通过边缘路由器来访问它。已部署
的服务在私用区运行。该区是运行大部分代理
节点的地方。

## 公共区

可选的**公共**区是运行公共可访问的应用程序的地方。通常，此区中仅运行少量代理节点。边缘路由器将流量转发给专用区中运行的应用程序。

公共区中的代理节点被标记为特殊角色，以便只能在此处安排特定任务。这些代理节点具有公共和专用 IP 地址，也只能在其
`iptables` 防火墙中打开特定端口。

默认情况下，使用基于云的安装程序（例如 AWS Cloudformation 模板）时，大量端口都会接触到公共区的互联网。在生产系统中，这些端口不太会全都暴露出来。建议您关闭除 80 和 443 之外的所有端口（针对 HTTP/HTTPS 流量），并使用带有 HTTPS 的 [Marathon-LB](https://docs.mesosphere.com/services/marathon-lb/)来管理入口流量。

### 典型 AWS 部署

包括 AWS 负载均衡器的典型 AWS 部署如下所示：

![安全区](/mesosphere/dcos/1.12/img/security-zones.jpg)

图 1. AWS 部署中的安全区

