---
layout: layout.pug
excerpt: 了解 DC/OS 如何实现 Azure 容器服务
title: Azure 容器服务
navigationTitle: ACS
render: mustache
model：/mesosphere/dcos/2.0/data.yml
menuWeight: 2
---

[Azure 容器服务](https://azure.microsoft.com/documentation/articles/container-service-deployment/) 是对已优化 DC/OS 的参考实现，以充分利用 Microsoft Azure 基础架构的特性。如果您已拥有 Azure 帐户，则可以通过 [创建 Azure 容器服务群集]，尝试参考实现在 Microsoft Azure 上构建的 DC/OS(https://aka.ms/acscreate)。（若没有账户，请首先获取 [免费 Azure 试用账户](https://azure.microsoft.com/pricing/free-trial/)。）

<p class="message--warning"><strong>警告：</strong>Mesosphere 不支持 Ubuntu 作为 DC/OS 的操作系统，即便是使用 Microsoft Azure 时。</p>

本文档介绍了：

- 使用 DC/OS 的好处
- Azure 基础架构和实现架构
- 用于构建 DC/OS 和 ACS 群集的物料清单

## DC/OS 的优势

DC/OS 由 Apache Mesos 提供支持，用作一组计算机的分布式内核，您可以将其视为一个单元，但您仍保持对每个单元的控制。在 DC/OS 中，系统的内核是任意数量公开可用和专用的 Mesos 管理节点和代理节点；故障的 Mesos 管理节点由备用管理节点透明地替代，并处理领导者选举。管理节点处理有故障的代理节点和进程。

DC/OS 应用程序用作其分布式用户空间中的系统组件。系统 Marathon 组件对于 DC/OS 是分布式 `init`，但这还包括 Admin Router 服务、Mesos-DNS 服务、Exhibitor，以及用户进程使用的以及管理主节点和代理节点的其他系统范围组件。

有关 DC/OS 更全面的架构描述，请参阅 [DC/OS 架构](/mesosphere/dcos/2.0/overview/architecture/)。

关于更完整的组件讨论，请参阅 [DC/OS 组件](/mesosphere/dcos/2.0/overview/architecture/components/)。

### 为什么选择 DC/OS 而不是 Mesos？

许多公司 [使用 Mesos 直接取得成功](https://mesos.apache.org/documentation/latest/powered-by-mesos/)。然而，DC/OS 具有几个重要特点，区别于 Mesos 的开源特点，并为您的部署添加功能。

1. 部署和管理 Mesos 可能很复杂，原因正是它可以管理非常复杂的环境；DC/OS 使这种复杂性变得简单易用并为社区所支持。
1. DC/OS 实现了不仅仅工业级别还有互联网级别的容错性。
1. DC/OS {{ model.packageRepo }} 包使得安装简便，通过提供所有相应的开源软件包，支持开发人员、数据科学家和系统管理员。
1. 实时度量标准“firehouse”开放供您喜爱的诊断和分析包使用。
1. DC/OS 有三种管理分布式操作系统的方式：CLI、图形 UI 和 API。

### 包 {{ model.packageRepo }}

以下是 DC/OS 第 1 天{{ model.packageRepo }} 中内容的列表，按许可证类型分类。

#### Apache 许可证 V2

- ArangoDB
- Apache Cassandra
- Crate
- Elastic Search
- Etcd
- Exhibitor
- Apache Hadoop
- Hue
- Jenkins
- Apache Kafka
- Linkerd
- Mr Redis
- Namerd
- Quobyte
- Riak
- Spark Notebook
- Apache Spark
- Apache Storm
- Docker Swarm
- Apache Zeppelin

#### 简化的 BSD

- Datadog
- Nginx

#### MIT

- OpenVPN Admin
- OpenVPN
- Ruxit

您不仅可以使用 DC/OS 包系统带有的 {{ model.packageRepo }} 包，还可以在那里发布您的技能来回馈社区。您也可能希望自己部署 DC/OS；您可以从使用 Azure 容器服务，在“云”中参考实现 DC/OS 开始。

## Azure 容器服务基础架构和优化

Azure 容器服务采用 DC/OS 构建，作为关键编排选项之一。DC/OS 实现经过优化，可在 Microsoft Azure 和本地轻松创建和使用，最终使用 Azure Stack。它是开始使用 DC/OS、Mesos 和分布式群集（可以像一个大型系统一样管理）的最佳方式之一，无论是在您的数据中心，还是在 Azure 中。

Azure 容器服务实现为您带来了其他好处：

1. 这是开始使用 DC/OS 的最简便方法。您只需点击几个按钮并提供几个参数，然后就可以部署应用程序了。如果您有 Azure 帐户，[请尝试](https://aka.ms/acscreate)。
1. DC/OS 部署专门针对 Azure 经过审核和优化：所有虚拟机、存储、网络、负载均衡器等都可以为高可用性 DC/OS 群集创建并配置。
1. 您可以增加与 Azure 服务的集成性，条件是您认定随着系统前进它会使您的部署受益。
1. ACS 为基础架构提供 Microsoft 支持，以补充 Mesosphere 对 DC/OS 的支持。

默认的 ACS 架构与此相似：

![使用 DC/OS 的 Azure 容器服务架构。](/mesosphere/dcos/2.0/img/dcos-acs.png)

图 1 - 使用 DC/OS 的 Azure 容器服务架构

## DC/OS 组件列表

以下列表显示了 DC/OS 本身使用的组件。您会注意到围绕 Mesos、Marathon、Python 等的核心组件。


- adminrouter
- boost-system
- boto
- bouncer
- cosmos
- curl
- dcos-cluster-id
- dcos-diagnostics
- dcos-history-service（已弃用）
- dcos-image
- dcos-image-deps
- dcos-installer
- dcos-installer-ui
- dcos-metrics
- dcos-oauth
- dcos-signal
- dcos-ui
- dnspython
- erlang
- exhibitor
- flask
- hadoop
- hdfs-mesos
- java
- libevent
- logrotate
- marathon
- mesos
- mesos-buildenv
- mesos-dns
- mesos-metrics-module
- mesos-modules-private
- minuteman
- ncurses
- networking_api
- openssl
- python
- python-dateutil
- python-docopt
- python-jinja2
- python-kazoo
- python-markupsafe
- python-passlib
- python-pyyaml
- python-requests
- python-retry
- six
- spartan
- strace
- toybox
- treeinfo.json
- zk-value-consensus
