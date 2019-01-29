---
layout: layout.pug
navigationTitle: 1.11.4 版本注释
title: 1.11.4 版本注释
menuWeight: 1
excerpt: DC/OS 1.11.4 版本注释
---

DC/OS 1.11.4 于 2018 年 7 月 26 日发布。

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.4 包括以下内容：

- Apache Mesos 1.5.2-2440c73 [更改日志](https://github.com/apache/mesos/blob/2440c73/CHANGELOG)。
- Marathon 1.6.535 [更改日志](https://github.com/mesosphere/marathon/releases/tag/v1.6.535)。
- Metronome 0.4.2 [更改日志](https://github.com/dcos/metronome/releases/tag/v0.4.2)。


# DC/OS 1.11.4 中已修复的问题

- COPS-1840/DCOS_OSS-3793 - 更改 Admin Router (nginx) 日志以使用守护程序设备访问日志。
- COPS-3073/DCOS-21993 - 改进 DC/OS Mesos 对日志记录和执行的授权。
- COPS-3132/DCOS-21723 - DC/OS UI：增加 Cassandra 服务的磁盘空间。
- COPS-3402/DCOS_OSS-3750 - 将数据目录移至 tmpfs 位置，并在代理重启时回收分配的 IP 地址。
- COPS-3445/DCOS-39092/DCOS_OSS-2418 - 防止 Mesos 代理节点对持久卷进行垃圾收集。
- DCOS-20053 - 解决 Admin Router 超时问题。
- DCOS-22458 - 调整运行状况检查超时。[enterprise type="inline" size="small" /]
- DCOS-27982/DCOS-38599 - 解决混合工作负载扩展问题。
- DCOS-34596 - DC/OS IAM：修复在升级后包含多个证书的 SAML 身份提供商元数据文档停止工作时出现的衰退。[enterprise type="inline" size="small" /]
- DCOS-37451 - 筛选用于防止登记出现在度量数据中的任务标签。
- DCOS-37452 - 增加 dcos 度量标准的 Mesos 代理节点响应超时。
- DCOS-37588 - 修复因临时连接损失而出现的 Vault/ZK 解锁问题。
- DCOS-38083 - 改善 dcos 度量标准上 statsd 计时器的特性。
- DCOS-38248 - 修复规模测试集群上 Admin Router 的特性问题。Admin Router 因 worker_connections 耗尽而未能更新状态缓存。
- DCOS-38258/DCOS_OSS-3307 - 增加 Admin Router 服务器中软件包下载的超时时间。
- DCOS-38323 - 将 Lua HTTP 客户端的超时时间从 10 秒增加到 60 秒，以容纳上游 DC/OS 组件（例如，Mesos 和 Marathon）的更长响应时间。
- DCOS-38603 - 提高 Mesos 分配器性能。
- DCOS_OSS-2360 - DC/OS 度量标准：清理度量标准名称以更好地兼容 Prometheus。
- DCOS_OSS-3304 - 将任务标签添加为容器度量上的标记。
- DCOS_OSS-3602 - 解决不稳定问题：L4LB 在新的 VIPS 部署期间不稳定。
- DCOS_OSS-3613 - 改进诊断捆绑包以包含解决网络问题用的调试信息。
- DCOS_OSS-3804 - 解决将 dcos-check-poststart 结果记录到日志的问题。


# DC/OS 1.11.4 中的重大更改

- DCOS-37833 - 把对 Admin Router 连接 (worker_connections) 数量的限制增至 10K。
- DCOS_OSS-3597- 将 REX-Ray 版本更新到 [0.11.2](https://github.com/rexray/rexray/releases/tag/v0.11.2)。
- 更新 [1.11+v1.15.0+3231764b](https://github.com/mesosphere/dcos-ui-plugins-private/compare/1.11+v1.14.0+7e0cb54f...1.11+v1.15.0+3231764b) 的 DC/OS UI。[enterprise type="inline" size="small" /]
- 更新 [1.11+v1.15.0](https://github.com/dcos/dcos-ui/blob/1.11+v1.15.0/CHANGELOG.md) 的 DC/OS UI。[oss type="inline" size="small" /]

<p class="message--note"><strong>注意: </strong> Kubernetes 包依赖关系记录 [在此处](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install)。</p>


# 关于 DC/OS 1.11

DC/OS 1.11 包含许多新功能，重点是：
- 跨多个云管理集群 [enterprise type="inline" size="small" /]
- 生产 Kubernetes 即服务
- 增强了数据安全性 [enterprise type="inline" size="small" /]
- 更新了数据服务

提供有关新功能和服务的反馈：[support.mesosphere.com](https://support.mesosphere.com)。


## 新特性和功能

### 平台
- 多区域管理 - 使 DC/OS 集群能跨越多个数据中心、云和远程分支，同时提供统一的管理和控制集群。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 已链接的集群 - 集群链路是一个集群和另一个集群之间的单向关系。使用 DC/OS CLI 将一个集群的链接添加到另一个集群或将其删除。设置链接后，您可以使用 CLI 或 UI 在集群之间轻松切换。[查看文档](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。[enterprise type="inline" size="small" /]
 - 故障域感知 - 利用故障域感知使您的服务高度可用，并能在需要时增加容量。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 停用节点 - 支持永久停用节点使得更容易管理“spot”云实例，实现任务的立即重新调度。[查看文档](/cn/1.11/hybrid-cloud/features/decommission-nodes/)
- UCR
 - 支持 Docker 镜像垃圾收集。[查看文档](/cn/1.11/deploying-services/containerizers/)。
 - 支持 Docker 镜像拉取秘钥。[查看文档](/cn/1.11/deploying-services/containerizers/)。Docker 凭据的示例见 [此处](/cn/1.11/installing/production/deploying-dcos/configuration/examples/#docker-credentials)。[enterprise type="inline" size="small" /]

# 网络
- Edge-LB 1.0。[查看文档](https://docs.mesosphere.com/services/edge-lb/1.0/)。[enterprise type="inline" size="small" /]
- Docker 容器现在支持 IPv6。
- DC/OS 网络堆栈的性能改进 - 所有网络组件 (minuteman、navstar、spartan) 被整合到一个被称为 `dcos-net` 的单个 systemd 单元中。请查看此 [注意](/cn/1.11/networking/#a-note-on-software-re-architecture)，以进一步了解网络堆栈的重新分解。
- 配置参数 `dns_forward_zones` 现在采用对象列表，而不是嵌套列表（[DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)）。[查看文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) 以了解其使用情况。

[enterprise]
### 安全
[/enterprise]
- 密钥管理服务
 - 除环境变量以外，密钥现在还可以是二进制文件。
 - 现在支持分层访问控制。

### 监控
- DC/OS 度量标准组件现在以 [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 格式产生度量。[查看文档](/cn/1.11/metrics/)。
- 统一日志记录 API 提供对容器（任务）和系统组件日志的简单访问。[查看文档](/cn/1.11/monitoring/logging/logging-api/logging-v2/)。

### 存储
- DC/OS 存储服务 0.1 (beta) - DSS 用户能够根据配置文件或策略，动态地创建卷，以调整其应用程序的存储要求。该特性利用行业标准容器存储接口 (CSI) 让 Mesosphere、社区和合作伙伴能够提高开发 DC/OS 中存储特性的效率。[查看文档](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /] [enterprise type="inline" size="small" /]
- Pod 现在支持永久卷。[查看文档](/cn/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

**注意：** 因为这些存储特性在 1.11 中为 beta，因此在安装 DC/OS 时，它们必须在config.yaml 文件中明确启用。不建议将 beta 特性用于生产用途，但却是指出项目前进方向的良好指示。

### 更新了 DC/OS 数据服务
- 现在支持对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的TLS 加密。[enterprise type="inline" size="small" /]
- 对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。[enterprise type="inline" size="small" /]
- 新的 API 端点用于暂停 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的节点。使用此端点以空闲命令状态重新启动节点用于调试。
- 新的 DC/OS Kafka ZooKeeper 服务。[查看文档](/cn/services/kafka-zookeeper/)。
- 现在，您可以从 DC/OS UI 的下拉菜单中选择 DC/OS 数据服务版本。
- 提高了所有 DC/OS 数据服务的可扩展性。


