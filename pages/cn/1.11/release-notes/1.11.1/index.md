---
layout: layout.pug
navigationTitle: 1.11.1 版本注释
title: 1.11.1 版本注释
menuWeight: 15
excerpt: DC/OS 1.11.1 版本注释
---

DC/OS 1.11.1 于 2018 年 4 月 18 日发布。

[button color="purple" href="https://downloads.dcos.io/dcos/stable/1.11.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="light" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise[/button]

# <a name="issues-fixed"></a>DC/OS 1.11.1 中已修复的问题

- COPS-2952 - 网络：修复了由于遥测 API 没有发送度量数据而产生的漏洞。[enterprise type="inline" size="small" /]
- CORE-1447、CORE-1448 和 CORE-1449 - 加强了 Mesos 的认证令牌刷新逻辑。[enterprise type="inline" size="small" /]
- DCOS-19648 - 为服务创建视图添加了布局约束验证器。
- DCOS-20081 - DC/OS IAM：通过使搜索/绑定检查不区分大小写来加强 LDAP 组导入。[enterprise type="inline" size="small" /]
- DCOS-20999 - DC/OS IAM：修复了磁盘装满时数据库崩溃的问题。[enterprise type="inline" size="small" /]
- DCOS-21000 - 修复了 Marathon 的授权逻辑，支持“全面”操作。[enterprise type="inline" size="small" /]
- DCOS-21128 - DC/OS UI：解决了卸载服务后服务选项卡崩溃的情形。
- DCOS-21266 - DC/OS UI：修复了浏览任务沙盒时文件导航问题。
- DCOS-21305 - 安装universe包时引入了“最低 DC/OS 版本”（例如，无法在 DC/OS 1.10 上安装需要 DC/OS 1.11 的软件包）。
- DCOS-21337 - DC/OS UI：改善了消耗 Mesos 事件流 HTTP API 时的错误处理情况。
- DCOS-21359 - 防止在“移除”模式打开时未安装的服务断开 UI。
- DCOS-21374 - Cosmos：解决了卸载未定义环境的 Marathon 应用程序时出现的崩溃。
- DCOS-21451 - 修复了 Admin Router 不会拾取 Mesos 主节点更改的漏洞（引起在使用服务端点时出现意外 404 HTTP 响应）。
- DCOS-21486 - 网络：增强了与 Kubernetes 的兼容性。
- DCOS-21507 - DC/OS UI：增强了对 DC/OS 存储服务的支持。[enterprise type="inline" size="small" /]
- DCOS-21557 - 将 cURL 更新到版本 7.59。
- DCOS-21596 - DC/OS IAM：修复了在 LDAP 组导入期间将一个本地用户添加到组的漏洞。[enterprise type="inline" size="small" /]
- DCOS-21683 - 修复了由于集群安装可能失败而导致的罕见 IAM 数据库死锁。[enterprise type="inline" size="small" /]
- DCOS_OSS-1759 - Cosmos：更新了 package-manager.yaml 以修复包管理 API 中的架构错误。
- DCOS_OSS-1878 - 防止在查找 IP 检测脚本的位置时 dcos-checks 忽略 --detect-ip 标记的值。
- DCOS_OSS-1903 - 将 OpenSSL 更新到版本 1.0.2n。
- DCOS_OSS-2028 - 改善了升级后完整性检查失败时的错误报告。
- DCOS_OSS-2087 - Cosmos：提高了服务卸载期间面向用户的消息的可读性。
- DCOS_OSS-2132 - DC/OS 日志：整合了日志文件轮换的处理。
- DCOS_OSS-2162 - Mesos 不再通过其状态 JSON 文档披露 ZooKeeper 凭据。
- DCOS_OSS-2210 - 修复了历史记录服务会崩溃的边缘案例。
- DCOS_OSS-2229 - 突出了 dcos-net。[lashup](https://github.com/dcos/lashup) 中的性能改进和漏洞修复。
- DCOS_OSS-2247 - 修复了 dcos-checks 中的漏洞，将命令超时视为失败的检查。
- DCOS_OSS-2292 - 修复了 dcos 任务 - 追随任务可能会崩溃的情况。
- DSS_EE-161 - DC/OS 存储：修复了 LVM 插件在 CoreOS 上失败时的漏洞。[enterprise type="inline" size="small" /]
- INFINITY-3358 - DC/OS UI：为区域感知实施了区域选取器。
- MARATHON-8090 - 整合了 Marathon 的 GPU 资源配置。

# <a name="notable-changes"></a>DC/OS 1.11.1 中的重大更改

- 更新到 [Mesos 1.5.1-b0a33cb](https://github.com/apache/mesos/blob/b0a33cb/CHANGELOG)。
- 更新到 [Marathon 1.6.352](https://github.com/mesosphere/marathon/releases)。
- 更新到 [Metronome 0.4.1](https://github.com/dcos/metronome/releases/tag/v0.4.1)。
- DCOS-16431 - 引入了新的 DC/OS 配置变量 `adminrouter_auth_cache_enabled` 用于控制 Admin Router 的权限缓存。[enterprise type="inline" size="small" /]
- DCOS-21545 - 将 Prometheus 生产者移至端口 61091。
- DCOS_OSS-2130 - 增加了对 CoreOS 1632.2.1 的支持。

# <a name="known-issue"></a>DC/OS 1.11.1 中的已知问题

- DCOS-22128 - 使用带卷的 Pod 时，如果 Pod 中的某个容器未配置成挂载卷，集群将无法通过 UI 访问任何服务。作为替代办法，使用带卷的 Pod 时，可使用 CLI。

<p class="message--note"><strong>注意: </strong> Kubernetes 包依赖关系记录 <a href="https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install">在此处</a>。</p>

# 关于 DC/OS 1.11

DC/OS 1.11 包含许多新功能，重点是：
- 跨多个云管理集群 [enterprise type="inline" size="small" /]
- 生产 Kubernetes 即服务
- 增强了数据安全性 [enterprise type="inline" size="small" /]
- 更新了数据服务

提供有关新功能和服务的反馈：[support.mesosphere.com](https://support.mesosphere.com)。

<a name="new-features"></a>
## 新特性和功能

### 平台
- 多区域管理 - 使 DC/OS 集群能跨越多个数据中心、云和远程分支，同时提供统一的管理和控制集群。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 已链接的集群 - 集群链路是一个集群和另一个集群之间的单向关系。使用 DC/OS CLI 将一个集群的链接添加到另一个集群或将其删除。设置链接后，您可以使用 CLI 或 UI 在集群之间轻松切换。[查看文档](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。[enterprise type="inline" size="small" /]
 - 故障域感知 - 利用故障域感知使您的服务高度可用，并能在需要时增加容量。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 停用节点 - 支持永久停用节点使得更容易管理“spot”云实例，实现任务的立即重新调度。
- UCR
 - 支持 Docker 镜像垃圾收集。[查看文档](/cn/1.11/deploying-services/containerizers/)。
 - 支持 Docker 镜像拉取秘钥。[enterprise type="inline" size="small" /]

# 网络
- Edge-LB 1.0。[查看文档](https://docs.mesosphere.com/services/edge-lb/1.0/) [enterprise type="inline" size="small" /]
- Docker 容器现在支持 IPv6。
- DC/OS 网络堆栈的性能改进 - 所有网络组件 (minuteman、navstar、spartan) 被整合到一个被称为 `dcos-net` 的单个 systemd 单元中。请查看此 [注意](/cn/1.11/networking/#a-note-on-software-re-architecture)，以进一步了解网络堆栈的重新分解。
- 配置参数 `dns_forward_zones` 现在采用对象列表，而不是嵌套列表（[DCOS_OSS-1733](https://jira.mesosphere.com/browse/DCOS_OSS-1733)）。[查看文档](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#dns-forward-zones) 以了解其使用情况。

[enterprise]
### 安全
[/enterprise]
- 密钥管理服务
 - 现已支持二进制密钥文件
 - 现已支持分层访问控制。

### 监控
- DC/OS 度量标准组件现在以 [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 格式产生度量数据。[查看文档](/cn/1.11/metrics/)。
- 统一日志记录 API 提供对容器（任务）和系统组件日志的简单访问。[查看文档](/cn/1.11/monitoring/logging/logging-api/logging-v2/)。

### 存储
- DC/OS 存储服务 0.1 (beta) - DSS 用户能够根据配置文件或策略动态地创建卷，以调整其应用程序的存储要求。该特性利用行业标准容器存储接口 (CSI) 让 Mesosphere、社区和合作伙伴能够提高开发 DC/OS 中存储特性的效率。[查看文档](https://docs.mesosphere.com/services/beta-storage/0.1.0-beta/).[beta type="inline" size="small" /][enterprise type="inline" size="small" /]
- Pod 现已支持永久卷。[查看文档](/cn/1.11/deploying-services/pods/).[beta type="inline" size="small" /]

<p class="message--note"><strong>注意: </strong> 因为这些存储特性在 1.11 中为 beta，因此必须明确启用。不建议将 beta 特性用于生产用途，但却是指出项目前进方向的良好指示。</p>

### 更新了 DC/OS 数据服务
- 现在支持对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的TLS 加密。[enterprise type="inline" size="small" /]
- 对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。[enterprise type="inline" size="small" /]
- 新的 API 端点用于暂停 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的节点。使用此端点以空闲命令状态重新启动节点用于调试。
- 新的 DC/OS Kafka ZooKeeper 服务。[查看文档](/cn/services/kafka-zookeeper/)。
- 现在，您可以从 DC/OS UI 的下拉菜单中选择 DC/OS 数据服务版本。
- 提高了所有 DC/OS 数据服务的可扩展性。

## <a name="known-issues"></a>已知问题
- DCOS-9751 - Marathon 未能在禁用 -> 宽容升级期间与 Mesos 管理节点进行认证。
- DCOS-18368 - GUI 安装工具已在 1.11 中停用，将不再继续运行。它将在 1.12 中停用。有关其他安装方法的详细信息，[查看文档](https://docs.mesosphere.com/1.11/installing)。
- DCOS-19047 - 在从 1.10.x 升级到 1.11 时，`dcos-secrets` 服务不可用。[enterprise type="inline" size="small" /]
- INFINITY-3116 - 删除失败的 mnist Tensorflow 软件包从未完成。
