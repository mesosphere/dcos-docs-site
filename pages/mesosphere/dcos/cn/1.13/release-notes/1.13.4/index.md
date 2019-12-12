---
layout: layout.pug
navigationTitle: 1.13.4 的发行说明
title: 1.13.4 的发行说明
menuWeight: 3
excerpt: DC/OS 1.13.4 版本注释，包括开源属性和版本策略。
---
DC/OS 1.13.4 于 2019 年 9 月 5 日发布。

[button color="light" href="https://downloads.dcos.io/dcos/stable/1.13.4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

[button color="purple" href="http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.4/dcos_generate_config.ee.sh"]下载 DC/OS Enterprise* [/button]

注册 DC/OS Enterprise 客户可以从 [支持网站](https://support.mesosphere.com/s/downloads) 访问 DC/OS Enterprise 配置文件。对于新客户，请在尝试下载和安装 DC/OS Enterprise 版本之前，先联系销售代表或发送邮件至 <a href="mailto:sales@mesosphere.io">sales@mesosphere.io</a>。

DC/OS 1.13.4 包括以下组件：


# 发布版摘要
DC/OS 是一种分布式操作系统，使您可以在本地、云或混合群集环境中管理资源、应用程序部署、数据服务、网络和安全。

# DC/OS 1.13.4 中已修复的问题
在 DC/OS 1.13.4 中修复的问题按特性、作用区域或组件分组。

- Mesos 代理节点不会在 RPC 身份验证中死锁。(DCOS-57388)
- 修复了当作业名称与组名称匹配时作业和组名称出现重复的问题。(DCOS-54937, COPS-5208)

## 诊断
- 归档 `/var/log/mesos-state.tar` 已添加到所有诊断捆绑包中。(DCOS-56403)

##  安装

- Windows 构建包现在使用正确的包子集；将变量 `windows` 添加到 Python 包。(DCOS_OSS-5429, DCOS-45547)
- `systemd` 计时器和服务单元现在已包含在 `dcos-diagnostics` 包中，以便安装工具在安装过程中提取它们。(DCOS-56379)


[企业]
## 安全
[/enterprise]
- 修复了 MULTI_ROLE 框架的身份验证。(DCOS-54635)

