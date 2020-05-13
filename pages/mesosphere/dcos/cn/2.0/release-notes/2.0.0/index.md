---
layout: layout.pug
navigationTitle: 2.0.0 的发行说明
title: 2.0.0 的发行说明
menuWeight: 5
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: DC/OS 2.0.0 版本的注释，包括开源归属和版本策略。
---
Mesosphere&reg; DC/OS&trade; 2.0.0 于 2019 年 10 月 25 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.0/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.0/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 <a href="https://support.mesosphere.com/s/downloads">[支持网站]</a> 访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@d2iq.com">sales@d2iq.com</a>。


# 发布摘要
Mesosphere&reg; DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

本发布版提供了新的功能和改进以改善用户体验，修复报告的问题，整合之前版本的变更，并保持对其他包的兼容性和支持，例如，在 DC/OS 中使用的 Marathon&trade; 和 Metronome。

如果在生产环境中部署了 DC/OS，则请查看 [已知问题和限制](#known-issues-and-limitations)，以了解特定场景的任何潜在运行变更是否适用您的环境。

- 将 DC/OS UI 更新到 master+v2.150.2。
- 更新至 Apache&reg; Mesos&reg; 1.9。(DCOS_OSS-5342)
- 将 Marathon 更新到 1.9.100。Marathon 1.9 带来多角色支持，使您可以使用同一 Marathon 实例启动针对不同角色（针对不同的 Mesos 配额）的服务。
- 更新至 Metronome 0.6.33，具有以下优势：当使用 embed=history 查询运行详细信息时，`successfulFinishedRuns` 和 `failedFinishedRuns` 包含新的现场任务，该任务是完成运行的 taskId 数组。这将使人们甚至可以查询已完成作业运行的任务 ID。(DCOS_OSS-5166)


# 新特性和功能 

## 多租户支持

通过为服务组添加配额管理，DC/OS 改进了多租户支持。具体来说，DC/OS 可以通过 UI 和 CLI 管理基于 Marathon 和 SDK 的服务的配额限制。有关详细信息，请参阅 [配额管理](/mesosphere/dcos/2.0/multi-tenancy/quota-management/#quotas)。(DCOS-54186) 

## 节点排空可实现从容维护

DC/OS 增加了使用 DC/OS CLI 和 UI 排空代理节点的功能。有关更多详细信息，请参阅 [排空节点](/mesosphere/dcos/2.0/administering-clusters/draining-a-node/)。(DCOS-53654)

## 对需要可配置共享内存的应用程序的 UCR 支持

由于 pod 中的任务在同一个代理上运行，因此可以为任务定义共享内存段。DC/OS 支持 UCR 中可配置的 `/dev/shm` 大小和 IPC 命名空间。有关更多详细信息，请参阅 [共享内存](/mesosphere/dcos/2.0/deploying-services/pods/technical-overview/#shared-memory)。(DCOS-54618) 

DC/OS 为 UCR 支持引入以下参数：

- `mesos_disallow_sharing_agent_ipc_namespace` 可用于控制顶级的 Mesos 容器是否允许共享 Mesos 代理节点主机的 IPC 命名空间和 `/dev/shm`。默认值为 `false`。(DCOS-56619)
- `mesos_default_container_shm_size` 可用于为 Mesos 容器指定默认大小的 `/dev/shm`，该容器具有自己的 `/dev/shm`。格式为 [number][unit]，其中 `number` 必须为正整数，`unit` 可以是 B（字节）、KB（千字节）、MB（兆字节）、GB（千兆字节）或 TB（兆兆字节）。(DCOS-56619)

## 新诊断命令

DC/OS 引入了新的诊断服务，增加了 CLI 命令 [`dcos diagnostics`](/mesosphere/dcos/2.0/cli/command-reference/dcos-diagnostics/) 套件。更多的 RESTful API 将生成诊断捆绑包，以解决 DC/OS 问题。这种分散型模型将在每个节点上生成本地捆绑包，然后合并所有本地捆绑包。这种变化大大减少生成诊断捆绑包所需的时间。(DCOS_OSS-5098)
- 创建新的诊断捆绑包 REST API，实现性能改进。
- 弃用传统路由，并创建更多 RESTful API 来生成诊断捆绑包。

## 其他改进

- DC/OS 具有一个新的容器调试端点，诊断捆绑包包括用于卡住任务的调试端点跟踪数据。(DCOS-55383)
- Metronome 安装后配置可添加到 `/var/lib/dcos/metronome/environment`。(DCOS_OSS-5309)
- 在 DC/OS Net 中添加 L4LB 度量标准。(DCOS_OSS-5011)
- 在此之前，Marathon 会验证具有相同名称的外部卷只在所有应用程序中使用一次。多个外部卷提供程序现在允许共享挂载卷的访问权限，因此我们引入了一种禁用唯一性检查的方法。(MARATHON-8681)
- 添加新的 DC/OS 配置参数 `mesos_docker_volume_chown`，以将 Docker&reg; 卷所有权更改为任务用户。默认情况下，此参数默认为 `false`；如果此参数设置为 `true`，在启动容器时，Mesos 将以非递归方式将 Docker 卷所有权更改为任务用户。如果有多个非根用户共享任何 Docker 卷，则不建议启用此选项。(COPS-5176, DCOS_OSS-5381, MESOS-9908)

# 已修复和改进的问题

- 更新 `dvdcli` 参考并修复 `dvdcli` 包构建。(DCOS-53581)
- 修复 Lashup 中的性能下降。截至目前，`dcos-dns` 使用新的 LWW 模式来传播 DNS 分区更新。(DCOS_OSS-4240)
- 优化 `dcos-net` 中内存和 CPU 使用率。(DCOS_OSS-5269, DCOS_OSS-5268)
- 从安装中删除 `nogroup` 组。(COPS-5220, DCOS-59427)
- 将 Admin Router 底层 OpenResty&reg;/nginx 从 1.13.x 升级到 1.15.x。(DCOS_OSS-5320)
- 在 `dcos-net` 中，在 Mesos 不稳定情况下使用缓存的 Mesos 状态。(DCOS_OSS-5463)
- 突出 Mesos 模块，以展示覆盖度量标准。(DCOS_OSS-5322)
- 改进 Marathon API 性能。JSON 序列化速度提高了 50%，内存开销减少了 50%。
- DC/OS 不再增加 `journald` 日志记录的速率限制，以减少 `journald` 过载和阻塞其他服务的情况。(DCOS-53763)
- 修复 Docker 1.19 安装前 Docker&reg; 版本检查失败的问题。(DCOS-56831)
- 突出 Telegraf&trade;，以收集 Mesos 覆盖模块度量标准。(DCOS_OSS-5323)
- 修复 `dcos_service_port_index` 中错误值，该错误值会破坏 Admin Router 缓存。(COPS-5147, DCOS_OSS-5491)
- 将框架 ID 标签添加到 Mesos 框架度量标准。(DCOS-53302)
- DC/OS 配置变量 `mesos_seccomp_enabled` 现在默认为 `true`，`mesos_seccomp_profile_name` 设置为 `default.json`。预计这不会破坏任务。但是，如果遇到问题，请注意，可以通过 DC/OS SDK 和 Marathon 为单个任务禁用 seccomp。有关更多详细信息，请参阅 [`mesos_seccomp_enabled`](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#mesos-seccomp-enabled) 和 [`mesos_seccomp_profile_name`](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#mesos-seccomp-profile-name)。(DCOS-50038)
- 很大的配额值可能会使 Mesos 管理节点崩溃。(DCOS-59695)
- 从任务的提取程序收到很长的错误消息后，Marathon 会陷入崩溃循环。(COPS-5365, MARATHON-8698)
- ACL 提供对任务的不当访问。(COPS-4929)
- 使用 L4-VIP 部署服务时，可能需要 10 分钟才能使用 VIP。(COPS-5081, DCOS_OSS-5356)
- `dcos-net` 日志显示管理节点上条目过多。(COPS-5229, DCOS-57506)



## 第三方更新和兼容性

- Telegraf 现在支持为基于 `task-label` 的 Prometheus 端点发现指定端口名称。(DCOS-55100) 
- 更新 Telegraf 以处理 Mesos 操作度量标准。(DCOS_OSS-5023, DCOS-51344) 
- 将 Erlang/OTP 升级到版本 22.0.3。(DCOS_OSS-5276)
- 将平台 CPython 升级到版本 3.6.8。(DCOS_OSS-5318)
- 将 CockroachDB&reg; 升级到版本 2.1.8。(DCOS_OSS-5360)
- 将平台 cURL&copy; 从 7.59.0 升级到 7.65.1。(DCOS_OSS-5319)
- 将平台 OpenSSL&copy; 从 1.0.2x 升级到版本 1.1.1x。(DCOS-54108)



<!-- - Updated to the latest version of cron-utils 9.0.0 and removed threeten-backport. This fixes a number of cron related issues in the underlying dependencies. Fixed a bug when task status was not updated after the task turned running (when querying embed=activeRuns). Fixes DCOS_OSS-5166 where metronome did not use the revive operation. -->

# 已知问题和限制
本节介绍任何已知问题或限制。这些不一定影响所有客户，但可能需要更改环境以应对特定情况。适用时，问题说明会在括号中包括一个或多个跟踪标识符，以供参考。

- `/v2/pods` 和 `/v2/tasks` 不包含有关现有实例的任何信息。(DCOS_OSS-5616)
- DC/OS Enterprise 版本中的 Mesos 模块可能会导致进程中的死锁。(DCOS-57401)
- Mesos 资源摘要仪表板应显示配额限制而不是担保。(DCOS-57261)
- Grafana&trade; 因文件权限错误而无法加载。(DCOS-59209)
- DC/OS 覆盖网络未按值进行比较，但应进行比较。仅使用 VTEP IP 地址和子网。在此问题修复之前，仅使用 VTEP IP 和子网，而不是命名的覆盖网络。(DCOS_OSS-5620)
- 重新激活排空节点时，不会重新安排 MKE。(DCOS-59788)


<!-- - Task is marked as FAILED after being marked as FINISHED. (COPS-4995) -->


# 先前版本
要查看与最新先前版本的不同，请查看以下链接：
- [发布版本 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 2019 年 2 月 12 日。
- [发布版本 1.11.12](/mesosphere/dcos/1.11/release-notes/1.11.12/) - 2019 年 10 月 10 日。
- [发布版本 1.12.4](/mesosphere/dcos/1.12/release-notes/1.12.4/) - 2019 年 7 月 2 日。
- [发布版本 1.13.5](/mesosphere/dcos/1.13/release-notes/1.13.5/) - 2019 年 10 月 2 日
