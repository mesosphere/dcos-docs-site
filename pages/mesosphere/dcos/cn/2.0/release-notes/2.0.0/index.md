---
layout: layout.pug
navigationTitle: 2.0.0 的发行说明
title: 2.0.0 的发行说明
menuWeight: 5
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: DC/OS 2.0.0 版本注释，包括开源归属和版本策略。
---
DC/OS 2.0.0 于 // 发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.0/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/2.0.0/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从<a href="https://support.mesosphere.com/s/downloads">支持网站</a>访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

# 发布版本摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

本发布版提供了新的功能和改进以改善用户体验，修复报告的问题，整合之前版本的变更，并保持对其他包的兼容性和支持，例如在 DC/OS 中使用的 Marathon 和 Metronome。

如果在生产环境中部署了 DC/OS，则请查看 [已知问题和限制](#known-issues)，了解特定场景的任何潜在运行变更是否适用您的环境。

# 新特性和功能

## 新功能的亮点

# 此版本中已修复的问题


### 第三方更新和兼容性
- 将 REX-Ray 的支持更新到最新稳定版本 (DCOS_OSS-4316，COPS-3961)。

- 升级受支持的 Telegraf 度量标准插件版本，以便利用最新的漏洞修复和功能改进 (DCOS_OSS-4675)。

- 将 Java 受支持版本更新至 8u192，以解决已知的严重和高度安全漏洞 (DCOS-43938, DCOS_OSS-4380)。

- 将 Erlang/OTP 框架的支持升级到 Erlang/OTP 版本 21.3 (DCOS_OSS-4902)。

# 已知问题和限制
本部分介绍了不一定影响所有客户，但可能需要更改环境以解决特定情况的所有已知问题或限制。这些问题按特性、作用区域或组件分组。适用时，问题说明会包括一个或多个问题跟踪标识符，放在括号中以便参考。

### 已弃用或停用的功能


# 更新后的组件更改列表


# 先前版本
要查看与先前版本的不同，请查看以下链接：
- [发布版本 1.10.11](/mesosphere/dcos/1.10/release-notes/1.10.11/) - 2019 年 2 月 12 日。
- [发布版本 1.11.10](/mesosphere/dcos/1.11/release-notes/1.11.10/) - 2019 年 2 月 12 日。
- [发布版本 1.12.3](/mesosphere/dcos/1.12/release-notes/1.12.3/) - 2019 年 3 月 14 日。
