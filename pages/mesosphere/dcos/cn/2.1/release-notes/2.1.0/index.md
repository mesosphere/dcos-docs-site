---
layout: layout.pug
navigationTitle: 2.1.0 版本注释
title: 2.1.0 版本注释
menuWeight: 1
render: mustache
beta: false
model:  /mesosphere/dcos/2.1/data.yml
excerpt: DC/OS 2.1.0 版本的注释，包括开源归属和版本策略。
---
Mesosphere&reg; DC/OS&trade; 2.1.0 于 2020 年 6 月 9 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.1.0/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.1.0/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

新客户请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

# 发布摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

本发布版提供了新的功能和改进以改善用户体验，修复报告的问题，整合之前版本的变更，并保持对其他包的兼容性和支持，例如，在 DC/OS 中使用的 Marathon 和 Metronome。

# 新特性和功能 

## 垂直容器爆发
现在，DC/OS 允许您设置 Marathon 应用程序和 Pod 所使用的 CPU 和内存量的限制。这意味着，服务可以在 CPU 和内存量得到保证的情况下运行，并且只有在具有可用的 CPU 周期和/或内存时，才能消耗更多的这些资源。有关详细信息，请参阅 [创建服务](/mesosphere/dcos/cn/2.1/deploying-services/creating-services/)。

## Calico 网络策略
Calico 现在已预安装在 DC/OS 2.1 中，并且可用于容器，以加入覆盖网络并设置网络策略。DC/OS Calico 组件通过提供用于 Mesos 通用容器运行时的 Calico CNI 插件和用于 Docker 引擎的 Calico libnetwork 插件，将 Calico 网络连接集成到 DC/OS 中。如需更多信息，请参阅 [Calico](/mesosphere/dcos/cn/2.1/networking/SDN/calico)。

## 作业虚拟网络连接支持
基于 Metronome 的作业现在可以加入容器网络，与同一网络中的其他服务/作业进行通信。有关详细信息，请参阅 [创建作业](/mesosphere/dcos/cn/2.1/deploying-jobs/quickstart/)。

## Admin Router 的自定义证书
现在，DC/OS 允许您提供非 CA 自定义外部证书和密钥，然后，Admin Router 将其用于连接到群集的客户端。有关详细信息，请参阅 [配置自定义外部证书](/mesosphere/dcos/cn/2.1/security/ent/tls-ssl/ar-custom/)

## 用于代理执行器通信的域套接字
添加了新配置选项 `mesos_http_executors_domain_sockets`，这将促使 Mesos 代理节点在与执行器通信时使用域套接字（默认启用）。此更改使管理员可以编写防火墙规则，以阻止对代理端口 5051 的未经授权的访问，因为执行器的工作不再需要对其进行访问。

### 突破性变更
- 配置选项 `MARATHON_ACCEPTED_RESOURCE_ROLES_DEFAULT_BEHAVIOR` 取代配置选项 `MARATHON_DEFAULT_ACCEPTED_RESOURCE_ROLES`。请参阅 Marathon [命令行标记文档](https://github.com/mesosphere/marathon/blob/master/docs/docs/command-line-flags.md)，以了解标记的说明。
- 删除 `revive_offers_for_new_apps` Marathon 选项。
- Marathon 不再过滤字段 `acceptedResourceRoles`。该字段是一个或两个值的数组：`*` 以及服务角色。之前，如果提供了无效的值，Marathon 会安静地将其丢弃。现在，它会返回错误。如果这会导致中断，您可以通过在所有管理节点上将 `MARATHON_DEPRECATED_FEATURES=sanitize_accepted_resource_roles` 添加到文件 `/var/lib/dcos/marathon/environment` 来重新启用该功能。在升级到下一版本的 DC/OS 之前，您必须删除此行。
- DC/OS 网络现在要等到代理变为活跃状态之后，才能为代理上的任务添加 DNS 条目，以防止解析无法访问的地址。(DCOS_OSS-5463)
- dcos-net（l4lb）通过在任务不正常时将 VIP 后端权重更改为 0 或进入 TASK_KILLING 状态来正常断开连接（而不是删除它们）。(D2iQ-61077)
- 从 DC/OS 中删除 spartan 包。已在 1.11 中弃用，并由 dcos-net 替代。
- 从 DC/OS 中删除 toybox 包。仅由 Spartan 使用。
- 从 DC/OS 中删除 dcos-history-service。(DCOS-58529)
- Admin Router 访问日志的新格式。(D2iQ-43957, DCOS-59598, D2iQ-62839)

# 组件版本
DC/OS 2.1.0 包括以下组件版本：

- Apache&reg; Mesos&reg; 1.10.0-dev
- Marathon 1.10.17
- Metronome 0.6.44
- DC/OS UI 至 v5.0.41

# 已修复和改进的问题
- Zookeeper 日志消息现转发到 syslog。(COPS-6128)
- 修复了 Metronome 中现有作业在升级后似乎会丢失的关键错误。(COPS-6092)
- (COPS-5951, COPS-5827)
- 修复了在极少数情况下，用户升级群集之后，无法再启动使用 UCR 容器化工具的任务的问题。(D2iQ-64507, COPS-5868)
- 修复了拉入 UCR 的镜像对 nvcr.io 不起作用的问题（缺少 ‘service’/‘scope’ 参数）。(COPS-5804)
- 将 Java 升级到版本 8u232，以与先前 DC/OS 版本保持一致。(DCOS-62548, COPS-5738)
- 修复了在 DC/OS 升级之后，代理上的任务所使用的执行器资源被错误地计入配额的问题。(COPS-5725)
- DC/OS Admin Router 现在允许大型的文件包（最大为 32GB）被上传至包注册表。(D2iQ-61233, COPS-5615)
- 在安装脚本中添加了其他日志记录，以帮助调试安装问题。(COPS-5428)
- 修复了如果代理被排空并随后重新激活，Mesos 管理节点在某些情况下会崩溃的问题。(COPS-5931, MESOS-10116)
- dcos-diagnostics 组件现在对诊断检查进行速率限制，以避免大型群集的性能下降。(COPS-5915)
- dcos-cosmos 模板引擎现在可以接受未转义的原始 JSON 字段。(COPS-5814)
- dcos-telegraf 组件已得到增强，以允许配置 allowed_pending_messages 参数。(COPS-5629)
- 从 DC/OS 中删除 octarine 包。
- 从 DC/OS 中删除 avro-cpp 包。

## Mesos 已修复和改进的问题
有关 Mesos 更新的详细说明，请参阅 [更改日志](https://github.com/apache/mesos/blob/1ff2fcd90eabd98786531748869b8596120f7dfe/CHANGELOG)

## Marathon 已修复和改进的问题
有关 Marathon 更新的详细说明，请参阅 [更改日志](https://github.com/mesosphere/marathon/blob/master/changelog.md)。

## Metronome 已修复和改进的问题
有关 Metronome 更新的详细说明，请参阅 [更改日志](https://github.com/dcos/metronome/blob/master/changelog.md)。
