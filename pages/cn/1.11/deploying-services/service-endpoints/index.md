---
layout: layout.pug
navigationTitle: 服务端点
title: 服务端点
menuWeight: 3
excerpt: 使用具有容器化服务的端点

enterprise: false
---


容器化服务可以放置在集群中的任何位置。许多 DC/OS 服务提供端点，方便客户端找到它们。

# 发现端点
可以通过 DC/OS Web 界面找到服务端点（若有）。单击 **服务**，之后单击服务名称。单击 **端点** 选项卡。

## 发现已认证 DC/OS 服务的端点
以下服务还提供 CLI 命令和 API 以发现端点：Cassandra、Confluent Kafka、DSE、Elastic 和 HDFS。

- CLI：
 - 列出端点类型：`dcos <package-name> endpoints`
 - 查看一个端点类型的端点：`dcos <package-name> 端点 <endpoint>`
- API：
 - 列出端点类型：`<dcos-url>/service/<service-name>/v1/endpoints`
 - 查看一个端点类型的端点： `<dcos-url>/service/<service-name>/v1/endpoints/<endpoint>`

# 返回的端点

返回的端点将包括以下内容：

- `.autoip.dcos.thisdcos.directory` 如果实例在 DC/OS 集群内移动的情况下，会跟着每个实例的主机名，。
- 用于访问任何实例的支持 HA 的 VIP 主机名（可选）。
- 用于在 `.autoip.dcos.thisdcos.directory` 主机名不可解析时访问服务的直接 IP 地址。
- 如果服务位于虚拟网络（例如 `dcos` 覆盖网络），那么 IP 将来自分配给正运行任务所在主机的子网。不会是主机 IP。若要解析主机 IP，请使用 Mesos DNS (`<task>.<service>.mesos`）。

一般情况下，`.autoip.dcos.thisdcos.directory` 端点仅在同一 DC/OS 集群内工作。从集群外部，可以使用直接 IP 或设置作为服务实例前端的代理服务。出于开发和测试目的，可以使用 [DC/OS 隧道](/cn/1.11/developing-services/tunnel/) 从集群外部访问服务，但此选项不适合生产使用。

## 将客户端连接到端点

请参阅 [连接客户端文档](/services/)（若有），查看正在运行的 DC/OS 服务。
