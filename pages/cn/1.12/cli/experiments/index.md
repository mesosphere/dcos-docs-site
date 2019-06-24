---
layout: layout.pug
navigationTitle:  Experiments
title: Experiments
menuWeight: 6
excerpt: 启用和使用实验 CLI 功能
实验：真
enterprise: false
---

DC/OS CLI 提供仍在开发且
可能还含有漏洞的实验功能。

通过设置某个环境变量激活实验。

# 报告问题 


如果您遇到某个实验功能问题，请 [提交一份
故障单](https://jira.mesosphere.com/secure/CreateIssueDetails!init.jspa?pid=14105&issuetype=1&priority=3&customfield_12300=114&components=19801&description=Describe%20the%20issue%3A%0A%0AExperiments%20being%20used%3A%0A%0AReproduction%20steps%3A%0A%0AOutput%20when%20run%20with%20%60dcos%20-vv%60%3A%0A%0AOutput%20of%20%60dcos%20--version%60%3A
).

确保将组件设置为 `dcos-cli` 并将团队设置为 `CLI Team`。在
描述中，请包括已启用的实验和命令发出的调试输出，
使用 `-vv` 标记。

# 当前有效实验 #

## 自动安装 Core 和 Enterprise CLI 插件 ##

用法：`export DCOS_CLI_EXPERIMENTAL_AUTOINSTALL_PLUGINS=1`

运行 `dcos cluster setup` 时，此实验启用自动
在 Cosmos 中安装 [Core 和 Enterprise CLI 插件](/cn/1.12/cli/plugins/)
。DC/OS 1.10+ 的 Cosmos 中提供了 Core CLI 插件。

为了获得成功，用户将需要
`dcos:adminrouter:package` 权限以调用 Cosmos。另外，
系统需要访问互联网或 [Local Universe](/cn/1.12/administering-clusters/deploying-a-local-dcos-universe/)。
