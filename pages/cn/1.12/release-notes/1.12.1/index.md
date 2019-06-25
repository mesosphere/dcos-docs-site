---
layout: layout.pug
navigationTitle: 1.12.1 版本注释
title: 1.12.1 版本注释
menuWeight: 15
excerpt: DC/OS 1.12.1 版本注释
---

DC/OS 版本 1.12.1 于 2019 年 1 月 3 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise [/button]

DC/OS 1.12.1 包括以下组件：
- Apache Mesos 1.7.x [变更记录](https://github.com/apache/mesos/blob/b97f0ba29d40a279dec00ffe51512e3b5a146049/CHANGELOG)。
- Marathon is 1.7.x [变更记录](https://github.com/mesosphere/marathon/blob/48bfd6000c544df5ae03de04b42b019d5e9dbd4b/changelog.md)。
- Metronome is 0.5.71 [变更记录](https://github.com/dcos/metronome/blob/22945457c7cb10cb14d575ceeb137edd8158ba3c/changelog.md)。

<p class="message--note"><strong>注意：</strong>DC/OS 1.12.1 版本支持<a href="../../../version-policy">兼容性矩阵</a>中列出的新版 CoreOS 和 Docker。</p>

# 发布摘要

DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.12.1 中已修复的问题
在 DC/OS 1.12.1 中修复的问题按特性、作用区域或组件分组。大多数更改说明都包含一个或多个问题跟踪标识符便于称呼。

Admin Router
- COPS-4286、DCOS-46277 - 此版本修复了 `dcos-adminrouter` 组件中的某个问题，导致某些虚拟机配置无法正常启动。

 例如，如果您以前使用的服务器名称超出了允许的最大大小，`dcos-adminrouter` 组件就可能无法启动服务器。在此版本中，`packages/adminrouter/extra/src/nginx.master.conf` 文件已更新，支持 64 字符的服务器名称散列 bucket 大小。

## Docker 集成
- COPS-4012、DCOS_OSS-4415 - 默认分配给容器沙盒路径的权限已从 0755 更改为 0750，旨在提供更好的安全性和访问控制。但是，这项更改可能会阻止 Docker 容器镜像中任务的读取操作。如果 Docker 镜像指定的用户与任务用户标识符（UID）或框架用户 UID 指定的用户不一致，则用户没有足够的权限来运行任务。

 要解决这个问题，您可以更新容器以使用通用容器运行时（UCR），删除用户并重建 Docker 镜像，并通过设置参数密钥值对来删除或修改应用程序用户以在根帐户下运行：

```
"parameters": [
    {
    "key": "user",
    "value": "root"
    }
]
```

- COPS-4044、DCOS_OSS-4469 - 这一版本更改了 `dcos-docker-gc` 单元的日志记录设置，以便将其创建的任何日志消息都保留在主机系统上的 `systemd` 日志记录工具中。
- COPS-4087 - 对于使用具有虚拟 IP 地址的 Docker 容器的应用程序，后端端口映射使用 `host_IP:port_number` 而不是 `container_ip:port_number` 来解析对应用程序的访问。

## GUI
- COPS-3968、DCOS-43897 - 使用 Firefox 作为 Web 浏览器时，可在 DC/OS UI 中正确呈现服务标签和环境变量。

## Marathon
- COPS-3554 - 这一版本引入了一个监视器循环程序用于进行监控，并在必要时重新注册重新选举的 Marathon 首要节点。

- COPS-3593、DCOS_OSS-4193 - 在之前版本中，如果容器崩溃或在某些 DNS 处于故障条件下，Marathon 管理的某些服务可能无法重新启动。例如，如果第一个 Zookeeper 节点或第一个 DC/OS 管理节点无法访问，则重新启动服务可能会失败。

 这个问题影响 Marathon 的高可用性，因此 DC/OS 1.11.5 和 1.11.6 引入了一种解决方案（ping zk-1）来解决此问题。在本版本中，基本问题得到解决，如果您已部署，则可以安全地移除该解决方案。有关问题的背景信息以及移除解决方案的步骤，请参阅 [如果第一个 DC/OS 不可用，则删除 Marathon 无法启动的补丁](https://mesosphere-community.force.com/s/article/Critical-Issue-Marathon-MSPH-2018-0004)。

- COPS-3907、DCOS-44502、DCOS-46093 - 您可以使用配置文件或通过修改 DC/OS 基于 Web 的 UI 中的设置，为 Marathon-LB 和 Marathon 应用定义添加和编辑环境变量。

- Marathon-8413 - 调用 `Instant.now()` 函数时，Java9 中应用程序和 pod 的版本控制信息会包括一个按纳秒计算的时间戳。之前，纳秒未包含在为应用程序和 pod 检索的版本信息格式中。

## Mesos
- COPS-3868、DCOS_OSS-4607 - 新的 heartbeat 操作定期验证代理与任务执行器之间是否成功通信。当代理到执行器的连接长时间处于空闲状态时，heartbeat 操作有助于防止任何网络中介干扰代理和执行器的通信。

- DCOS-34558、DCOS-43597、DCOS-43598、DCOS-45951 - 如果身份认证凭证无效，Mesos 代理节点就会尝试刷新身份认证令牌。如果身份认证失败，代理就会回复 HTTP 401 状态代码错误。如果身份认证令牌无效（例如，由于令牌已过期），代理将自动尝试通过重新调用服务帐户登录步骤来获取新的身份认证令牌。如果更新失败或无有效身份认证令牌，则代理可能会停止操作，直到有效的身份认证令牌可用为止。

- DCOS-42690 - 您可以在创建磁盘时指定可选的新 `profile` 参数。`profile` 参数使框架能够指定在 `CREATE_DISK` 操作期间期望的卷特征。存储本地资源提供程序（SLRP）使用 `ValidateVolumeCapabilities` RPC 调用，查看 `profile` 是否适用于卷，从而利用相应的 CSI 插件验证卷。

- DCOS-43044 - 通常，期望框架在接受 offer 之前记录代理标识符和资源提供程序标识符。为了帮助确保框架在接受 offer（OfferOperation）之前记录代理标识符和资源提供程序标识符，已将代理标识符和资源提供程序添加到调度程序接收的 `OperationStatus` 消息中。然后，即使无法访问先前检查点的信息，该框架也可以对更新发出适当的确认。

- DCOS-43544 - 默认情况下，逻辑更改使嵌套容器能够在与其父容器关联的用户相同的用户帐户下运行。对于 pod 中的嵌套容器，默认执行程序的用户（即运行顶层容器的用户）是框架用户。在框架用户是普通用户但嵌套容器用户为 `root` 的情况下，此版本中的更改使第二级嵌套容器能够作为同一用户运行（例如，`root` 用户），默认作为父级顶层容器而不是框架用户。

- DCOS-43593 - 此版本修复了一个可能导致 Mesos 主端点（例如 reserveResources 或 createVolume）在身份认证期间失效的问题。例如，在实施这一修复之前，如果 IAM 服务存在极端负载，则端点的身份认证请求可能会失败或不完整。该版本中的更改在继续操作之前，确保端点的身份认证请求是完整的。

- DCOS-43670、DCOS-44827 - `cgroups` 事件侦听程序代码用于轮询容器的事件。更新此代码可确保侦听程序在读取操作完成后关闭文件描述符。修复可防止可能使容器处于 ISOLATING（隔离）或 PROVISIONING（配置）状态的竞争条件。

- DCOS-46006 - 此版本在 `Resource.DiskInfo.Source` 中提供一个可选的 `vendor` 字段。该字段允许框架利用卷标识符来关联恢复期间丢失的任何持久卷。由于卷标识符只有在容器存储接口（CSI）插件实例（类型+名称）中是唯一的，`vendor` 字段能够确保框架还获取有关 CSI 插件实例的标识信息。

## 度量标准
- COPS-3279、COPS-3576、DCOS-37703、DCOS-37703、DCOS-39703 - 此版本更正了在启用 `statsd` 度量标准输入插件时返回的服务端点值和基于服务地址的统计信息。

- DCOS_OSS-4181 - Telegraf 度量标准插件会把执行器容器的信息和任务的度量标准分开缓存。执行器容器的度量标准是使用相关任务的父容器标识符进行检索的。在此更新之后，您可以从缓存信息检索结果中收集执行器容器和任务的度量标准，而不会就无法在缓存中检索的信息生成重复请求或错误。

- DCOS_OSS-4521 - 对度量标准配置文件的更改（`dcos-config.yaml`） 可确保安装 DC/OS 文件时默认启用覆盖网络度量标准。

- DCOS_OSS-4544 - Telegraf 度量标准插件的新配置设置允许您指定唯一的 `User-Agent` 值。通过使用 Telegraf 度量标准插件的此设置，您可以定义该度量标准插件所有传出请求中包含的  `User-Agent`  标题。例如，您可以指定用户代理将容器度量标准作为 `telegraf-dcos-containers` 进行收集。

    ```
    ## HTTP User-Agent
    # user_agent = "telegraf"
    ```

- DCOS-42214 - 您可以通过在 `/var/lib/dcos/telegraf/telegraf.d/` 目录中添加或修改配置文件来自定义 telegraf 度量标准。启动 Telegraf 进程时，Telegraf 输入和输出插件会自动加载此目录中的文件。

- DCOS-43591 - 您可以向度量标准配置文件添加标签，以定义“白名单”，以便根据您指定的元数据对度量标准进行分组。例如，通过添加 `DCOS_SERVICE_NAME` 标签，可以对特定调度程序的度量标准进行分组。

- DCOS-44041、DCOS-45416 - DC/OS 文档包括有关 Telegraf 插件架构、可用输入插件以及插件收集的度量标准的更多详细信息。

## 网络
- COPS-3585 - 在以前的版本中，死锁或竞争条件可能会阻止群集中的一个或多个节点生成路由表，该路由表通过 Marathon 负载均衡适当转发网络流量。路由表和网络连接问题可能导致以下问题：
 - 某些节点上的网络覆盖配置不完整。
 - 某些节点上的 VIP/IPVS/L4LB 配置不完整。
 - 某些节点上缺少 DNS 记录。

 您可以在受影响的节点上重新启动 `systemd` 进程以恢复正常的网络连接。此修复程序与缓解由 Erlang 库（DC/OS 1.12）中的安全套接字层（SSL）死锁引起的网络问题有关。

- COPS-3924、DCOS_OSS-1954 - 分布式第 4 层负载均衡器（`dcos-l4lb`）网络组件会等待路由流量，直到应用程序向上扩展操作完成或应用程序运行状况检查已通过为止。如果要缩小应用程序实例的数量，`dcos-l4lb` 进程不会阻止路由流量。只有在确定应用程序的状态运行状况不佳或未知时，才会暂停网络流量。

- COPS-4034、DCOS_OSS-4398 - 此版本阻止 `dcos-net` 在具有绑定接口的裸机服务器上不断重新启动 `systemd-networkd`。

- COPS-4078、DCOS_OSS-4395 - 可以使用单个端口来发现主机网络上的 UDP 和 TCP 端口。以前，如果 UDP 和 TCP 发现使用相同的端口号，则 `dcos-net` 网络进程会将来自两个协议的 UDP 和 TCP 流量合并到同一个端口。通过此版本，您只需使用一个端口即可关联与主机网络上运行的任务相关的基于 TCP 和 UDP 的连接。

- COPS-4099、DCOS-45161 - 此版本修复了 DNS 转发器中的一个问题：如果设置了两个以上的 DNS 上游服务器，则会导致 `dcos-net` 进程记录错误或应用程序崩溃消息。

- COPS-4124、DCOS-46132 - 新的代理选项 `--network_cni_root_dir_persist` 允许容器节点根目录将网络信息存储在一个永久位置。使用此选项可以指定容器 `work_dir` 根目录，该目录可以持久保留网络相关信息。通过持久保留该信息，容器网络接口（CNI）隔离器代码可以在重新启动后执行适当的清理操作。如果重新启动节点不会从 `etcd` 删除旧容器和 IP/MAC 地址（久而久之导致资源池耗尽），则应使用 `--network_cni_root_dir_persist` 选项。 

- DCOS-45196 - 可以通过 `config.yaml` 文件设置 `push_ops_timeout` 配置选项。

[enterprise]
## 安全
[/enterprise]
- DCOS-21998、DCOS-44367 - 您可以使用基于 RSA 的自定义 CA 证书安装 DC/OS 群集节点，该证书使用弹性云（EC）签名。以前，使用基于 EC 的可信私钥签名的自定义 CA 证书会生成传输安全层（TLS）安全警报。

## 升级
- 如果已安装可选的 DC/OS 存储服务包，则从 1.12.0 升级到 1.12.1 要求您首先按照 [手动将 DSS 软件包从 0.4.x 升级到 0.5.x](/services/beta-storage/0.5.2-beta/upgrades/) 中提供的说明进行操作。在升级 DC/OS 存储 **之前**，必须将群集节点升级到 1.12.1，以防在升级后发生 Mesos 代理节点崩溃。

# 已知问题和限制
本部分介绍了不一定影响所有客户，但可能需要更改环境以解决特定情况的所有已知问题或限制。这些问题按特性、作用区域或组件分组。适用时，问题说明会包括一个或多个问题跟踪标识符。

### Marathon 插件依赖关系
如果您有自定义 Marathon 插件或已向群集添加任何依靠 Marathon 的自定义，则可能需要在升级到此版本后更新插件或自定义组件。例如，如果您有一个依赖于使用 Scala 2.11 编译的 Scala Logging 3.1.0 版的插件，则需要将 Scala Logging 包升级到使用 Scala 2.12 编译的 3.7.2 版，以兼容该版本 DC/OS 所含的 Marathon 包中使用的日志记录库。

### 收集度量标准的服务帐户权限
DC/OS（1.12 版及更新版本）中的度量标准基于 Telegraf。Telegraf 提供基于代理的服务，在 DC/OS 群集中的每个管理节点和代理节点上运行。默认情况下，Telegraf 从同一节点上运行的所有进程收集度量标准，收集的信息经过处理之后被发送到中央度量标准数据库。Telegraf 程序在服务帐户 `dcos_telegraf_master` 和 `dcos_telegraf_agent` 下运行。必须授予这两个服务帐户 `dcos::superuser permissions`。

# 关于 DC/OS 1.12 

DC/OS 1.12 包括许多新特性和功能。主要特性和增强功能集中在：
- Mesosphere Kubernetes 引擎
- Mesosphere Jupyter 服务
- 观察性和度量标准
- 专用包注册表
- 安装和升级改进
- LDAP 和网络连接增强功能

## 新功能
本节概述了 DC/OS 1.12 中引入的新功能。

### Mesosphere Kubernetes 引擎
- 高密度多 Kubernetes (HDMK) 使操作者能够在 DC/OS 上运行多个 Kubernetes 群集时充分利用智能资源池。与每个虚拟机运行单个 Kubernetes 节点的其他 Kubernetes 发行版相比，Mesosphere HDMK 使用其智能资源池将多个 Kubernetes 节点打包到连接裸机、虚拟机和公共云实例的同一服务器上，从而显著节省成本并提高资源利用效率。[详细了解 DC/OS 上的 Kubernetes](/services/kubernetes/2.0.0-1.12.1/)。

### Mesosphere Jupyter 服务 (MJS)
- 提供安全的 [云原生 Jupyter](https://docs.mesosphere.com/services/beta-jupyter/)笔记本即服务，使数据科学家能够在弹性 GPU 池上执行分析和分布式机器学习，并可访问大型快速数据服务。
- 安全连接到 S3 和（Kerberose 授权的）HDFS 上的数据湖和数据集。
- 支持 GPU 的 Spark 和分布式 TensorFlow。
- OpenID Connect 身份认证和授权，支持 Windows 集成身份认证（WIA）和活动目录联合服务（ADFS）。

### 观察性和度量标准
- 引入了具有多种输出格式的灵活且可配置的度量标准管线
- 增强对应用程序度量标准类型（包括直方图、计数器、计时器和计量器）的支持。
- 支持提高采样率和多度量标准数据包。
- Mesos 框架度量标准现在 [可用](http://mesos.apache.org/documentation/latest/monitoring/#frameworks)。
- 在 1.11 中通过 Prometheus 终点收集度量标准时，不再需要修改。

[enterprise]
### 专用包注册表
[/enterprise]
- 已启用 [本地包分发和管理](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/)。
- 已启用气隙式虚拟专用云包管理。
- 简化包工件管理。
- 用于在群集中添加/删除/更新包的特定于包的控件。
- 包管理 CLI。

### 安装和升级
- 完全支持在 SELinux 强化操作系统上安装和操作集群，SE Linux 采用目标执行模式，适用于所有经过强化的非 DC/OS组件。
- 引入一种统一的基于 Terraform 的开源工具，用于在 AWS、GCP 和 Azure 上配置、部署、安装、升级和停用 DC/OS。
- 通过快速启动过程实现直观简化的安装，只需 10-15 分钟即可通过几个简单的步骤启动 DC/OS 群集。
- 正式推荐为 Mesosphere 支持的安装方法，内置最佳实践（即持续升级的顺序管理节点和并行代理节点）。
- 重组 [Mesosphere 安装文档](https://docs.mesosphere.com/1.12/installing/evaluation/)，整理 Mesosphere 支持的安装方法和社区支持的安装方法。
- 扩展后的 DC/OS 升级路径使 Mesosphere 能够在支持的 DC/OS 补丁版本中的跨越升级特定的 [升级路径](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths)（即一次完成从 1.11.1 => 1.11.5 的升级）并跨越升级支持的  DC/OS 主要版本之间的升级路径（例如，让您能够一次完成从 1.11.7 到 1.12.1 的升级）。

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
