---
layout: layout.pug
navigationTitle:  CLI
title: CLI
menuWeight: 50
excerpt: 了解 DC/OS 中的命令行界面实用程序
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

DC/OS&trade; 命令行界面 (DC/OS CLI) 实用程序允许您管理群集节点、安装和管理软件包、检查群集状态以及管理服务和任务。

DC/OS 2.0 需要 DC/OS CLI >= 0.8。安装时，[请遵循这些说明](/mesosphere/dcos/2.0/cli/install/)。

若要列出可用命令，请运行不带参数的 `dcos`：

```bash
dcos

Usage:
    dcos [command]

Commands:
    auth
        Authenticate to DC/OS cluster
    cluster
        Manage your DC/OS clusters
    config
        Manage the DC/OS configuration file
    diagnostics
        Create and manage DC/OS diagnostics bundles
    help
        Help about any command
    job
        Deploy and manage jobs in DC/OS
    marathon
        Deploy and manage applications to DC/OS
    node
        View DC/OS node information
    package
        Install and manage DC/OS software packages
    plugin
        Manage CLI plugins
    quota
        Manage DC/OS quotas
    service
        Manage DC/OS services
    task
        Manage DC/OS tasks

Options:
    --version
        Print version information
    -v, -vv
        Output verbosity (verbose or very verbose)
    -h, --help
        Show usage help

Use "dcos [command] --help" for more information about a command.
```

<a name="setupcluster"></a>

# 设置群集

要与群集进行交互，首先需要设置 CLI。

```bash
dcos cluster setup <cluster-url>
```

在完成登录程序后，您的 CLI 已准备好与您的群集进行交互。您会注意到，现在它有其他命令，例如，`marathon`、`node`、`package` 等。这些命令来自 [插件](/mesosphere/dcos/2.0/cli/plugins/)、dcos-core-cli 和 dcos-enterprise-cli（如适用），它将作为设置命令的一部分自动安装。

若要显示 DC/OS CLI 版本，请运行：

```bash
dcos --version
```

# 列出群集

DC/OS CLI 可以与多个群集配合使用。以下命令显示最新配置的群集：

```bash
dcos cluster list
        NAME               ID                        STATUS     VERSION      URL
  *   cluster 26f72c2f-8d03-47d7-b95f-972b1fd3dea2  AVAILABLE    1.13  <cluster-url>
```

<p class="message--note"><strong>注意：</strong>* 表示 CLI 当前已连接到群集名称。如果使用另一个群集再次运行设置命令，您将在列表中看到一个新项目。</p>

<a name="configuration-files"></a>

# DC/OS CLI 版本和配置文件

DC/OS CLI 具有每个连接群集的配置文件，默认情况下存储在 `~/.dcos/clusters/<cluster_id>/dcos.toml` 中。您可以选择使用 [`DCOS_DIR`](#dcos-cdir) 环境变量更改配置目录的基本部分 (`~/.dcos`)。
