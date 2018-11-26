---
layout: layout.pug
navigationTitle: CLI
title: CLI
menuWeight: 50
excerpt: 了解 DC/OS 命令行界面

enterprise: false
---

DC/OS 命令行界面 (DC/OS CLI) 实用程序让您管理集群节点、安装和管理软件包、检查集群状态以及从终端管理服务和任务。DC/OS 1.11 需要 DC/OS CLI 0.6.x。

若要列出可用命令，请运行不带参数的 `dcos`：

```bash
dcos

Command line utility for the Mesosphere Datacenter Operating System (DC/OS). The Mesosphere DC/OS is a distributed operating system built around Apache Mesos. This utility provides tools for easy management of a DC/OS installation.

Available DC/OS commands:

	auth           	Authenticate to DC/OS cluster
	backup          Back up and restore
	cluster        	Manage connections to DC/OS clusters
	config         	Manage the DC/OS configuration file
	edgelb          Manage load balancing with Edge-LB
	experimental   	Commands under development, subject to change
	help           	Display help information about DC/OS
	job            	Deploy and manage jobs in DC/OS
	license					Use the DC/OS license
	marathon       	Deploy and manage applications to DC/OS
	node           	Administer and manage DC/OS cluster nodes
	package        	Install and manage DC/OS software packages
	security        Manage the DC/OS certificate authority
	service        	Manage DC/OS services
	task           	Manage DC/OS tasks

Get detailed command description with `dcos <command> --help`.
```

# 显示 DC/OS CLI 版本

若要显示 DC/OS CLI 版本，请运行：

```
dcos --version
```

<a name="configuration-files"></a>
# DC/OS CLI 版本和配置文件

DC/OS CLI 0.4.x 和 0.5.x 针对配置文件的位置使用不同的结构。

DC/OS CLI 0.4.x 具有单个配置文件，默认情况下存储在 `~/.dcos/dcos.toml`。在 DC/OS CLI 0.4.x 中，您可以选择使用 [`DCOS_CONFIG`](#dcos-config) 环境变量更改配置文件的位置。

DC/OS CLI 0.5.x 的每个连接集群都有一个配置文件，默认情况下存储在 `~/.dcos/cluster/<cluster_id>/dcos.toml 中。`. In DC/OS CLI 0.5.x you can optionally change the base portion (`~/.dcos`) of the configuration directory using the [`DCOS_DIR`](#dcos-cdir) 环境变量。

**注意：**
- 如果更新到 DC/OS CLI 0.5.x 并运行任何 CLI 命令，它将触发从旧配置结构到新配置结构的转换。
- 在调用 `dcos cluster setup` 后（或已经发生转换），如果您尝试使用 `dcos config set` 命令更新集群配置，该命令将显示一条警告消息，指出该命令已弃用且集群配置状态现在可能已损坏。

# 环境变量

DC/OS CLI 支持以下环境变量，可以动态设置。

<a name="dcos-cluster"></a>
#### `DCOS_CLUSTER` （仅限 DC/OS CLI 0.5.x 及更高版本）

[连接的](/1.10/cli/command-reference/dcos-cluster/dcos-cluster-attach/)集群。要设置连接的集群，请使用以下命令设置变量：

```bash
export DCOS_CLUSTER=<cluster_name>
```

<a name="dcos-config"></a>
#### `DCOS_CONFIG`（仅限 DC/OS CLI 0.4.x）

DC/OS 配置文件的路径。如果将 DC/OS 配置文件放入 `/home/jdoe/config/dcos.toml`，请使用以下命令设置变量：

```bash
export DCOS_CONFIG=/home/jdoe/config/dcos.toml
```

如果您已经配置了 `DCOS_CONFIG` 环境变量：

- 在转换为[新配置结构] (#configuration-files) 后，将不再接受 `DCOS_CONFIG`。
- 在调用 `dcos cluster setup` 之前，您可使用 `dcos config set` 更改 `DCOS_CONFIG` 指向的配置。该命令会显示一条警告消息，指出该命令已弃用，建议使用 `dcos cluster setup`。


<a name="dcos-dir"></a>
#### `DCOS_DIR`（仅限 DC/OS CLI 0.5.x 及更高版本）

DC/OS 配置目录的路径。如果您希望 DC/OS 配置目录为 `/home/jdoe/config`，请使用以下命令设置变量：

```bash
export DCOS_DIR=/home/jdoe/config
```

1. 可选择地设置 `DCOS_DIR` 并运行 `dcos cluster setup` 命令。

    ```
    export DCOS_DIR=<path/to/config_dir> (optional, default when not set is ~/.dcos)
    dcos cluster setup <url>
    ```

 此设置根据 $DCOS_DIR/clusters/<cluster_id> 下的集群配置生成和更新<cluster_id>。 将新设置的集群设置为连接的集群。


<a name="dcos-ssl-verify"></a>
#### `DCOS_SSL_VERIFY`
指示是否验证 SSL 证书或设置 SSL 证书路径。您必须手动设置此变量。设置此环境变量相当于在 DC/OS 配置[文件] (#configuration-files) 中设置 `dcos config set core.ssl_verify` 选项。例如，如果您想要设置 SSL 证书的路径：

```bash
export DCOS_SSL_VERIFY=false
```

<a name="dcos-log-level"></a>
#### `DCOS_LOG_LEVEL`
用所示级别或更高级别显示 `stderr` 的日志消息。这相当于 `--log-level` 命令行选项。严重级别为：

* **调试** 向 `stderr` 显示所有消息，包括信息、警告、错误以及关键消息。
* **信息** 向 `stderr` 显示信息、警告、错误以及关键消息 。
* **警告** 向 `stderr` 显示警告、错误以及关键消息。
* **错误** 向 `stderr` 显示错误和关键消息。
* **关键** 仅向 `stderr` 显示关键消息。

例如，将日志级别设置为警告：

```bash
export DCOS_LOG_LEVEL=warning
```

<a name="dcos-debug"></a>
#### `DCOS_DEBUG`
指示是否将其他调试消息 print 输出到 `stdout`。默认情况下，这设置为 `false`。例如：

```bash
export DCOS_DEBUG=true
```
