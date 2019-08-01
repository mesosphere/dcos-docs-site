---
layout: layout.pug
navigationTitle:  CLI Plugins
title: CLI Plugins
menuWeight: 5
excerpt: 如何扩展命令行界面

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

插件扩展了 CLI 的功能，用于针对群集的操作。

插件是特定于群集的，当在不同群集之间切换时，CLI 将自动使用为该群集安装的适当插件集。

# Core CLI 插件

特定于 DC/OS 版本的命令被打包到名为 `dcos-core-cli` 的插件中。
在 0.7 版本中，CLI 包含 1.12 Core 插件，它将自动安装到它所连接的任何群集。

此插件中包含的子命令包括：

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|
| [dcos 节点](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-node/) | 管理 DC/OS 群集节点。 |
| [dcos package](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
| [dcos service](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-service/) | 管理 DC/OS 服务。|
| [dcos task](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|

# Enterprise CLI 插件

特定于 DC/OS EE 版本的命令被打包到名为 `dcos-enterprise-cli` 的插件中。

此插件中包含的子命令包括：

| 命令 | 说明 |
|---------|-------------|
| [dcos 备份](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-backup/) | 访问 DC/OS 备份功能。 |
| [dcos 许可] ](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-license/) | 管理 DC/OS 许可证。 |
| [dcos 安全](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/) | DC/OS 安全相关命令。 |

# 更新 Core 和 Enterprise 插件

发布新版本时，必须运行以下命令来更新 Core 和 Enterprise 插件：

```bash
dcos package install <dcos-core-cli|dcos-enterprise-cli>
```


# 安装插件

用户可以使用 [dcos 插件添加](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-plugin/dcos-plugin-add/) 命令安装插件。

# 分配插件

也可以通过核心 CLI 中的 [dcos 包](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-package/) 命令安装插件。
