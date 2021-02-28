---
navigationTitle: 2.0.4 版本注释
title: 2.0.4 版本注释
menuWeight: 0
excerpt: DC/OS 2.0.4 版本的注释，包括开源归属和版本策略。
---
DC/OS&trade; 2.0.4 于 2020 年 5 月 14 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.4/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.4/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

新客户请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

# 发布摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 

## 组件

DC/OS 2.0.4 包括以下组件版本：

- Apache&reg; Mesos&reg; 1.9.1-dev
- OpenSSL 1.1.1g	

### DC/OS 已修复和改进的问题

- 修复了 Metronome 中现有作业在升级后似乎会丢失的关键错误。(COPS-6092) 
- 修复了导致调和 L4LB 时，dcos-net 陷入崩溃循环的问题。此问题会使用户无法成功升级其 DC/OS 实例。(COPS-5602) 

# Marathon 已修复和改进的问题

- 您可以在 [Marathon 更改日志](https://github.com/mesosphere/marathon/blob/master/changelog.md) 中查看 Marathon 已修复和改进的问题列表。
