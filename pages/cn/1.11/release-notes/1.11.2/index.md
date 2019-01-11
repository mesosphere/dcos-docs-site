---
layout: layout.pug
navigationTitle: 1.11.2 版本注释
title: 1.11.2 版本注释
menuWeight: 10
excerpt: DC/OS 1.11.2 版本注释
---

DC/OS 1.11.2 于 2018 年 5 月 18 日发布。

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

DC/OS 1.11.2 包括以下内容：

- Apache Mesos 1.5.1-aedbcfd [更改日志](https://github.com/apache/mesos/blob/aedbcfd/CHANGELOG)。
- Marathon 1.6.392 [更改日志](https://github.com/dcos/dcos/pull/2678)。
- Metronome 0.4.2 [更改日志](https://github.com/dcos/metronome/releases/tag/v0.4.2)。


# DC/OS 1.11.2 中已修复的问题

- COPS-3195 - Mesos：修复了无法执行认证令牌刷新的问题。[enterprise type="inline" size="small" /]
- DCOS-14199 - 通过不可再分地读取和写入 ZooKeeper PID 文件来整合 Exhibitor bootstrap 快捷方式。
- DCOS-20514 - 向诊断捆绑包添加了许可信息。[enterprise type="inline" size="small" /]
- DCOS-20568 - 修复了有关服务账户权限不足的诊断捆绑包创建错误。[enterprise type="inline" size="small" /]
- DCOS-21596 - 如果本地用户账户匹配 LDAP 组中存在的 LDAP 用户名，本地用户账户现在会自动添加到 LDAP 组。[enterprise type="inline" size="small" /]
- DCOS-21611 - IP 检测脚本和故障域检测脚本可通过配置升级来更改。
- DCOS-22128 - 修复了当集群 Pod 但并非每个容器都挂载一个卷时，DC/OS UI “服务”视图中的问题 [enterprise type="inline" size="small" /]
- DCOS-22041 - Admin Router：修复了权限数据缓存中的竞争条件。[enterprise type="inline" size="small" /]
- DCOS-22133 - DC/OS IAM：修复了数据库 bootstrap 事务不会插入某些数据的罕见情况。[enterprise type="inline" size="small" /]
- DCOS_OSS-2317 - 整合了 pkgpanda 的包下载方法。
- DCOS_OSS-2335 - 增加了 Mesos 执行器重新注册超时以整合代理故障切换情形。
- DCOS_OSS-2360 - DC/OS 度量标准：改进了度量标准名称以更好地兼容 Prometheus。
- DCOS_OSS-2378 - DC/OS 网络：提高了通过 TLS 的分发协议的稳定性。
- DC/OS UI：吸纳了 [多个](https://github.com/dcos/dcos/pull/2799) 修复和改进。


# DC/OS 1.11.2 中的重大更改

- MARATHON-8090 - 恢复了在 1.11.1 版本中引入的 GPU 资源的 Marathon 配置变更。
- QUALITY-2006 - RHEL 7.4，支持 Docker EE 17.06.2。
- QUALITY-2007 - RHEL 7.4，支持 Docker 17.12.1-ce。
- QUALITY-2057 - CentOS 7.4，支持 Docker EE 17.06.2。

# DC/OS 1.11.2 中的安全巩固

- DCOS-21465 - 更新了 [CVE-2017-11427](https://www.kb.cert.org/vuls/id/475445) 的 python3-saml。[enterprise type="inline" size="small" /] 
- DCOS-21958 - 管理节点上的 Admin Router 默认不再支持旧版 TLS 1.1 协议和 3DES 加密算法。[enterprise type="inline" size="small" /] 


<p class="message--note"><strong>注意: </strong> 
RHEL 7.4 支持新的 Docker 版本。请参阅 <a href="https://docs.mesosphere.com/version-policy/">兼容性矩阵</a> 了解更多信息。
Kubernetes 包依赖关系记录 <a href="https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install">在此处</a>。</p>


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
- 现在支持 IPv6 用于 Docker 容器。
- DC/OS 网络堆栈的性能改进 - 所有网络组件 (minuteman、navstar、spartan) 被整合到一个被称为 `dcos-net` 的单个 systemd 单元中。请查看此 [注意](/cn/1.11/networking/#a-note-on-software-re-architecture)，以进一步了解网络堆栈的重新分解。
- 配置参数 `dns_forward_zones` 现在采用对象列表，而不是嵌套列表（[DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)）。[查看文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) 以了解其使用情况。

[enterprise]
### 安全
[/enterprise]
- 密钥管理服务
 - 除环境变量以外，密钥现在还可以是二进制文件。
 - 现已支持分层访问控制。

### 监控
- DC/OS 度量标准组件现在以 [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 格式产生度量数据。[查看文档](/cn/1.11/metrics/)。
- 统一日志记录 API 提供对容器（任务）和系统组件日志的简单访问。[查看文档](/cn/1.11/monitoring/logging/logging-api/logging-v2/)。

### 存储
- DC/OS 存储服务 0.1 (beta) - DSS 用户能够根据配置文件或策略，动态地创建卷，以调整其应用程序的存储要求。该特性利用行业标准容器存储接口 (CSI) 让 Mesosphere、社区和合作伙伴能够提高开发 DC/OS 中存储特性的效率。[查看文档](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /] [enterprise type="inline" size="small" /]
- Pod 现在支持永久卷。[查看文档](/cn/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

<p class="message--note"><strong>注意: </strong> 因为这些存储功能在 1.11 中为 beta，因此在安装 DC/OS 时，它们必须在config.yaml 文件中明确启用。不建议将 beta 特性用于生产用途，但却是指出项目前进方向的良好指示。</p>

### 更新了 DC/OS 数据服务
- 现已支持对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的TLS 加密。[enterprise type="inline" size="small" /]
- 对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。[enterprise type="inline" size="small" /]
- 新的 API 端点用于暂停 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的节点。使用此端点以空闲命令状态重新启动节点用于调试。
- 新的 DC/OS Kafka ZooKeeper 服务。[查看文档](/cn/services/kafka-zookeeper/)。
- 现在，您可以从 DC/OS UI 的下拉菜单中选择 DC/OS 数据服务版本。
- 提高了所有 DC/OS 数据服务的可扩展性。


