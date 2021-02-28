---
navigationTitle: 1.13.9 版本注释
title: 1.13.9 版本注释
menuWeight: 0
excerpt: DC/OS 1.13.9 版本的注释，包括开源归属和版本策略。
---
DC/OS&trade; 1.13.9 于 2020 年 4 月 29 日发布。

<p class="message--warning"><strong>警告：</strong>DC/OS 1.13.9 版本包含持久 dcos-net 状态的数据格式更改，如果您升级到 2.0.4 以外的任何其他版本，都可能会导致 dcos-net 出现严重问题。因此，我们建议您升级到 2.0.4 或更高的版本。</p>

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.9/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.9/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

新客户请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

# 发布摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

### DC/OS 已修复和改进的问题

- 修复了在 1.13.8 中出现的问题，该问题导致调和 L4LB 时 dcos-net 陷入崩溃的循环。此问题会使用户无法成功升级其 DC/OS 实例。(COPS-6002)
