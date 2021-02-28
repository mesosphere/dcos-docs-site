---
navigationTitle: 1.13.7 版本注释
title: 1.13.7 版本注释
menuWeight: 2
excerpt: DC/OS 1.13.7 版本的注释，包括开源归属和版本策略。
---
DC/OS 1.13.7 于 2020 年 1 月 3 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.7/dcos_generate_config.sh"]下载 DC/OS 开源[/button]

[button color="purple" href="https://downloads.mesosphere.com/dcos-enterprise/stable/1.13.7/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站]访问 DC/OS Enterprise 配置文件。(https://support.mesosphere.com/s/downloads). 对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>

DC/OS 1.13.7 包括以下组件：

- Apache Mesos 1.8.2-dev
- Marathon 1.8.232

# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.13.7 中已修复和改进的问题

<!-- The issues that have been fixed and improved in DC/OS 1.13.7 are grouped by feature, functional area, or component.  -->

- 现在，Marathon 会针对同一身份的多个并发身份验证请求捆绑为一个请求，从而减少了对底层 DC/OS 身份验证基础架构的惊群效应。(DCOS-62006)
- 修复了在应用程序升级期间，Marathon 有时会启动太多替换任务的问题。(DCOS-62078)
- DC/OS 现在使用 Golang 1.10.8 来构建 CockroachDB，这可以纠正出现时钟偏斜后阻止 CockroachDB 正确恢复的问题。(DCOS-61502)
- [Mesos] 支持 WWW-Authenticate 标头中带引号的 realm，这修复了若 Docker 注册表的认证使用的是带引号的 realm，则阻止 UCR 从该 Docker 注册表拉取的问题。 (DCOS-61529)
- DC/OS 中的“服务”选项卡现在会按预期显示服务。(DCOS-61439)
- 修复了覆盖网络配置的更新无法正确传播到群集中所有节点的问题。(DCOS_OSS-5620)
- 修复了在重负载下会导致 'dcos-net' 停止响应的问题。(DCOS_OSS-5634)
- 修复了一个会阻止覆盖网络在某些情况下进行恢复的罕见问题。(DCOS_OSS-5626)
- 将网络接口设置为：仅针对 CoreOS 上的 networkd 为非托管，从而解决了导致覆盖网络在某些情况下无法正常工作的问题。(DCOS-60956)
