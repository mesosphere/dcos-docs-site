---
layout: layout.pug
navigationTitle: 1.13.2 的发行说明
title: 1.13.2 的发行说明
menuWeight: 5
excerpt: DC/OS 1.13.2 版本注释，包括开源属性和版本策略。
---
DC/OS 1.13.2 于 2019 年 7 月 3 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.2/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.2/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 <a href="https://support.mesosphere.com/s/downloads">[支持网站]</a> 访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

DC/OS 1.13.2 包括以下组件：
- Apache Mesos 1.8.0 [变更记录](https://github.com/apache/mesos/blob/f5770dcf322bd8a88e6c88041364a4089d92be90/CHANGELOG)。
- Marathon 1.8.204 [更改日志](https://github.com/mesosphere/marathon/blob/5209e3183846579e095c76069464062b673e9854/changelog.md)。
- Metronome 0.6.27 [变更记录](https://github.com/dcos/metronome/blob/b8a73dd/changelog.md)。

# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.13.2 中已修复的问题
在 DC/OS 1.13.2 中修复的问题按特性、作用区域或组件分组。

## 作业管理
- COPS-4706，DCOS_OSS-5019 - 改进在运行作业时对密钥执行的验证。
- DCOS_OSS-5258，DCOS_OSS-5273 - 允许您报告完成作业的任务 ID。此版本中，您可以使用 `embed=history` 参数来查询作业的运行详细信息，以返回成功完成和未完成作业在作业历史记录中的任务 ID。

## 记录
- DCOS-53834 - Mesos 任务日志被发送至 Fluent Bit，并包含任务元数据。

## Marathon
- DCOS_OSS-5260，DCOS-54927 - 修复了两个独立的部署可能相互干扰而导致启动太多任务和/或可能导致错误部署的问题。

## 度量标准
- DCOS-54425 - 在管道中添加了 Fluent Bit 度量。
- DCOS-53589 - Telegraf 仅对 DC/OS systemd 服务报告 `procstat` 度量，而不是所有进程。

## 安全 
引入了一种机制，该机制使用最先进的双向 TLS 身份验证来保护群集中的 Exhibitor 服务免受未经授权的访问。查看 [文档](/mesosphere/dcos/cn/1.13/security/ent/tls-ssl/exhibitor/)。该机制旨在替代基础 `exhibitor_admin_password-based` 机制。

## 存储
DCOS-43777- 使用 DC/OS UI 创建 DC/OS 存储卷时，所创建的 JSON 应用定义的结果持久性条目不具有类型集。因此，使用默认类型值 `root`。在本版本中，DC/OS UI 升级至 v2.82.5。

