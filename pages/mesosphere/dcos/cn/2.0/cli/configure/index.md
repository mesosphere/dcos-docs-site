---
layout: layout.pug
navigationTitle:  配置CLI
title: 配置CLI
menuWeight: 2
excerpt: 配置命令行界面
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

您可以使用 [dcos cluster](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/) 和 [dcos config](/mesosphere/dcos/2.0/cli/command-reference/dcos-config/) 命令组访问 DC/OS&trade; CLI 配置。

# 环境变量

DC/OS CLI 支持以下环境变量，可以动态设置。

<a name="dcos-cluster"></a>

#### `DCOS_CLUSTER`

要设置 [连接的群集](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/dcos-cluster-attach/)，请使用以下命令设置变量：

```bash
export DCOS_CLUSTER=<cluster_name>
```

<a name="dcos-dir"></a>

#### `DCOS_DIR`

DC/OS 配置目录的路径。如果您希望 DC/OS 配置目录为 `/home/jdoe/config`，请使用以下命令设置变量：

```bash
export DCOS_DIR=/home/jdoe/config
```

下次您可以运行 `dcos cluster setup command`，群集配置将在 `/home/jdoe/clusters/<cluster_id>/` 而不是默认的 `~/.dcos/clusters/<cluster_id>/` 下创建。

<a name="dcos-ssl-verify"></a>

#### `DCOS_SSL_VERIFY`

指示是否验证 SSL 证书或设置 SSL 证书路径。您必须手动设置此变量。设置此环境变量相当于在 DC/OS 配置[文件](#configuration-files) 中设置 `dcos config set core.ssl_verify` 选项。例如，指示您想要设置 SSL 证书的路径：

```bash
export DCOS_SSL_VERIFY=false
```

<a name="dcos-verbosity"></a>

#### `DCOS_VERBOSITY`

将日志消息打印到指定级别或更高级别的 `stderr`。 `DCOS_VERBOSITY=1` 等同于 `-v` 命令行选项。 `DCOS_VERBOSITY=2` 等同于 `-vv` 命令行选项。
