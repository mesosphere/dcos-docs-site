---
layout: layout.pug
navigationTitle:  CLI
title: CLI
menuWeight: 50
excerpt: 了解 DC/OS 中的命令行界面实用程序
enterprise: false
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
---

DC/OS 命令行界面 (DC/OS CLI) 实用程序允许您管理群集以及管理服务和任务。

# DC/OS CLI 版本和配置文件

不同的 CLI 版本与不同版本的 DC/OS 兼容。要确定支持哪些组合，请参阅 [CLI 支持矩阵](/mesosphere/dcos/version-policy/#cli-support-matrix)。

DC/OS CLI 0.4.x 和 0.5.x 针对配置文件的位置使用不同的结构。

DC/OS CLI 0.4.x 具有单个配置文件，默认情况下存储在 `~/.dcos/dcos.toml`。在 DC/OS CLI 0.4.x 中，您可以选择使用 [`DCOS_CONFIG`](#dcos-config) 环境变量更改配置文件的位置。

DC/OS CLI 0.5.x 具有每个连接群集的配置文件，默认情况下存储在 `~/.dcos/clusters/<cluster_id>/dcos.toml` 中。在 DC/OS CLI 0.5.x 中，您可以选择使用 [`DCOS_DIR`]（＃dcos-cdir）环境变量更改配置目录的基本部分（`~/.dcos`）。

- 如果更新到 DC/OS CLI 0.5.x 并运行任何 CLI 命令，它将触发从旧配置结构到新配置结构的转换。
- 在调用 `dcos cluster setup` 后（或已经发生转换），如果您尝试使用 `dcos config set` 命令更新群集配置，该命令将显示一条警告消息，指出该命令已弃用且群集配置状态现在可能已损坏。

## 最新版本安装

DC/OS 1.13 需要 DC/OS CLI >= 0.8。安装时，[请遵循这些说明](/mesosphere/dcos/1.13/cli/install/)。

## CLI 命令

若要列出 DC/OS CLI 中的可用命令，请运行不带参数的 `dcos`：

```bash
$ dcos

Usage:
  dcos [command]

Commands:
  auth
      Authenticate to DC/OS cluster
  cluster
      Manage your DC/OS clusters
  config
      Manage the DC/OS configuration file
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

以下命令仅在 CLI 的 Enterprise 版本中可用：

- [`dcos backup`](/mesosphere/dcos/{{ model.version }}/cli/command-reference/dcos-backup/)
- [`dcos license`](/mesosphere/dcos/{{ model.version }}/cli/command-reference/dcos-license/)
- [`dcos security`](/mesosphere/dcos/{{ model.version }}/cli/command-reference/dcos-security/)

有关安装 CLI 的 DC/OS Enterprise 版本的说明，[请参阅文档](/mesosphere/dcos/{{ model.version }}/cli/enterprise-cli/#installing-the-dcos-enterprise-cli)。

<a name="setupcluster"></a>

# 设置群集

要与群集进行交互，首先需要设置 CLI。

若要显示 DC/OS CLI 版本，请运行：

```bash
dcos --version
```

<a name="configuration-files"></a>


# 环境变量

DC/OS CLI 支持以下环境变量，可以动态设置。

<a name="dcos-cluster"></a>

#### `DCOS_CLUSTER`（仅限 DC/OS CLI 0.5.x 及更高版本）

[连接的](/mesosphere/dcos/{{ model.version }}/cli/command-reference/dcos-cluster/dcos-cluster-attach/)群集。要设置连接的群集，请使用以下命令设置变量：

```bash
dcos cluster setup <cluster-url>
```

在完成登录程序后，您的 CLI 已准备好与您的群集进行交互。您会注意到，现在它有其他命令，例如，`marathon`、`node`、`package` 等。这些命令来自 [插件](/mesosphere/dcos/{{ model.version }}/cli/plugins/)、`dcos-core-cli` 和 `dcos-enterprise-cli`（如适用），它作为设置命令的一部分自动安装。

<a name="dcos-config"></a>

#### `DCOS_CONFIG`（仅限 DC/OS CLI 0.4.x）

此命令显示 DC/OS 配置文件的路径。如果将 DC/OS 配置文件放入 `/home/jdoe/config/dcos.toml`，请使用以下命令设置变量：

```bash
export DCOS_CONFIG=/home/jdoe/config/dcos.toml
```

如果您已经配置了 `DCOS_CONFIG` 环境变量：

- 在转换为[新配置结构] (#configuration-files) 后，不再接受 `DCOS_CONFIG`。
- 在调用 `dcos cluster setup` 之前，您可使用 `dcos config set` 更改 `DCOS_CONFIG` 指向的配置。该命令会显示一条警告消息，指出该命令已弃用，建议使用 `dcos cluster setup`。

# 列出群集

DC/OS CLI 可以与多个群集配合使用。以下命令显示最新配置的群集：

<a name="dcos-dir"></a>

#### `DCOS_DIR`（仅限 DC/OS CLI 0.5.x 及更高版本）

如果您希望 DC/OS 配置目录为 `/home/jdoe/config` 等特定路径，请使用以下命令设置变量：

```bash
export DCOS_DIR=/home/jdoe/config
```

可选择地设置 `DCOS_DIR` 并运行 `dcos cluster setup` 命令。

    ```
    export DCOS_DIR=<path/to/config_dir> (optional, default when not set is ~/.dcos)
    dcos cluster setup <url>
    ```

   此设置根据 `$DCOS_DIR/clusters/<cluster_id>` 下的群集配置生成和更新。将新设置的群集设置为连接的群集。

<a name="dcos-ssl-verify"></a>

#### `DCOS_SSL_VERIFY`
该命令指示是否验证 SSL 证书或设置 SSL 证书路径。您必须手动设置此变量。设置此环境变量相当于在 DC/OS 配置[文件] (#configuration-files) 中设置 `dcos config set core.ssl_verify` 选项。例如，指示您想要设置 SSL 证书的路径：

```bash
$ dcos cluster list
        NAME               ID                        STATUS     VERSION      URL
  *   cluster 26f72c2f-8d03-47d7-b95f-972b1fd3dea2  AVAILABLE    1.13  <cluster-url>
```

<p class="message--note"><strong>注意：</strong>* 表示 CLI 当前已连接到群集名称。如果使用另一个群集再次运行设置命令，您将在列表中看到一个新项目。</p>

<a name="dcos-log-level"></a>

#### `DCOS_LOG_LEVEL`

该命令向指示级别或更高级别的 `stderr` 显示日志消息。这相当于 `--log-level` 命令行选项。严重级别为：

- **调试** 向 `stderr` 打印所有消息，包括信息、警告、错误以及关键消息。
* **信息** 向 `stderr` 打印信息、警告、错误以及关键消息。
- **警告** 向 `stderr` 打印警告、错误和关键消息。
- **错误** 向 `stderr` 打印错误和关键消息。
- **关键** 仅向 `stderr` 打印关键信息。

例如，将日志级别设置为警告：

```bash
export DCOS_LOG_LEVEL=warning
```

<a name="dcos-debug"></a>

#### `DCOS_DEBUG`

该命令指示是否将其他调试消息打印到 `stdout`。该参数默认设置为 `false`。例如：

```bash
export DCOS_DEBUG=true
```
