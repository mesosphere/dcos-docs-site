---
layout: layout.pug
navigationTitle: 2.0.1 的发行说明
title: 2.0.1 的发行说明
menuWeight: 2
excerpt: DC/OS 2.0.1 版本注释
---
DC/OS 2.0.1 于 2019 年 11 月 22 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/2.0.1/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/2.0.1/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站](https://support.mesosphere.com/s/downloads)访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。


# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 2.0.1 中已修复和改进的问题
<!-- The issues that have been fixed and improved in DC/OS 2.0.1 are grouped by feature, functional area, or component.  -->
- 修复了未完成的 Marathon 部署会阻止成功升级到 DC/OS 2.0 的问题。

- 修复了 Mesos，以便在严格模式下运行 DC/OS 2.0 时可以正确丢弃未使用的内存。

- 修复了 `dcos-net` 中任务更新导致两个 DNS 分区更新的问题。(DCOS_OSS-5495)

- 在决定是否将网络覆盖推送到 Lashup 时，除 TIEP IP 地址和子网之外，DC/OS 现在还按值进行比较。(DCOS_OSS-5620)

- Lashup 的 `kv_message_queue_overflows_total` 度量标准的标签已删除，以提高减轻负载的能力。(DCOS_OSS-5634)

- 在从复制日志中恢复后，DC/OS 现在保留所有代理 VTEP IP。(DCOS_OSS-5626)
