---
layout: layout.pug
navigationTitle: 1.12.2 版本注释
title: 1.12.2 版本注释
menuWeight: 10
excerpt: DC/OS 1.12.2 版本注释
---

DC/OS 版本 1.12.2 于 2019 年 2 月 11 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.2 包括以下组件：
- Apache Mesos 1.7.x [变更记录](https://github.com/apache/mesos/blob/4f21147a9334ef9ed84dcf11742ce448062f3ec/CHANGELOG)。
- Marathon is 1.7.x [变更记录](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md)。
- Metronome is 0.5.71 [变更记录](https://github.com/dcos/metronome/blob/391637cc19cd6136e8733ff8b684aed31b2cf672/changelog.md)。

<!-- <p class="message--note"><strong>注意：</strong>DC/OS 1.12.1 版本支持<a href="../../../version-policy">兼容性矩阵</a>中列出的新版 CoreOS 和 Docker。</p> -->

# 发布摘要

DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.12.2 中已修复的问题
在 DC/OS 1.12.2 中修复的问题按特性、作用区域或组件分组。大多数更改说明都包含一个或多个问题跟踪标识符便于称呼。

## 命令行界面 (CLI)
- DCOS_OSS_3877、DCOS_OSS-4275 - 您用来为记录的信息创建诊断捆绑包的 `dcos-diagnostics` 命令会作为 `root` 用户运行。使用根用户帐户运行命令以生成诊断捆绑包让您可以收集仅对超级用户可用的敏感信息。

## 安装
- COPS-4263 - 如果使用 `--validate` 选项运行 `dcos_generate_config`，命令就会在您的 `config.yaml` 文件中验证配置设置。在某些情况下，这个选项会发出警告消息，表明对于不再使用的参数的验证失败。例如，`ssh_key_path` 和 `ssh_user` 等一些安全的 shell 参数就已经被弃用。以前，如果使用 `--validate` 选项运行 `dcos_generate_config` 以检查配置设置并且未指定这些参数，则命令就会报告 
配置参数验证失败。在此版本中， `--validate` 选项不会返回安装不再需要的参数的验证失败消息。

## 作业调度 (Metronome)
- DCOS_OSS-4717 - 诊断捆绑包含有关 Metronome 作业的信息。

## Marathon
- COPS-3554 - 这一版本引入了一个监视器循环程序用于进行监控，并在必要时重新注册重新选举的 Marathon 首要节点。

- COPS-3593、DCOS_OSS-4193 - 在之前版本中，如果容器崩溃或在某些 DNS 处于故障条件下，Marathon 管理的某些服务可能无法重新启动。例如，如果第一个 Zookeeper 节点或第一个 DC/OS 管理节点无法访问，则重新启动服务可能会失败。

 这个问题影响 Marathon 的高可用性，因此 DC/OS 1.11.5 和 1.11.6 引入了一种解决方案（ping zk-1）来解决此问题。在本版本中，基本问题得到解决，如果您已部署，则可以安全地移除该解决方案。有关问题的背景信息以及移除解决方案的步骤，请参阅 [如果第一个 DC/OS 不可用，则删除 Marathon 无法启动的补丁](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004)。

## Mesos
- DCOS-46388 - 管理节点需完成所有 `LAUNCH_GROUP` 的授权结果处理之后才能执行其他操作。如有任何授权请求被拒绝，此更改可防止后续操作失败。

- DCOS-46753 - 此版本改进了处理失败或停止的启动操作的方法，以确保正确解析容器输入和输出操作，并正确关闭所有文件描述符。

 之前，如果容器化工具启动失败，或在 I/O 交换机服务器启动之后但在容器进程完成执行之前被丢弃，则用于发送重定向到 I/O 交换机的文件描述符可能会失效，从而阻止容器完成清理操作。在具有巨大处理负载的代理上，如果经常启动容器运行状况或就绪情况检查，就可能遇到这一问题。

- DCOS-46814 - 重新启动代理主机后，代理的元目录中执行程序的分叉子进程 ID 和 `libprocess` 进程 ID 已废弃，不应进行读取。对代理恢复期间读取的进程标识符执行这项更改后，如果有进程在重启之后重用进程 ID，则会阻止容器等待此类进程。

 以前，如果重新启动代理，代理会等待其容器进程 ID 转为退出状态（`pid`）之后再终止执行器。如果在重新启动后生成具有相同 `pid` 的新进程，则代理恢复功能可能会停止等待错误的子进程 ID，同时阻止执行器终止并更新其任务。

- DCOS-47699 - 默认分配给容器沙盒路径的权限已还原为 0755，以允许使用非根用户访问文件和任务。

- DCOS-48052 - 通过更新容器化工具启动二进制文件，可防止恶意用户利用容器运行时使用的 `init` 辅助函数，包括 DockerD、containerD 和 UCR。如果没有此更改，恶意用户就能访问容器的根级权限，并使用这些权限在主机上执行可能有恶意的代码。

 这一问题已经被 RunC 社区 (CVE-2019-5736) 通报，并且会影响 Docker 引擎和 Mesosphere Kubernetes 引擎（MKE）容器运行时组件。Apache Mesos 社区也针对 Mesosphere 通用容器运行时间 (UCR) 报告了该问题。所有现有版本的 DC/OS、Mesosphere Kuberentes 引擎和 Docker 引擎都会受此漏洞影响。但是，如果群集使用 `strict` 安全模式运行并使用默认的 `nobody` 用户帐户启动 UCR 容器，则此漏洞不会影响 DC/OS 群集或 UCR 容器。

 有关此漏洞及其对 DC/OS 的影响的更多信息，请参阅 [容器运行时漏洞](https://support.mesosphere.com/s/article/Known-Issue-Container-Runtime-Vulnerability-MSPH-2019-0003)和 [Docker 引擎版本注释](https://docs.docker.com/engine/release-notes/)。

## 度量标准
- COPS-3279、COPS-3576、DCOS-37703、DCOS-37703、DCOS-39703 - 此版本更正了在启用 `statsd` 度量标准输入插件时返回的服务端点值和基于服务地址的统计信息。

- DCOS-47301、DCOS_OSS-4688 - 此版本包括一个新的群集配置选项 `enable_mesos_input_plugin`，让您可以启用或禁用 Telegraf 的 Mesos 度量标准输入插件。此选项启用后，无需将文件上传到群集中的每个节点即可收集度量标准。

 可以通过在 `config.yaml` 文件中将 `enable_mesos_input_plugin` 选项设置为 `true`，启用输入插件。默认值为 `false`。如果您使用 [Mesosphere 通用安装程序](/cn/1.12/installing/evaluation/)或使用自定义[配置文件](/cn/1.12/installing/production/advanced-configuration/)手动安装，则此配置设置会成为高级配置选项。

- DCOS_OSS-4679 - 已修改 `/containers` 端点的度量标准 API，以包含指定何时收集返回的度量标准的时间戳。时间戳字段用于确定度量标准的年龄，并确保在刷新缓存时确定缓存的度量标准过期并予以删除。时间戳防止度量标准返回误导性的 204 无内容 HTTP 响应。

## 网络
- COPS-3585 - 在以前的版本中，死锁或竞争条件可能会阻止群集中的一个或多个节点生成路由表，该路由表通过 Marathon 负载均衡适当转发网络流量。路由表和网络连接问题可能导致以下问题：
 - 某些节点上的网络覆盖配置不完整。
 - 某些节点上的 VIP/IPVS/L4LB 配置不完整。
 - 某些节点上缺少 DNS 记录。

 您可以在受影响的节点上重新启动 `systemd` 进程以恢复正常的网络连接。此修复程序与缓解由 Erlang 库（DC/OS 1.12）中的安全套接字层（SSL）死锁引起的网络问题有关。

- COPS-3743、DCOS_OSS-2362、DCOS_OSS-4620 - DC/OS 网络组件（`dcos-net`）支持在 DC/OS 群集的节点上设置**群集标识**选项。通过启用此功能，可以在节点从一个群集移动到另一个群集时阻止节点跨群集进行通信。此功能可确保群集中的节点具有唯一标识符，以防群集之间发生未经授权的“交互”。

- COPS-4124、DCOS-46132、DCOS_OSS-4667 - 新的代理选项 `--network_cni_root_dir_persist` 允许容器节点根目录将网络信息存储在一个永久位置。使用此选项可以在 `work_dir` 目录下指定持久保留网络相关信息的容器根目录。通过持久保留该信息，容器网络接口（CNI）隔离器代码可以在重新启动后执行适当的清理操作。如果重新启动节点不会从 `etcd` 删除旧容器和 IP/MAC 地址（久而久之导致资源池耗尽），则应在 `config.yaml` 文件中将 `--network_cni_root_dir_persist` 代理设置为 `true`。

 <p class="message--note"><strong>注意：</strong>更改此标志需要重新启动代理节点或关闭节点上运行的所有容器进程。由于需要重新启动或关闭容器，`--network_cni_root_dir_persist` 代理选项的默认值为 `false`。在更改此选项之前，应该计划代理维护工作，以便尽量减少任何服务中断。如果设置了此选项并重新启动节点，则还应在使用 CNI 插件 DEL 命令重新启动后取消设置 `CNI_NETNS` 环境变量，以便插件尽可能多地清理资源（例如，通过释放 IPAM 分配来清理）并返回操作成功的回复。</p>

- COPS-4205 - 此版本添加了一个带有时间戳的唯一查询参数，以防止某些端点的 HTTP 响应标头出现缓存问题。此项修复清除缓存中的过期信息，以便显示正确的任务信息。该变更解决了 DC/OS 在使用 Edge-LB 或 Kubernetes 等服务一段时间之后未返回数据的间歇性问题。

- DCOS-40878、DCOS_OSS-4164 - 您可以设置新的配置选项，以便在任何给定时间控制管理节点事件流上允许的活动订阅者数量上限。`--max_operator_event_stream_subscribers` 选项有助于防止负载均衡器或代理服务器在客户端断开连接后保持与事件流端点的连接。`--max_operator_event_stream_subscribers` 选项的默认值 为 1000 位订阅者。如果网络的客户端没有立即关闭连接，您可能希望降低允许的订阅者数量。此外，运营商事件流订阅者的新度量标准向管理节点的运营商事件流反馈订阅者总数。

- DCOS_OSS-4514、DCOS_OSS-4666 - 此版本将公共和专用节点的服务地址（`A` 或 `AAAA`）记录添加到 DNS。可以使用 `public.thisnode.thisdcos.directory` 返回本地代理或管理节点的**公共 IP 地址**，或使用 `thisnode.thisdcos.directory` 返回本地代理或管理节点的**专用 IP 地址**。

 对于 DNS 查找请求，服务地址 `A` 记录使用给定主机的 IPv4 表示法将域名转换为相应的 IP 地址。服务地址 `AAAA` 记录使用给定主机的 IPv6 地址表示法返回 IP 地址。

# 已知问题和限制
本部分介绍了不一定影响所有客户，但可能需要更改环境以解决特定情况的所有已知问题或限制。这些问题按特性、作用区域或组件分组。适用时，问题说明会包括一个或多个问题跟踪标识符。

### Marathon 插件依赖关系
如果您有自定义 Marathon 插件或已向群集添加任何与 Marathon 相关的自定义，则可能需要在升级到此版本后更新插件或自定义组件。例如，如果您有一个依赖于使用 Scala 2.11 编译的 Scala Logging 3.1.0 版的插件，则需要将 Scala Logging 包升级到使用 Scala 2.12 编译的 3.7.2 版，以兼容该版本 DC/OS 所含的 Marathon 包中使用的日志记录库。

### 收集度量标准的服务帐户权限
DC/OS（1.12 版及更新版本）中的度量标准基于 Telegraf。Telegraf 提供基于代理的服务，在 DC/OS 群集中的每个管理节点和代理节点上运行。默认情况下，Telegraf 从同一节点上运行的所有进程收集度量标准，收集的信息经过处理之后被发送到中央度量标准数据库。Telegraf 程序在服务帐户 `dcos_telegraf_master` 和 `dcos_telegraf_agent` 下运行。必须授予这两个服务帐户 `dcos::superuser permissions`。

# 关于 DC/OS 1.12 
DC/OS 1.12 包括许多新功能。主要功能和增强功能集中在：
- [Mesosphere Kubernetes 引擎](#kubernetes)
- [Mesosphere Jupyter 服务](#jupyter)
- [观察性和度量标准](#observe-metrics)
- [专用包注册表](#private-reg)
- [安装和升级改进](#install)
- [LDAP 和网络连接增强功能](#ldap-net)

<a name="kubernetes"></a>

### Mesosphere Kubernetes 引擎
- 高密度多 Kubernetes (HDMK) 使操作者能够在 DC/OS 上运行多个 Kubernetes 群集时充分利用智能资源池。与每个虚拟机运行单个 Kubernetes 节点的其他 Kubernetes 发行版相比，Mesosphere HDMK 使用其智能资源池将多个 Kubernetes 节点打包到连接裸机、虚拟机和公共云实例的同一服务器上，从而显著节省成本并提高资源利用效率。[详细了解 DC/OS 上的 Kubernetes](/services/kubernetes/2.0.0-1.12.1/)。

<a name="jupyter"></a>

### Mesosphere Jupyter 服务 (MJS)
- 提供安全的 [云原生 Jupyter](https://docs.mesosphere.com/services/beta-jupyter/)笔记本即服务，使数据科学家能够在弹性 GPU 池上执行分析和分布式机器学习，并可访问大型快速数据服务。
- 安全连接到 S3 和（Kerberose 授权的）HDFS 上的数据湖和数据集。
- 支持 GPU 的 Spark 和分布式 TensorFlow。
- OpenID Connect 身份认证和授权，支持 Windows 集成身份认证（WIA）和活动目录联合服务（ADFS）。

<a name="observe-metrics"></a>

### 观察性和度量标准
- 引入了具有多种输出格式的灵活且可配置的度量标准管线
- 增强对应用程序度量标准类型（包括直方图、计数器、计时器和计量器）的支持。
- 支持提高采样率和多度量标准数据包。
- Mesos 框架度量标准现在 [可用](http://mesos.apache.org/documentation/latest/monitoring/#frameworks)。
- 在 1.11 中通过 Prometheus 终点收集度量标准时，不再需要修改。

<a name="private-reg"></a>

[enterprise]
### 专用包注册表
[/enterprise]
- 已启用 [本地包分发和管理](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/)。
- 已启用气隙式虚拟专用云包管理。
- 简化包工件管理。
- 用于在群集中添加/删除/更新包的特定于包的控件。
- 包管理 CLI。

<a name="install"></a>

### 安装和升级
- 完全支持在 SELinux 强化操作系统上安装和操作集群，SE Linux 采用目标执行模式，适用于所有经过强化的非 DC/OS组件。
- 引入一种统一的基于 Terraform 的开源工具，用于在 AWS、GCP 和 Azure 上配置、部署、安装、升级和停用 DC/OS。
- 通过快速启动过程实现直观简化的安装，只需 10-15 分钟即可通过几个简单的步骤启动 DC/OS 群集。
- 正式推荐为 Mesosphere 支持的安装方法，内置最佳实践（即持续升级的顺序管理节点和并行代理节点）。
- 重组 [Mesosphere 安装文档](https://docs.mesosphere.com/1.12/installing/evaluation/)，整理 Mesosphere 支持的安装方法和社区支持的安装方法。
- 扩展后的 DC/OS 升级路径使 Mesosphere 能够在支持的 DC/OS 补丁版本中的跨越升级特定的 [升级路径](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths)（即一次完成从 1.11.1 => 1.11.5 的升级）并跨越升级支持的  DC/OS 主要版本之间的升级路径（例如，让您能够一次完成从 1.11.7 到 1.12.1 的升级）。
- 如果已安装可选的 DC/OS 存储服务包，则从 1.12.0 升级到 1.12.1 要求您首先按照 [手动将 DSS 软件包从 0.4.x 升级到 0.5.x](/services/storage/latest/upgrades/) 中提供的说明进行操作。在升级 DC/OS 存储 **之前**，必须将群集节点升级到 1.12.1，以防在升级后发生 Mesos 代理节点崩溃。

<a name="ldap-net"></a>

[enterprise]
### LDAP 和网络增强功能
[/enterprise]
- 匿名 LDAP 绑定符合标准化企业 LDAP 集成模式，无需专用的 DC/OS 集成 LDAP 用户。
= 动态 LDAP 同步功能自动同步 [LDAP 用户帐户组](https://docs.mesosphere.com/1.12/security/ent/users-groups/)，而无需使用导入 DC/OS 的帐户手动同步 [LDAP 目录](https://docs.mesosphere.com/1.12/security/ent/ldap/)。
- 网络组件增强功能，有 150 多个错误修复，具有受限的可见性记录。
- 改进了 DNS  聚合时间（亚秒）性能。
- 可覆盖网络的可配置 MTU。
- 群集中新代理可重用 IP 地址。
- 借助 Erlang 库中的 SSL 死锁缓解网络连接停滞状态。
- TLS 1.2 支持。
- 按容器提供网络度量标准支持。
- 利用 Edge-LB 中的持久连接进行 L7 负载均衡。[enterprise type="inline" size="small" /]
- 改进了 Edge-LB 的日志记录。[enterprise type="inline" size="small" /]
