---
layout: layout.pug
navigationTitle: 1.12.3 版本注释
title: 1.12.3 版本注释
menuWeight: 5
excerpt: DC/OS 1.12.3 版本注释
---

DC/OS 1.12.3 于 2019 年 3 月 14 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.3 包括以下组件：
- Apache Mesos 1.7.3 [变更记录](https://github.com/apache/mesos/blob/5e234c8d8edc1bb73ba557f5774c609fa460c9e7/CHANGELOG)。
- Marathon 1.7.203 [变更记录](https://github.com/mesosphere/marathon/blob/b26a8b310561934071c5f347ee5e184a3279cabd/changelog.md)。
- Metronome 0.5.71 [变更记录](https://github.com/dcos/metronome/blob/cf8887dd836d3629e3f5ac071624e055bdffcec8/changelog.md )。

<!-- <p class="message--note"><strong>注意：</strong>DC/OS 1.12.1 版本支持<a href="../../../version-policy">兼容性矩阵</a>中列出的新版 CoreOS 和 Docker。</p> -->

# 发布摘要

DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.12.3 中已修复的问题
在 DC/OS 1.12.3 中修复的问题按特性、作用区域或组件分组。大多数更改说明都包含一个或多个问题跟踪标识符便于称呼。

## 命令行界面 (CLI)
- DCOS-42928 - 包括 `dcos node diagnostics` 命令在捆绑包中生成的 `docker ps` 输出。

## GUI
- DCOS-45863 - 目前，`Settings/LDAP Directory/Add Directory/Authentication` 对话框具有必选项 `lookup-dn` 和可选项 `lookup-password`。此版本提供了在 `Anonymous Bind` 和 `LDAP Credentials` 之间进行选择的可能性，意味着：
 - 如果选择 `Anonymous Bind`，则发送给 Bouncer `/ldap/config` API 的 `JSON` 没有 `lookup-dn` 或 `lookup-password` 字段。
 - 如果选择 `LDAP Credentials`，请使用当前行为。发送给 Bouncer `/ldap/config` API 的 `JSON` 有 `lookup-dn` 和 `lookup-password` 字段。`lookup-password` 字段可以是空字符串。

## 安装
 - COPS-4282、DCOS_OSS-4613 - 如果使用 `--validate` 选项运行 `dcos_generate_config`，命令就会在您的 `config.yaml` 文件中验证配置设置。在某些情况下，这个选项会发出警告消息，表明对于不再使用的参数的验证失败。例如，`ssh_key_path` 和 `ssh_user` 等一些 SSH 参数就已经被弃用。以前，如果使用 `--validate` 选项运行 `dcos_generate_config` 以检查配置设置并且未指定这些参数，则命令就会报告配置参数验证失败。在此版本中， `--validate` 选项不会返回安装不再需要的参数的验证失败消息。

- DCOS-15890 - 高级安装程序上的运行前检查显示了具有误导性的信息。此版本改进了错误消息，如果在安装开始时未运行 Docker 它就会报错。

## Marathon
- COPS-3554 - 修复了一个罕见的问题，即随后的 Marathon 可能会尝试代理非首要实例。这项修复添加了监视器循环进程，在重新选举后监控和重新注册（如有必要）Marathon 首要实例。

- COPS-3593、DCOS_OSS-4193 - 在之前版本中，如果容器崩溃或在某些 DNS 处于故障条件下，Marathon 管理的某些服务可能无法重新启动。例如，如果第一个 Zookeeper 节点或第一个 DC/OS 管理节点无法访问，则重新启动服务可能会失败。这个问题影响 Marathon 的高可用性，因此 DC/OS 1.11.5 和 1.11.6 引入了一种解决方案（ping zk-1）来解决此问题。在本版本中，基本问题得到解决，如果您已部署，则可以安全地移除该解决方案。有关问题的背景信息以及删除解决方案的步骤，请参阅 [产品咨询文档](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004)。

## Mesos
- COPS-4104 - 此版本修复了在以下情况下导致容器和代理恢复失败的问题：
 - 容器的检查点 Docker 卷文件不存在。
 - 容器的检查点 Docker 卷文件存在但是为空。
 
 在这项修复之前，丢失或空的文件可能会阻止代理重新启动并恢复正常操作。在此版本中，空的或丢失的 docker/卷文件的恢复通过容器化工具或 `docker/volume` 隔离器的 `recover` 方法进行处理。

- DCOS-46554 - 除非 offer 包含磁盘，否则此更改会强制 Mesos 管理节点在每个 offer 中都有端口资源。这有助于减少没有端口的 offer 数量，而这对大多数框架都没有用。

## 度量标准
- DCOS-47991、DCOS_OSS-4760 - 纠正了 Mesos 输入插件将字段映射到 Telegraf 标签的方式存在的问题，这个问题会导致 Mesos Grafana 仪表板出现间隙。

- DCOS_OSS-4624 - 目前没有容器度量标准提供 Mesos 持久卷的磁盘使用情况，仅提供了 Mesos 沙盒的磁盘使用情况。此版本添加了缺少的容器度量标准，例如 `DiskStatistics`、`Perf`、`NetTrafficControlStatistics`、`NetSNMPStatistics`，还添加了所有可用的 `blkio stats`。

## 网络
- COPS-3279、COPS-3576、DCOS-37703、DCOS-37703、DCOS-39703 - 当您启用 `statsd` 度量标准输入插件并查看后端活动时，服务端点值和基于服务地址的统计信息将返回正确的成功和失败连接数。

[enterprise]
## 安全
[/enterprise]
- DCOS-46381、DCOS-47348 - Marathon 应用定义格式已从 [1.4 更改为 1.5](https://github.com/mesosphere/marathon/blob/master/docs/docs/upgrade/network-api-migration.md#example-definitions)。此前，Admin Router 代码仅支持 v1.4 应用定义，因此 Admin Router 无法在 `/service/` 端点使用 `ip-per-container` 功能揭示应用程序。此版本为 Marathon v1.5 应用定义添加了必要的路由逻辑。

- DCOS-47687 - Zookeeper 快照和日志文件包含敏感数据，并且管理节点上的任何用户都可以读取，因此务必要控制 ZooKeeper 数据目录的权限。这种修复可确保 `/var/lib/dcos/exhibitor/zookeeper` 归 `dcos_exhibitor` 所有，并且只拥有所有者权限。

# 已知问题和限制
本部分介绍了不一定影响所有客户，但可能需要更改环境以解决特定情况的所有已知问题或限制。这些问题按特性、作用区域或组件分组。适用时，问题说明会包括一个或多个问题跟踪标识符。

## 网络
- COPS-3585 - 在以前的版本中，死锁或竞争条件可能会阻止群集中的一个或多个节点生成路由表，该路由表通过 Marathon 负载均衡适当转发网络流量。路由表和网络连接问题可能导致以下问题：
 - 某些节点上的网络覆盖配置不完整。
 - 某些节点上的 VIP/IPVS/L4LB 配置不完整。
 - 某些节点上缺少 DNS 记录。
您可以在受影响的节点上重新启动 `systemd` 进程以恢复正常的网络连接。此修复程序与缓解由 Erlang 库（DC/OS 1.12）中的安全套接字层（SSL）死锁引起的网络问题有关。

# 关于 DC/OS 1.12 
DC/OS 1.12 包括许多新特性和功能。主要特性和增强功能集中在：
- [Mesosphere Kubernetes 引擎](#kubernetes)
- [Mesosphere Jupyter 服务](#jupyter)
- [观察性和度量标准](#observe-metrics)
- [专用包注册表](#private-reg)
- [安装和升级改进](#install)
- [LDAP 和网络连接增强功能](#ldap-net)

<a name="kubernetes"></a>

### Mesosphere Kubernetes 引擎
- 引入高密度多 Kubernetes (HDMK)，使操作者能够在 DC/OS 上运行多个 Kubernetes 群集时充分利用智能资源池。与每个虚拟机运行单个 Kubernetes 节点的其他 Kubernetes 发行版相比，Mesosphere HDMK 使用其智能资源池将多个 Kubernetes 节点打包到连接裸机、虚拟机和公共云实例的同一服务器上，从而显著节省成本并提高资源利用效率。[详细了解 DC/OS 上的 Kubernetes](/services/kubernetes/2.0.0-1.12.1/)。

<a name="jupyter"></a>

### Mesosphere Jupyter 服务 (MJS)
- 提供安全的 [云原生 Jupyter](https://docs.mesosphere.com/services/beta-jupyter/)笔记本即服务，使数据科学家能够在弹性 GPU 池上执行分析和分布式机器学习，并可访问大型快速数据服务。
- 安全连接到 S3 和（Kerberose 授权的）HDFS 上的数据湖和数据集。
- 加入支持 GPU 的 Spark 和分布式 TensorFlow。
- 提供 OpenID Connect 身份认证和授权，支持 Windows 集成身份认证（WIA）和活动目录联合服务（ADFS）。

<a name="observe-metrics"></a>

### 观察性和度量标准
- 引入了具有多种输出格式的灵活且可配置的度量标准管线
- 增强对应用程序度量标准类型（包括直方图、计数器、计时器和计量器）的支持。
- 提供支持提高采样率和多度量标准数据包。
- 引入 Mesos [框架度量标准](http://mesos.apache.org/documentation/latest/monitoring/#frameworks)。
- 在 1.11 中通过 Prometheus 终点收集度量标准时，不再需要修改。

<a name="private-reg"></a>

[enterprise]
### 专用包注册表
[/enterprise]
- 已启用 [本地包分发和管理](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/)。
- 已启用气隙式虚拟专用云包管理。
- 简化包工件管理。
- 引入用于在群集中添加/删除/更新包的特定于包的控件。
- 引入包管理 CLI。

<a name="install"></a>

### 安装和升级
- 提供完全支持在 SELinux 强化操作系统上安装和操作集群，SE Linux 采用目标执行模式，适用于所有经过强化的非 DC/OS组件。
- 引入了一种统一的基于 Terraform 的开源工具，用于在 AWS、GCP 和 Azure 上配置、部署、安装、升级和停用 DC/OS。
- 引入通过快速启动过程实现直观简化的安装，只需 10-15 分钟即可通过几个简单的步骤启动 DC/OS 群集。
- 正式推荐为 Mesosphere 支持的安装方法，内置最佳实践（即持续升级的顺序管理节点和并行代理节点）。
- 重组 [Mesosphere 安装文档](https://docs.mesosphere.com/1.12/installing/evaluation/)，整理 Mesosphere 支持的安装方法和社区支持的安装方法。
- 扩展后的 DC/OS 升级路径使 Mesosphere 能够在支持的 DC/OS 补丁版本中的跨越升级特定的 [升级路径](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths)（即一次完成从 1.11.1 => 1.11.5 的升级）并跨越升级支持的  DC/OS 主要版本之间的升级路径（例如，让您能够一次完成从 1.11.7 到 1.12.1 的升级）。
- 如果已安装可选的 DC/OS 存储服务包，则从 1.12.0 升级到 1.12.1 要求您首先按照 [手动将 DSS 软件包从 0.4.x 升级到 0.5.x](/services/beta-storage/0.5.2-beta/upgrades/) 中提供的说明进行操作。在升级 DC/OS 存储 **之前**，必须将群集节点升级到 1.12.1，以防在升级后发生 Mesos 代理节点崩溃。

<a name="ldap-net"></a>

[enterprise]
### LDAP 和网络增强功能
[/enterprise]
- 引入匿名 LDAP 绑定符合标准化企业 LDAP 集成模式，无需专用的 DC/OS 集成 LDAP 用户。
- 提供动态 LDAP 同步功能，自动同步 [LDAP 用户帐户组](https://docs.mesosphere.com/1.12/security/ent/users-groups/)，而无需使用导入 DC/OS 的帐户手动同步 [LDAP 目录](https://docs.mesosphere.com/1.12/security/ent/ldap/)。
- 增强网络组件，有 150 多个错误修复，具有受限的可见性记录。
- 改进了 DNS  聚合时间（亚秒）性能。
- 为可覆盖网络配置了 MTU。
- 为群集中的新代理提供可重用的 IP 地址。
- 借助 Erlang 库中的 SSL 死锁缓解网络连接停滞状态。
- 提供 TLS 1.2 支持。
- 按容器网络度量标准提供支持。
- 在 EDGE-LB 中运用持久连接以进行 L7 负载均衡。[enterprise type="inline" size="small" /]
- 改进了 Edge-LB 的日志记录。[enterprise type="inline" size="small" /]
