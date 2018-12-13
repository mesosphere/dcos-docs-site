---
layout: layout.pug
navigationTitle: 架构
title: 架构
menuWeight: 2
excerpt: 了解 DC/OS 架构
enterprise: false
---

DC/OS 是一个运行应用程序、作业和服务等分布式容器化了的软件的平台。作为平台，DC/OS 与基础架构层不同，与基础架构层无关。这意味着只要基础架构提供计算资源、存储和网络，它就可以包含虚拟或物理硬件。

![DC/OS 架构层](/cn/1.11/img/dcos-architecture-layers.png)

图 1. DC/OS 架构层

## 软件层

在软件层，DC/OS 提供软件包管理和软件包存储库，安装并管理多种类型的服务：数据库、消息队列、流处理器、工件存储库、监控解决方案、持续集成工具、来源控制管理、日志聚合器等等。除了这些封装的应用程序和服务以外，您还可以安装自己的自定义应用程序、服务和计划作业。

如需更多信息，请参阅 [任务类型](/cn/1.11/overview/architecture/task-types/)。

## 平台层

平台层有几十个分为以下类别的组件：

- 集群管理
- 容器编排
- 容器运行时
- 日志记录和度量标准
- 网络
- 软件包管理
- IAM 和安全 [enterprise type="inline" size="small" /]
- 存储

这些组件分为多个节点类型：

- 管理节点
- 专用代理节点
- 公共代理节点

要安装 DC/OS，您必须首先为每个节点配备一个受支持的主机操作系统。如需更多信息，请参阅
- [组件](/cn/1.11/overview/architecture/components/)
- [节点类型](/cn/1.11/overview/architecture/node-types/)
- [主机操作系统](/cn/1.11/overview/concepts/#host-operating-system)。

## 基础架构层

在基础架构层，您可以在公共云、私有云或本地硬件上安装 DC/OS。其中一些安装目标具有自动配置工具，但几乎所有基础架构都可以使用，只要它包含共享 IPv4 网络上的多个 x86 机器。

如需更多信息，请参阅 [安装](/cn/1.11/installing/)。

## 外部组件

除了在数据中心运行的软件，DC/OS 还包括多个外部组件并与其集成：

- [GUI](/cn/1.11/gui/)
- [CLI](/cn/1.11/cli/)
- [软件包存储库](/cn/1.11/administering-clusters/repo/)
- [容器注册表](/cn/1.11/overview/concepts/#container-registry)
