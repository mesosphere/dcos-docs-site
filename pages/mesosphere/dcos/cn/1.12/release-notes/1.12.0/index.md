---
layout: layout.pug
navigationTitle: 1.12.0 版本注释
title: 1.12.0 版本注释 
menuWeight: 20
excerpt: DC/OS 1.12.0 版本注释
---

DC/OS 1.12.0 于 2018 年 10 月 25 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.12.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="https://support.mesosphere.com/hc/en-us/articles/213198586"]Download DC/OS Enterprise* [/button]

<p class="message--warning"><strong>警告：</strong>注册 Enterprise 客户可以从 <a href="https://support.mesosphere.com/s/downloads">支持网站</a>访问 DC/OS Enterprise 配置文件。对于新客户，请在安装 DC/OS Enterprise 版本时联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。</p>

# 关于 DC/OS 1.12.0 

DC/OS 1.12.0 新增以下特性和功能：

## 新特性和功能

### Mesosphere Kubernetes 引擎
- 高密度多 Kubernetes (HDMK) 使操作者能够在 DC/OS 上运行多个 Kubernetes 群集时充分利用智能资源池。与每个虚拟机运行单个 Kubernetes 节点的其他 Kubernetes 发行版相比，Mesosphere HDMK 使用其智能资源池将多个 Kubernetes 节点打包到连接裸机、虚拟机和公共云实例的同一服务器上，从而显著节省成本并提高资源利用效率。[详细了解 DC/OS 上的 Kubernetes](/mesosphere/dcos/services/kubernetes/2.0.0-1.12.1/)。

### Mesosphere Jupyter 服务 (MJS)
- 提供安全的 [云原生 Jupyter](https://docs.mesosphere.com/services/beta-jupyter/)笔记本即服务，使数据科学家能够在弹性 GPU 池上执行分析和分布式机器学习，并可访问大型快速数据服务。
- 安全连接到 S3 和（Kerberose 授权的）HDFS 上的数据湖和数据集。
- 支持 GPU 的 Spark 和分布式 TensorFlow。
- OpenID Connect 身份认证和授权，支持 Windows 集成身份认证（WIA）和活动目录联合服务（ADFS）

### 观察性 - 度量标准
- 引入了具有多种输出格式的灵活且可配置的度量标准管线
- 增强对应用程序度量标准类型（包括直方图、计数器、计时器和计量器）的支持。
- 支持提高采样率和多度量标准数据包。
- Mesos 框架度量标准现在 [可用](http://mesos.apache.org/documentation/latest/monitoring/#frameworks)。
- 在 1.11 中通过 Prometheus 端点收集度量标准时，不再需要修改。

[enterprise]
### 专用包注册表
[/enterprise]
- 已启用 [本地包分发和管理](https://docs.mesosphere.com/1.12/administering-clusters/repo/package-registry/)。
- 已启用气隙式虚拟专用云包管理。
- 简化包工件管理。
- 用于在群集中添加/删除/更新包的特定于包的控件。
- 包管理 CLI。

### SELinux 强化操作系统安装支持
- 完全支持在 SELinux 强化操作系统上安装和操作集群，SE Linux 采用目标执行模式，适用于所有经过强化的非 DC/OS组件。

[enterprise]
### 匿名 LDAP 绑定支持
[/enterprise]
- 符合标准化企业 LDAP 集成模式，无需专用的 DC/OS 集成 LDAP 用户。

[enterprise]
### 动态 LDAP 同步
[/enterprise]
- 自动同步 [LDAP 用户帐户组](https://docs.mesosphere.com/1.12/security/ent/users-groups/)，而无需使用导入 DC/OS 的帐户手动同步 [LDAP 目录](https://docs.mesosphere.com/1.12/security/ent/ldap/)。

### 通用安装程序 
- 引入一种统一的基于 Terraform 的开源工具，用于在 AWS、GCP 和 Azure 上配置、部署、安装、升级和停用 DC/OS。
- 通过快速启动过程实现直观简化的安装，只需 10-15 分钟即可通过几个简单的步骤启动 DC/OS 群集。
- 正式推荐为 Mesosphere 支持的安装方法，内置最佳实践（即持续升级的顺序管理节点和并行代理节点）。
- 重组 [Mesosphere 安装文档](https://docs.mesosphere.com/1.12/installing/evaluation/)，整理 Mesosphere 支持的安装方法和社区支持的安装方法。

# 网络
- 网络组件增强功能，有 150 多个错误修复，具有受限的可见性记录。
- 改进了 DNS  聚合时间（亚秒）性能。
- 可覆盖网络的可配置 MTU。
- 群集中新代理可重用 IP 地址。
- 避免 Erlang 库中因 SSL 锁死造成的网络停滞状态。
- TLS 1.2 支持。
- 按容器提供网络度量标准支持。
- 利用 Edge-LB 中的持久连接进行 L7 负载均衡。[enterprise type="inline" size="small" /]
- 改进了 Edge-LB 的日志记录。[enterprise type="inline" size="small" /]

### 扩展了 DC/OS 升级路径 
- Mesosphere 现在能够在支持的 DC/OS 补丁版本中执行跨越多级的 [升级路径](https://docs.mesosphere.com/1.12/installing/production/upgrading/#supported-upgrade-paths) 的特定操作（即一次完成从 1.11.1 => 1.11.5 的升级）。
- Mesosphere 现在支持执行 DC/OS 支持的主要版本之间的多级跨越升级路径的特定操作（即一次完成从 1.10.7 => 1.11.4 的升级）。

### 服务（Marathon）增强功能
- [优先GPU调度](http://mesosphere.github.io/marathon/docs/preferential-gpu-scheduling.html)增强了其他选项，以实现更加细分的资源管理。
- 为 `--max_running_deployments` 引入新参数以设置运行部署的限制。
- 添加了对 pod 实例端点的 `wipe=true` 支持。
- 从 `/var/lib/mesosphere/marathon/environment` 轻松配置 Marathon 配置选项。
- 升级 Marathon 至 1.7.174 版本。

### 作业调度 (Metronome)
- `Env-var` 密钥现在可以附加到作业中了。

### UI/UX 增强功能
- 在节点页面中添加了主表和运行状况信息。
- 在 UI 上方添加 Mesosphere DC/OS 标志。
- 如果部署在群集中，则加入扩展的 JSON 编辑器视图和 GPU。
- 执行了 100 多项缺陷修复和性能改进。
- 服务页面中包含基本技术版本。
- 节点页面中包含节点类型（公共/专用）。
- 从“节点”页面删除 CPU/MEM/Disk 图形。

## 显著变化
- 将 DC/OS UI 更新为 1.12+v2.25.1 [变更记录](https://github.com/dcos/dcos-ui/releases/tag/1.12+v2.25.1)。
- DCOS-19427 - CockroachDB：将群集版本设置为 1.1。[enterprise type="inline" size="small" /]
- DCOS-19922 - 删除禁用安全模式。[enterprise type="inline" size="small" /]
- DCOS-22308 - CockroachDB：使用 1.1.8。[enterprise type="inline" size="small" /]
- DCOS-37654 - 添加 `permissions_cache_ttl_seconds` 配置参数。[enterprise type="inline" size="small" /]
- DCOS-38663 - 默认启用 DC/OS 存储功能。[enterprise type="inline" size="small" /]
- DCOS_OSS-2338 - 将 Metronome 更新到 0.5.0。
- DCOS_OSS-2378 - 将 OTP 版本更新到 20.3.2。
- DCOS_OSS-3597 - 将 REX-Ray 版本更新到 [0.11.2](https://github.com/rexray/rexray/releases/tag/v0.11.2)。
- 从 DC/OS 1.12、1.11、1.10 安装文档中删除本地、开发、内部部分以及相应的 DCOS-Docker/DCOS-Vagrant 安装方法。

<p class="message--warning"><strong>警告：</strong>带有 `.json` 后缀的 Mesos 端点（例如 /mesos/state.json）在 DC/OS 1.12 中已弃用，将从 DC/OS 1.13 中删除。</p>

## 完成的改进和重大问题修复 

### CLI 
- DCOS_OSS-1899 - 启用基于 Windows 的 PKGPANDA 构建。
- DCOS_OSS-2239 - 并行执行节点和群集检查。
- DCOS_OSS-3491  - 用 `dcos-check-runner` 替换 `dcos-diagnostics` 检查运行程序。
- DCOS_OSS-3683 - 修复之后为代理和公共代理再添加一个 EBS 驱动器。

### GUI
- COPS-2041 - DC/OS UI 擦除带有空值的标签。
- COPS-2661/DCOS-21440 - 修复以识别 `VIP_0` 标签。
- DCOS-20283 - 修复 SOAK 111 上的网络度量标准故障。
- DCOS-21723 - 包括已分配和调度的资源。
- DCOS_OSS-1551 - 在主机模式下显示以启用 VIP 字段。
- DCOS_OSS-1553 - 向虚拟网络添加 VIP 输入。
- DCOS_OSS-1961 - DC/OS UI 不支持 POD 的生命周期。

### 安装 
- DCOS_OSS-2389 - 升级未能更新代理的 IP 检测脚本。
- DCOS_OSS-3549 - 为 DCOS-Docker 修复了 ftype=1 检查。
- DCOS_OSS-3556 - 改进了根 Marathon 支持标志和 JVM 设置的安装后配置。
- DCOS_OSS-3804 - 解决将 dcos-check-poststart 结果记录到日志的问题。

### Marathon
- DCOS-18597 - Marathon Enterprise DCOS 打包需求修订。[enterprise type="inline" size="small" /]
- DCOS-39883 - 添加权限到 `dcos_diagnostics_master`，以读取 Marathon 状态。[enterprise type="inline" size="small" /]
- DCOS-42827 - Marathon `--ssl_keystore_password` 值不再显示在 `ps aux` 中。
- DCOS_OSS-4193 - Marathon bootstrap 依赖于可用的 ZK-1.ZK 节点。
- MARATHON-7390  - 为 Marathon 启动添加所需的先决条件，并将 Marathon 连接到 Zookeeper。
- MARATHON-7969  - 修复了在通过 PUT 创建新应用程序时填充默认值 `portDefinitions` 的问题。
- Marathon-8420 - Marathon 框架 ID 生成现在非常保守。[enterprise type="inline" size="small" /]
- Marathon-8360 - 通过创建中级组来修复无法拒绝无效组 ID 的问题。
- Marathon-8438 - 使用 docker 镜像默认用户更改默认 Mesos 用户。

### Mesos 
- COPS-1880 - 允许代理在主机重新启动后重新注册。
- COPS-1993 - 检查代理维护是否会导致致命错误。
- COPS-3574 - 将 MESOS 提升至夜间 1.5.x DD68C0B。
- DCOS-24515 - 无响应的 Mesos 容器化工具。
- DCOS-38225 - Mesos-IAM 交互失败的意外错误处理导致任务丢失。
- DCOS-39869 - Mesos UI 缺失的 Mesos 管理节点日志。
- DCOS-40410/DCOS-40750 - 将 Mesos 提升至夜间管理节点 6a98857。
- DCOS-41442 - 更新 `MesosContainerizer::create` 签名。
- DCOS-42098 - Admin Router 指示下游组件（例如负载均衡器）在提供请求后关闭 Mesos 流端点的连接。[enterprise type="inline" size="small" /]
- DCOS_OSS-2137 - 默认揭示 Jemalloc 内存分析器。
- DCOS_OSS-4152 - 修复了试图删除按度量标准隔离器模块检查容器的错误。

### 度量标准
- DCOS_OSS-2368 - DC/OS 度量标准：将 Prometheus 生产者从端口 9273 移至端口 61091。

# 网络 
- COPS-3520 - 无法构建 `dcos-cni` 包。
- COPS-3540/DCOS-39517 - 修复叠加配置的延迟。
- COPS-3576/DCOS-37703 - 修复服务地址统计信息中的错误值并启用度量标准转发。
- DCOS-38600 - SSL 套接字同时收发数据并且缓冲区已满时就会发生死锁。[enterprise type="inline" size="small" /]
- DCOS-39165 - 修复无法在覆盖网络上创建 VIP 的问题。
- DCOS_OSS-1406 - 在所有群集节点上添加 /system/check/ 检查用的 API。[enterprise type="inline" size="small" /]
- DCOS_OSS-1566 - DC/OS 网络：使用操作者 HTTP API。
- DCOS_OSS-1751 - DC/OS 网络：禁用 `epmd`。
- DCOS_OSS-2073 - DC/OS 网络：支持 Mesos Windows 代理。
- DCOS_OSS-3539 - 修复运行任务以获取 .dcos fqdns。
- DCOS_OSS-3655 - 升级 OTP 版本。
- DCOS_OSS-3697 - 修复桥接网络与覆盖网络之间的连接问题。
- DCOS_OSS-3707 - 修复因更新到 Coreos v1800.7 而造成的网络故障。
- DCOS_OSS-3750 - 将数据目录移至 `tmpfs` 位置，并在代理重启时回收分配的 IP 地址。
- DCOS_OSS-3841 - 更新 CNI 插件至 v0.7.1。
- DCOS_OSS-3929 - DC/OS 网络：记录改进。
- DCOS_OSS-4308 - 突出了 dcos-net。

### 平台
- DCOS-21611 - 修复在配置升级期间无法更新群集的 IP 检测脚本和故障域检测脚本的问题。[enterprise type="inline" size="small" /]
- DCOS-40373 - 防止 `dcos-history` 标题中泄漏身份认证令牌。
- DCOS-40949 - 将 CockroachDB 端点数据添加到诊断捆绑包。[enterprise type="inline" size="small" /]
- DCOS-42419 - 通过支持 v2 架构 1 为程序包注册表添加 UCR 支持。
- DCOS-43822 - 添加升级限定条件表以显示升级路径。
- DCOS_OSS-2317 - 下载包时添加 pkgpanda 的重试次数。
- DCOS_OSS-2422 - 修复以避免管理节点发生 `test_history_service` 故障。
- DCOS_OSS-3861 - 获取诊断包中的 dmesg、timedatectl、发行版本、systemd 单元状态和 pod 端点的时间戳。
- DCOS_OSS_3961 - 将 MountInfo 添加到诊断捆绑包。
- DCOS_OSS-4040 - 允许配置 DCOS 诊断捆绑位置。
- DCOS_OSS-4287 - 在启动 Exhibitor 之前检查系统时钟是否已同步。

[enterprise]
### 安全
[/enterprise]
- 突出  CVE-2017-11427 的 `python3-saml`。
- COPS-2142 - 修复查找 DN 不再适用于 1.10.x 的问题。
- DCOS-19073 - 防止 ZooKeeper 配置凭据在访问 mesos/state 或 /flags 端点以及 journald 日志时泄露。
- DCOS-20133 - 修复 bootstrap 为任务执行器身份认证生成空密钥的问题。
- DCOS-21728 - 为 Cockroachdb `underreplicated ranges` 添加 `dcos-check`。
- DCOS-21947 - DC/OS IAM 从不在任何日志级别记录 LDAP 服务器密码或私钥。
- DCOS-21958 - 为主 Admin Router 的 TLS 禁用 3DES 批量加密算法。
- DCOS-22050 - TLS：Admin Router 可以同时配置 RSA 和 EC 类型证书。
- DCOS-22326 - 为主管理员路由器的 TLS 禁用 TLS 1.1 协议。
- DCOS-37684 - 添加 `iam-database-backup` 和 `iam-database-restore` 脚本以简化 IAM 数据库备份/恢复。
- DCOS-38953 - 支持在 RHEL/CentOS 处于执行目标模式时在 Selinux 上运行 DC/OS。
- DCOS-40246 - DC/OS 网络：仅支持 TLS 1.2。
- DCOS-40648 - 添加 `LDAP_GROUP_IMPORT_LIMIT_SECONDS` 默认值到 DC/OS 配置。
- DCOS-42227 - DC/OS IAM: 如果用户 DN 模板和目录中的条目使用不同的属性名称大小写，则进行合并 LDAP 组导入。
- DCOS_OSS-2283 - 添加 DC/OS API 端点以区分 `open` 和 `enterprise` 构建变体。[enterprise type="inline" size="small" /]
- DCOS_OSS-4129 - 更改管理员路由器访问日志格式，以便进行调试和性能分析。

### SDK
- DCOS_OSS-2195 - 发布 cosmos v0.6.0。

## 突破性变更
- DCOS_OSS-2256 - 删除 DC/OS web 安装程序。
- DCOS_OSS-3714 - 已将 `dcos-metrics` 替换为 Telegraf。
- DCOS_OSS-4243 - Marathon 将默认拒绝 [维护模式](https://github.com/mesosphere/marathon/blob/master/changelog.md#maintenance-mode-support-production-ready-now-default) 中的代理 offer。向 Marathon 事件 API (当直接查询时为/v2/事件) 请求备用实例时，得出的响应不再是代理，而是重定向。应当更新使用 Marathon 事件 API 的客户端，以遵循重定向。上述跟随重定向进行更新的组件；例如，Marathon-LB 至少应更新到版本 v1.12.3。[查看更多详情](https://github.com/mesosphere/marathon/blob/master/changelog.md#non-leaderstandby-marathon-instances-respond-to-v2events-with-a-redirect-rather-than-proxy)。

## 客户咨询 
- [对于 DC/OS 1.12 的 Kubernetes 支持的要求](https://support.mesosphere.com/s/article/Critical-Issue-Kubernetes-Upgrade-MSPH-2018-0007)。
- [推荐将 Red Hat Docker 1.13 作为 DC/OS 的 CentOS & RHEL 支持](https://support.mesosphere.com/s/article/Critical-Issue-KMEM-MSPH-2018-0006)。
- 更新组件以支持 Marathon [新事件流重定向](https://support.mesosphere.com/s/article/Update-Components-to-Support-Marathon-s-New-Event-Stream-Redirects-MSPH-2018-0008)。
- [`dcos-net` 忽略了主机网络上任务的某些 TCP/UDP 发现端口](https://support.mesosphere.com/s/article/Known-Issue-DC-OS-Networking-MSPH-2018-0008)。

## 已知问题和限制

### GUI
- DCOS-39298 - 编辑作业：使 ID 字段不可编辑。

### Marathon 
- Marathon-8429 - Marathon 应用程序由于代理或 Docker 问题而未完全销毁。必须首先解决代理/Docker 问题，才能扩展应用程序。
- Marathon-8441 - 管理节点上的 Docker 镜像测试失败。

### 度量标准
- DCOS-43601 - 服务帐户 `dcos_telegraf_master` 和 `dcos_telegraf_agent` 需要 dcos:: 超级用户权限。

# 网络
- COPS-3690/DCOS-40539 - 即使 `enable_ipv6` 设置为 false，也会在 UI 中显示 `dcos6` 界面。
- COPS-3900 - 使用 MLB 登录 docker 时出现连接超时错误。
- COPS-3901 - EdgeLB 在 apiserver 日志中频繁创建 sidecar `SIGSEV`。
- COPS-3924/DCOS-43552 - 扩展应用程序时，VIP 返回 502 错误。
- DCOS_OSS-4184 - Mesos 提供已在使用的端口。
- DCOS_OSS-4328 - Lashup 有时无法聚合。
- DCOS-10809 - DNS 在 DC/OS 升级期间不可用。
- DCOS-43857 - RHEL 7.5 上的 1.12.0-rc3 和 1.11.6 `test_dcos_cni_l4lb` 失败。
- COPS-4078/DCOS_OSS-4395 - `dcos-net` 忽略了主机网络上任务的某些 TCP/UDP 发现端口。

[enterprise]
### 安全
[/enterprise]
- DCOS-9929 - 缺少密钥访问权限可能会阻止执行部署。
- DCOS-42160 - CockroachDB 错误导致大组用户导入失败。
- DCOS-43432 - 集群升级到 1.12-rc2 后，LDAP 测试无法同步。
- DCOS-43585 - MWT - 间歇性网关超时 API 请求（放置 ACL）。
- DCOS-43598/DCOS-43596 - Mesos 授权者：适当路径事后身份认证令牌刷新显示错误。

### Mesos
- DCOS-40878 - 添加事件流订阅者之后未删除。
- DCOS-41729 - 永久故障将终止代理上的任务。
- DCOS-42624 - 主 Admin Router 返回 `/service/jenkins` 上的错误。
- DCOS-43044 - 发送到框架的 `OperationStatus` 消息必须包括代理 ID 和资源提供者 ID。
- DCOS-43518 - 改进 Mesos API 以区分运行状况检查状态。
- DCOS-43670 - UCR 容器启动在镜像提取期间发生配置停滞。

### SDK
- DCOS-41362 - 管理节点未能处理资源的取消预留操作。
- DCOS-42593 - 选项更新期间出现 `STORAGE_ERROR`。

<p class="message--note"><strong>注意：</strong>在 <a href="https://support.mesosphere.com">support.mesosphere.com</a> 提供有关新特性和服务的反馈。</p>


