---
layout: layout.pug
navigationTitle: 1.13.3 的发行说明
title: 1.13.3 的发行说明
menuWeight: 4
excerpt: DC/OS 1.13.3 版本注释，包括开源属性和版本策略。
---
DC/OS 1.13.3 于 2019 年 7 月 24 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.3/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.3/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站](https://support.mesosphere.com/s/downloads) 访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

DC/OS 1.13.3 包括以下组件：

- DC/OS Enterprise UI 更新为 1.13+v2.82.7，插件更新至 1.13+v2.82.7+33076C53。

- DC/OS Enterprise 插件更新至 1.13+v2.82.7+33076C53。

- DC/OS 核心 CLI 已更新为捆绑在私有注册表中的 1.13-patch.5。

- Apache Mesos 1.8.x [变更记录](https://github.com/apache/mesos/blob/07d053f68b75505a4386913f05d521fa5e36373d/CHANGELOG)。

- Marathon 1.8.207 [更改日志](https://github.com/mesosphere/marathon/tree/9f3550487)。

- Metronome 0.6.33 [变更记录](https://github.com/dcos/metronome/releases/tag/v0.6.33)。

# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.13.3 中已修复的问题
在 DC/OS 1.13.3 中修复的问题按特性、作用区域或组件分组。

## 备份和恢复
- 无数据库存在时，整合 `iam-database-restore` 进行工作。这有助于在罕见情境下进行恢复。(DCOS_OSS-5317)

- 如果 ZooKeeper 仍在运行，则整合 `dcos-zk backup` 和 `dcos-zk restore`，以提前退出，并显示明确的错误消息。(DCOS_OSS-5353)

## 运行状况检查
-通过更改超时常数，降低产生假阴性结果的可能性。(DCOS-53742，COPS-5041）

## Marathon
- 尝试杀死不可达的实例时，Marathon 不会再卡死。(MARATHON-8422)

- 标有配置文件名称的持久卷现在默认为 `DiskType.Mount`。(MARATHON-8631)

## 度量标准
- Prometheus 度量现在可以从容器网络模式下的 Mesos 任务中收集。(DCOS-56018, COPS-5040)


[企业]
## 安全
[/enterprise]

在高负载下，对 IAM 的直接请求可能会变慢，从而使 IAM 响应所有请求的速度变慢。Mesos 管理节点现在使用经过 Admin Router 的登录端点，降低任何慢速发送方所带来的影响。这解决了一种罕见的错误情况，其中，IAM 系统将无法使用，这可能会导致严格安全模式下的 Mesos 任务启动错误。(DCOS-56053)
