---
layout: layout.pug
navigationTitle: 1.11.3 版本注释
title: 1.11.3 版本注释
menuWeight: 5
excerpt: DC/OS 1.11.3 版本注释
---

DC/OS 1.11.3 于 2018 年 6 月 26 日发布。

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.3 包括以下内容：

- Apache Mesos 1.5.2-197c910 [更改日志](https://github.com/apache/mesos/blob/197c910/CHANGELOG)。
- Marathon 1.6.496 [更改日志](https://github.com/dcos/dcos/blob/1.11.3/packages/marathon/buildinfo.json)。
- Metronome 0.4.2 [更改日志](https://github.com/dcos/metronome/releases/tag/v0.4.2)。


# DC/OS 1.11.3 中已修复的问题

- COPS-3158 - 只有在使用 XFS 时，才会在自定义安装工具中添加针对 Mesos 和 Docker 工作目录上 ftype=1 的校验。
- DCOS-11714 - DC/OS IAM：添加了通过 LDAP 对匿名绑定的支持。[enterprise type="inline" size="small" /]
- DCOS-22458 - 提高了 dcos-checks-poststart-service-unhealthy 检查的稳定性。[enterprise type="inline" size="small" /]
- DCOS-25602 - DC/OS IAM：减少了 1.11.1 版本中意外引入的过度日志记录。[enterprise type="inline" size="small" /]
- DCOS-34435 - DC/OS Cosmos：增加了 /v2/apps Marathon 端点处最大负载大小的限制。
- DCOS-34536 - 解决了 ipv6 地址配置的 DC/OS 升级问题。
- DCOS-38015 - 通过安全密码套件增强了 Mesos TLS 密码套件支持。[enterprise type="inline" size="small" /]

# DC/OS 1.11.3 中的重大更改

- DCOS-19427 - CockroachDB：将集群版本设为 1.1。[enterprise type="inline" size="small" /]
- DCOS_OSS-2417 和 DCOS_OSS-3548 - 支持 CoreOS 1688.5.3。
- 为 1.11+1.13.0+7e0cb54f 更新了 DC/OS UI Enterprise [开源更改日志](https://github.com/dcos/dcos-ui/blob/1.11%2Bv1.13.0/CHANGELOG.md) 和 [EE 插件](https://github.com/mesosphere/dcos-ui-plugins-private/compare/v1.11.1...1.11+1.13.0+7e0cb54f)。[enterprise type="inline" size="small" /]
- 更新了 [1.11+v1.14.0](https://github.com/dcos/dcos-ui/blob/1.11+v1.14.0/CHANGELOG.md) 的 DC/OS UI。


**注意：** 
- CoreOS 1688.5.3 支持新的 Docker 版本。请参阅 [兼容性矩阵](https://docs.mesosphere.com/version-policy/) 了解更多信息。
Kubernetes 包依赖关系记录 [在此处](https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install)。


# 关于 DC/OS 1.11

DC/OS 1.11 包含许多新功能，重点是：
- 管理跨多个云的集群 [enterprise type="inline" size="small" /]
- 生产 Kubernetes 即服务
- 增强了数据安全性 [enterprise type="inline" size="small" /]
- 更新了数据服务

提供有关新特性和服务的反馈：[support.mesosphere.com](https://support.mesosphere.com)。


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
- DC/OS 度量标准组件现在以 [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 格式产生度量标准。[查看文档](/cn/1.11/metrics/)。
- 统一日志记录 API 提供对容器（任务）和系统组件日志的简单访问。[查看文档](/cn/1.11/monitoring/logging/logging-api/logging-v2/)。

### 存储
- DC/OS 存储服务 0.1 (beta) - DSS 用户能够根据配置文件或策略动态地创建卷，以微调其应用程序的存储要求。该特性利用行业标准容器存储接口 (CSI) 让 Mesosphere、社区和合作伙伴能够提高开发 DC/OS 中存储功能的效率。[查看文档](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /] [enterprise type="inline" size="small" /]
- Pod 现在支持永久卷。[查看文档](/cn/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

**注意：** 因为这些存储功能在 1.11 中为 beta，因此在安装 DC/OS 时，它们必须在config.yaml 文件中明确启用。不建议将 beta 功能用于生产用途，但却是指出项目前进方向的良好指示。

### 更新了 DC/OS 数据服务
- 现在支持对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的TLS 加密。[enterprise type="inline" size="small" /]
- 对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。[enterprise type="inline" size="small" /]
- 新的 API 端点用于暂停 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的节点。使用此端点以空闲命令状态重新启动节点用于调试。
- 新的 DC/OS Kafka ZooKeeper 服务。[查看文档](/cn/services/kafka-zookeeper/)。
- 现在，您可以从 DC/OS UI 的下拉菜单中选择 DC/OS 数据服务版本。
- 提高了所有 DC/OS 数据服务的可扩展性。


