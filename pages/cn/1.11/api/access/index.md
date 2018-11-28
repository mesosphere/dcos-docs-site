---
layout: layout.pug
navigationTitle: 集群访问
title: 集群访问
menuWeight: 1
excerpt: 获取集群 URL 的访问权限

enterprise: false
---


您可以通过使用以下方法获取集群 URL：

- 登录 DC/OS Web 界面，从浏览器地址栏复制编址和域名。
- 登录 DC/OS CLI 并键入 `dcos config show core.dcos_url` 以获取集群 URL。


# API 端口

在管理节点上，Admin Router 可通过标准端口访问：`80`(HTTP) 和 `443` （如果启用 HTTPS，则为 HTTPS）。

在代理节点上，Admin Router Agent 可通过端口 `61001` (HTTP) 访问。


# 代理节点访问

您可以通过以下方法找到特定代理节点的主机名：

- 登录 DC/OS GUI，导航到“节点”页面并复制所需节点的主机名。
- 登录 DC/OS CLI，列出带有 `dcos node` 的节点，并复制所需节点的主机名。

要确定哪些代理是公共代理，参见[查找公共代理 IP](/cn/1.11/administering-clusters/locate-public-agent/)。


# 连接进入

在大多数生产部署中，集群的管理性访问应通过外部代理路由到 DC/OS 管理节点，在管理节点之间分配流量负载。例如，默认 AWS 模板配置 AWS 弹性负载均衡器。

管理节点和私有代理节点通常不可公开访问。出于安全原因，进入这些节点应由路由器或防火墙控制。要管理集群，管理员和操作员应在与 DC/OS 节点相同的网络中使用防火墙内的 VPN 服务器。使用 VPN 可确保您可以直接从工作站安全访问节点。

公共代理节点通常可以公开访问。在公共代理节点上运行的[Marathon-LB](/cn/1.11/networking/marathon-lb/)可用作在私有代理节点上运行的应用程序的反向代理和负载均衡器。要提高安全性，可使用外部负载均衡对公共节点上的应用程序进行负载均衡器的中间调解，调解公共节点上应用程序的负载，或直接对私有节点上的应用程序进行负载均衡。如果想要允许公开访问公共节点，您应配置防火墙，以阻止对所有端口的访问，使其仅可访问应用程序所需的端口。

在开发或本地部署中，您通常可以通过 IP 直接访问节点。

有关详细信息，请参阅[保护您的集群](/cn/1.11/administering-clusters/)。
