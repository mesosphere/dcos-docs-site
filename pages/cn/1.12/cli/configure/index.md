---
layout: layout.pug
navigationTitle:  Configuring the CLI
title: Configuring the CLI
menuWeight: 2
excerpt: 配置命令行界面

enterprise: false
---

您可以使用 [dcos cluster](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-cluster/) 和 [dcos confi](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-config/) 命令组访问 DC/OS CLI 配置。

# 环境变量

DC/OS CLI 支持以下环境变量，可以动态设置。

<a name="dcos-cluster"></a>
#### `DCOS_CLUSTER`

要设置 [连接的群集](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-cluster/dcos-cluster-attach/)，请使用以下命令设置变量：

```bash
export DCOS_CLUSTER=<cluster_name>
```

* pip 版本 7.1.0 或更高版本。
* `http_proxy` 和 `https_proxy` 环境变量为使用 `pip` 而定义。

<a name="dcos-dir"></a>
#### `DCOS_DIR`

DC/OS 配置目录的路径。如果您希望 DC/OS 配置目录为 `/home/jdoe/config`，请使用以下命令设置变量：

```bash
export DCOS_DIR=/home/jdoe/config
```

1. 可选择地设置 `DCOS_DIR` 并运行 `dcos cluster setup` 命令。

```bash
export DCOS_DIR=<path/to/config_dir> # optional, default when not set is ~/.dcos
dcos cluster setup <url>
```

* 为您不想使用代理的域定义 `no_proxy`：

 此设置根据 `$DCOS_DIR/clusters/<cluster_id>` 下的群集配置生成和更新。生成新设置群集 [如此处所示](/mesosphere/dcos/cn/1.12/cli/index#setupcluster)。

<a name="dcos-ssl-verify"></a>
#### `DCOS_SSL_VERIFY`
指示是否验证 SSL 证书或设置 SSL 证书路径。您必须手动设置此变量。设置此环境变量相当于在 DC/OS 配置[文件] (#configuration-files) 中设置 `dcos config set core.ssl_verify` 选项。例如，指示您想要设置 SSL 证书的路径：

```bash
export DCOS_SSL_VERIFY=false
```

<a name="dcos-verbosity"></a>
#### `DCOS_VERBOSITY`
将日志消息打印到指定级别或更高级别的 stderr。 `DCOS_VERBOSITY=1` 等同于 `-v` 命令行选项。 `DCOS_VERBOSITY=2` 等同于 `-vv` 命令行选项。
