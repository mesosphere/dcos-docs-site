---
layout: layout.pug
navigationTitle: 安装和自定义
title: 安装和自定义
menuWeight: 10
excerpt: 安装 DC/OS Kubernetes（附带默认安装）
---

默认的 DC/OS Kubernetes 包安装为尝试服务提供合理的默认设置。

## 先决条件

### 资源

要使用默认参数运行框架，您的集群至少必须有一个专用代理以及运行下表所述任务所需的可用资源：

| | 每个集群的实例 | 每个实例的 CPU | 每个实例的 Mem (MB) | 每个实例的磁盘空间 (MB) |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler       | 1                     | 1                | 1024                  | -                           |
| `etcd`                    | 1                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| `kube-apiserver`          | 1                     | 0.5              | 1024                  | -                           |
| `kube-scheduler`          | 1                     | 0.5              | 512                   | -                           |
| `kube-controller-manager` | 1                     | 0.5              | 512                   | -                           |
| `kube-proxy`              | 1                     | 0.1              | 512                   | -                           |
| `kubelet`                 | 1                     | 3                | 3072                  | 10240                       |

如果需要如何运行高可用性群集的指导，请参考
[Advanced Installation](../advanced-install).

<p class="message--warning"><strong>警告： </strong>无法满足先决条件会导致任务无法调度。这些任务将不会在DC/OS UI 或 CLI 显示，且可能安装会受阻。</p>

### Software

每个 DC/OS 代理 (无论是专有或公共) 必须安装在 `$PATH` 中有的以下二进制文件:

| Binary     |
| ---------- |
| `awk`      |
| `base64`   |
| `bash`     |
| `cat`      |
| `chmod`    |
| `cp`       |
| `cut`      |
| `dirname`  |
| `echo`     |
| `envsubst` |
| `grep`     |
| `host`     |
| `ip`       |
| `kill`     |
| `lscpu`    |
| `mkdir`    |
| `mount`    |
| `printf`   |
| `pwd`      |
| `rm`       |
| `sed`      |
| `sleep`    |
| `umount`   |
| `wc`       |

这些二进制文件可能已经捆绑在 Linux distro 中（使用中）或者
需要使用包管理器进行安装。例如，在 CentOS 中安装这些
二进制文件与运行以下命令相对应：

```shell
$ yum install -y \
    bash \
    bind-utils \
    coreutils \
    gawk \
    gettext \
    grep \
    iproute \
    util-linux \
    sed
```

<p class="message--warning"><strong>警告: </strong>未能满足这些先决条件将导致任务启动
失败或在执行过程中出现错误，导致群集中断。</p>


# 从 DC/OS CLI 中安装

要使用默认配置启动 Kubernetes 集群，请运行以下命令：

```shell
dcos package install kubernetes
```

或者，您可以在 `options.json` 文件中指定自定义配置，并使用 `--options` 参数将其传递至 `dcos package install`：

```shell
dcos package install kubernetes --options=options.json
```

请注意，`service.name` 的任何自定义值必须包含字母数字
字符、`'-'`、`'_'` 或 `'.'`，并且必须以字母数字字符开始和结束，
不超过 24 个字符。另外，现在也可以
在组下安装包（例如，将 `/dev/kubernetes` 用作
服务名称）。为此，您需要提供文件夹的用户权限（例如， `/dev`），
您将在此文件夹安装服务。

**建议：** 将自定义配置存储在源控件中。

有关创建 `options.json` 文件的更多信息，请参阅 [DC/OS 文档](/cn/1.11/deploying-services/config-universe-service/)。

# 从 DC/OS Web 界面安装

您可以 [从 DC/OS Web 界面安装 Kubernetes](/cn/1.11/deploying-services/install/)。如果您从 Web 界面安装 Kubernetes，那么您必须单独安装 DC/OS Kubernetes CLI 子命令。

从 DC/OS CLI 输入：

```shell
dcos package install kubernetes --cli
```
请注意，“服务/名称”的任何自定义值必须包含字母数字字符、`'-'`、`'_'` 或 `'.'`，并且必须以字母数字字符开始和结束，不得超过 24 个字符。此外，现在也可以在组下安装包（例如，将 `/dev/kubernetes` 用作服务名称）。为此，您需要提供文件夹的用户权限（例如， `/dev`），您将在此文件夹安装服务。

选择 [高级安装](/cn/services/kubernetes/1.2.1-1.10.6/advanced-install/)，了解如何执行自定义安装，包括如何设置代理、改进 TLS、启用 Kubernetes 云提供商集成、备份/恢复和高可用性。
