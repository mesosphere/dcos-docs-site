---
layout: layout.pug
navigationTitle: 使用自定义 Marathon 
title: 使用自定义 Marathon 
menuWeight: 39
excerpt: 部署非本地 Marathon 实例
enterprise: true
---

本专题描述了如何为 DC/OS 集群部署独立 Mesos 角色、保留和配额功能的非本地 Marathon 实例。

## 术语

- **本地 Marathon ** 作为 DC/OS 安装的一部分而安装的 Marathon 实例。此实例在管理节点上运行。
- **非本地 Marathon ** 可以作为 DC/OS 服务安装的 Marathon 实例。非本地 Marathon 实例在专用代理节点上运行。可能需要额外的专用代理节点，以满足增加的资源需求。

# 隔离资源
DC/OS Enterprise [安全功能](/cn/1.11/security/ent/) 提供强大的细粒度访问控制。但是，有时您可能需要分区环境，例如：

- 测试 DC/OS 升级或 API 变更。
- 安全地隔离开发人员组，使一个组中的开发人员无法对其他组中运行的工作负载产生负面影响。每个 DC/OS 服务都默认使用本地 Marathon 针对配额和保留注册的相同 [Mesos 角色](http://mesos.apache.org/documentation/latest/roles/)。这意味着 Marathon 用户可以在 Marathon 能够用以运行任务的任何 Linux 用户名义下运行任务。

可以通过使用非本地 Marathon 隔离工作负载，并利用 DC/OS 上的这些 Mesos 功能：

- [保留](http://mesos.apache.org/documentation/latest/reservation/)：用于在特定代理节点中保留资源。
- [角色](http://mesos.apache.org/documentation/latest/roles/)：用于指定某些资源为使用一个或多个 DC/OS 服务时而保留。
- [配额](https://mesos.apache.org/documentation/latest/quota/)：用于指定保证接收角色的最低资源量。

## 动态和静态保留
可以为特定代理节点保留集群资源。可以直接在代理节点保留资源（静态），也可以在应用定义中指定保留资源（动态）。

- **静态：** 设置为角色保留资源的代理。要修改静态保留，您必须通过新配置清空并重新启动代理。
- **动态：** 通过在非本地 Marathon 应用定义中指定的方式保留和取消资源。

如需更多信息，请参阅 [Mesos 保留](http://mesos.apache.org/documentation/latest/reservation/)。
