---
layout: layout.pug
navigationTitle: 1.11.0 版本注释
title: 1.11.0 版本注释
menuWeight: 20
excerpt: DC/OS 1.11.0 版本注释
---

DC/OS 1.11.0 于 2018 年 3 月 8 日发布。

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]


DC/OS 1.11 包含许多新功能，重点是：
- 跨多个云管理集群
- 生产 Kubernetes 即服务
- 提高了数据安全性
- 更新了数据服务

提供有关新特性和服务的反馈：[support.mesosphere.com](https://support.mesosphere.com)。

# 目录
- [新特性和功能](#new-features)
- [已知问题和限制](#known-issues)
- [解决的问题](#fixed-issues)

<a name="new-features"></a>
## 新特性和功能

### 集成了 Apache Mesos 1.5, Marathon 1.6 和 Kubernetes 1.9。
- DC/OS 1.11.0 基于 Mesos 1.5。查看 [Mesos 更改日志](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG)。
- DC/OS 1.11.0 与最新的 1.6 版 Marathon 集成。有关 Marathon 1.6 的更多信息，请参阅 [Marathon 更改日志](https://github.com/mesosphere/marathon/blob/master/changelog.md)。
- DC/OS 1.11.0 支持最新的 Kubernetes 1.9 容器调度程序。有关 DC/OS 上 Kubernetes 1.0 的更多信息，[查看文档](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3)。

### 平台
- 多区域管理 - 使 DC/OS 集群能跨越多个数据中心、云和远程分支，同时提供统一的管理和控制集群。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 链接的集群 - 集群链路是一个集群和另一个集群之间的单向关系。使用 DC/OS CLI 将一个集群的链接添加到另一个集群或将其删除。设置链接后，您可以使用 CLI 或 UI 在集群之间轻松切换。[查看文档](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。[enterprise type="inline" size="small" /]
 - 故障域感知 - 利用故障域感知使您的服务高度可用，并能在需要时增加容量。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 停用节点 - 支持永久停用节点使得更容易管理“spot”云实例，实现任务的立即重新调度。
- UCR
 - 支持 Docker 镜像垃圾收集。[查看文档](/cn/1.11/deploying-services/containerizers/)。
 - 支持 Docker 镜像拉取秘密。

# 网络
- Edge-LB 1.0。[查看文档](https://docs.mesosphere.com/services/edge-lb/1.0/) [enterprise type="inline" size="small" /]
- 现在支持 IPv6 用于 Docker 容器。
- DC/OS 网络堆栈的性能改进 - 所有网络组件 (minuteman、navstar、spartan) 被整合到一个被称为 `dcos-net` 的单个 systemd 单元中。请查看此 [注意](/cn/1.11/networking/#a-note-on-software-re-architecture)，以进一步了解网络堆栈的重新分解。
- 配置参数 `dns_forward_zones` 现在采用对象列表，而不是嵌套列表（[DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)）。[查看文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) 以了解其使用情况。

[enterprise]
### 安全
[/enterprise]
- 密钥管理服务
 - 现在支持二进制密钥文件
 - 现在支持分层访问控制。

### 监控
- DC/OS 度量标准组件现在以 [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 格式产生度量标准。[查看文档](/cn/1.11/metrics/)。
- 统一日志记录 API 提供对容器（任务）和系统组件日志的简单访问。[查看文档](/cn/1.11/monitoring/logging/logging-api/logging-v2/)。

### 存储
- DC/OS 存储服务 0.1 (beta) - DSS 用户能够根据配置文件或策略动态地创建卷，以调整其应用程序的存储要求。该特性利用行业标准容器存储接口 (CSI) 让 Mesosphere、社区和合作伙伴能够提高开发 DC/OS 中存储特性的效率。[查看文档](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /][enterprise type="inline" size="small" /]
- Pod 现在支持永久卷。[查看文档](/cn/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

<p class="message--note"><strong>注意: </strong> 因为这些存储特性在 1.11 中为 beta，因此必须明确启用。不建议将 beta 特性用于生产用途，但却是很好地指出项目的前进方向。</p>

### 更新了 DC/OS 数据服务
- 现在支持对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的TLS 加密。
- 对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。
- 新的 API 端点用于暂停 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的节点。使用此端点以空闲命令状态重新启动节点用于调试。
- 新的 DC/OS Kafka ZooKeeper 服务。[查看文档](/cn/services/kafka-zookeeper/)。
- 现在，您可以从 DC/OS UI 的下拉菜单中选择 DC/OS 数据服务版本。
- 提高了所有 DC/OS 数据服务的可扩展性。

## <a name="known-issues"></a>已知问题和限制
- DCOS-9751 - Marathon 未能在禁用 -> 宽容升级期间与 Mesos 管理节点进行认证。
- DCOS-18368 - GUI 安装工具已在 1.11 中停用，将不再继续运行。它将在 1.12 中停用。有关替代安装方法的详细信息，[查看文档](https://docs.mesosphere.com/1.11/installing)。
- DCOS-19047 - 在从 1.10.x 升级到 1.11 时，`dcos-secrets` 服务不可用。
- DCOS_OSS-2132 - `dcos-log` 不能正确处理 journald 文件轮换。
- INFINITY-3116 - 删除失败的 mnist Tensorflow 软件包从未完成。

## <a name="fixed-issues"></a>自 1.11.0 候选版本 4 以来的改进和修复的重大问题
- COPS-2201 - `dcos-diagnostics` 运行 gen_resolvconf.py 后不再出故障。
- DCOS-13066 - 将 3DT 服务重命名为 DC/OS 诊断。
- DCOS-19008 - `exhibitor_address` 配置选项现在可以是 IPv4 地址，而不会导致证书验证错误。
- DCOS-19896 - 添加 `--linked` 标记到 `dcos cluster list`。
- DCOS-20351 - 添加 `dcos-license` 子命令到 `dcos-enterprise-cli`。[enterprise type="inline" size="small" /]
- DCOS-21130 - 使服务列表在节点的网格视图中可见。
- DCOS_OSS-671 - 改进诊断捆绑包中的文件名。
- DCOS_OSS-1275 - 增加对本地安装期间自定义检查可执行文件的支持。
- DCOS_OSS-1321 - 在使用 `dcos-diagnostics check` 执行检查命令时搜索路径可配置。
- DCOS_OSS-1340 - Spartan "autoip" DNS 解析到桥接网络中 UCR 的主机 IP。
- DCOS_OSS-1449 - 从 CLI 移除对 `--appId` 的支持。
- DCOS_OSS-1489 - 在 `dcos-metrics` 中增加对 cgroup blkio 统计信息的支持。
- DCOS_OSS-2003 - 修改 DC/OS 覆盖网络以配合 ssystemd networkd 使用。

<p class="message--note"><strong>注意: </strong> Kubernetes 包依赖关系记录 <a href="https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install">在此处</a>。</p>
