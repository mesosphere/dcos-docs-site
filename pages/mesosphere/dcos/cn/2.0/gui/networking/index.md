---
layout: layout.pug
navigationTitle:  网络
title: 网络
menuWeight: 6
excerpt: 使用网络菜单
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

“网络”屏幕全面展示虚拟 IP 地址 (VIP) 运行状况。


![扩展的 Tweeter](/mesosphere/dcos/2.0/img/GUI-Networking-Main.png)

图 1 - 网络连接选项卡

网络接口有两个子页面：**网络** 和 **服务地址**。

# “网络”选项卡

**网络** 选项卡列出了当前部署在群集上的网络。这是默认的主视图。

如果单击某个网络的名称，您可以看到“网络详情”页面，有两个选项卡：**任务** 和 **详情**。

![网络详情](/mesosphere/dcos/2.0/img/GUI-Networking-Networks-Detail.png)

图 2 - 网络详情

## 任务

**任务** 选项卡列出了以下信息：

| 名称 | 说明 |
|---------|--------------|
| 任务 | 任务名称。  |
| 容器 IP |    容器的 IP 地址。     |
| 端口映射 | 主机端口向容器端口映射（若存在）。      |

## 详细信息

**详情** 选项卡列出了以下信息：

| 名称 | 说明 |
|---------|--------------|
| 名称 | 虚拟网络的名称。  |
| IP 子网 |    网络的 IP 子网。    |

# 服务地址选项卡

“服务地址”选项卡显示每个网络服务地址统计信息的摘要：

![服务地址选项卡](/mesosphere/dcos/2.0/img/GUI-Networking-Service-Addresses-Main.png)

图 3 -“服务地址”选项卡

| 名称 | 说明 |
|---------|--------------|
| 名称 | Mesos DNS 名称。  |
| 成功 | 成功请求的数量。      |
| 失败 | 失败请求的数量。 |
| 失败 % | 失败率。 |
| P99 延迟 | P99 延迟意味着 99% 的请求应该比给定延迟更快。换言之，只有 1% 的请求可以更慢。 |

## 服务地址详情选项卡

如果单击正在运行的服务的名称，将能访问 **后端** 页面，它将显示有关指定网络性能的更多详细信息。

![服务地址后端](/mesosphere/dcos/2.0/img/GUI-Networking-Service-Addresses-Backends.png)

图 4 - 后端页面

显示与 **服务地址** 页面中相同的信息，但有图形表示和更多详细信息。

如果单击本地 IP 地址的名称，将能访问有关任何客户端的信息。

![服务地址详情 2](/mesosphere/dcos/2.0/img/GUI-Networking-Service-Addresses-Detail.png)

图 5 - 显示客户端的服务地址详情页面


# 创建 VIP

DC/OS 可将流量从单个虚拟 IP (VIP) 映射到多个 IP 地址和端口。

有关创建虚拟 IP 的详细信息，请参阅 [网络文档](/mesosphere/dcos/2.0/networking/load-balancing-vips/virtual-ip-addresses/#creating-a-vip)。
.