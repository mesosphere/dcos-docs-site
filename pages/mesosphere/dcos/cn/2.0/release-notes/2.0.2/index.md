---
layout: layout.pug
navigationTitle: 2.0.2 的发行说明
title: 2.0.2 的发行说明
menuWeight: 1
excerpt: DC/OS 2.0.2 版本注释
---
DC/OS 2.0.2 于 2020 年 1 月 30 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.2/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.2/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站](https://support.mesosphere.com/s/downloads)访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 2.0.2 中已修复和改进的问题

- 将 Java 升级到版本 8u232，以与先前 DC/OS 版本保持一致。(DCOS-62548, COPS-5738)

## Marathon 
- 现在，Marathon 将针对同一身份的多个并发身份验证请求捆绑为一个请求，从而减少了对底层 DC/OS 身份验证基础架构的惊群效应。(DCOS-62006) 
- 现在，在驻留 pod 实例转换为“未知”或任何其他可能导致其被排除的任务状态时，DC/OS 会在 /v2/pods/::status 中显示驻留 pod 实例。(MARATHON-8710)

## Admin Router

- 修复了以下问题：在升级到 DC/OS 2.0 后，adminrouter-agent 无法在缺少 SSE 4.2 的较旧 CPU 上启动。(DCOS_OSS-5643)
