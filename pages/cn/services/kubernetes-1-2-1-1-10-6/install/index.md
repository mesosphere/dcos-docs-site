---
layout: layout.pug
navigationTitle: Install and Customize
title: Install and Customize
menuWeight: 10
excerpt: Installing DC/OS Kubernetes with the default installation

---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes -->


默认的 DC/OS Kubernetes 包安装为尝试服务提供合理的默认设置。

## 先决条件

### 资源

要使用默认参数运行框架，您的群集至少必须有一个专用代理以及运行下表所述任务所需的可用资源：

| | 每个群集的实例 | 每个实例的 CPU | 每个实例的 Mem (MB) | 每个实例的磁盘空间 (MB) |
| ----------------------- | --------------------- | ---------------- | --------------------- | --------------------------- |
| Package scheduler       | 1                     | 1                | 1024                  | -                           |
| `etcd`                    | 1                     | 0.5              | 1024                  | 3072 for data, 512 for logs |
| `kube-apiserver`          | 1                     | 0.5              | 1024                  | -                           |
| `kube-scheduler`          | 1                     | 0.5              | 512                   | -                           |
| `kube-controller-manager` | 1                     | 0.5              | 512                   | -                           |
| `kube-proxy`              | 1                     | 0.1              | 512                   | -                           |
| `kubelet`                 | 1                     | 3                | 3072                  | 10240                       |

For instructions on how to run a highly-available cluster please referr to
[Advanced Installation](../advanced-install).

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>WARNING</b></p>
<p>Failing to meet these prerequisites will lead to tasks failing to be
scheduled. These tasks will not show up in the DC/OS UI or CLI, and installation
will seem to be stuck.</p>
</div>

### Software

Each DC/OS agent (both private and public) must have the following binaries
installed and available in `$PATH`:

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

<div style="border: thin solid black; background-color: #FAFAFA; border-radius: 5px; padding: 10px; margin-bottom: 20px;">
<p><b>警告</b></p>
<p>未能满足这些先决条件将导致任务启动
失败或在执行过程中出现错误，导致群集中断。</p>
</div>

# 从 DC/OS CLI 中安装

要使用默认配置启动 Kubernetes 群集，请运行以下命令：

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

有关创建 `options.json` 文件的更多信息，请参阅 [DC/OS 文档](https://docs.mesosphere.com/1.11/deploying-services/config-universe-service/)。

# 从 DC/OS Web 界面安装

您可以 [从 DC/OS Web 界面安装 Kubernetes](https://docs.mesosphere.com/1.11/deploying-services/install/)。如果您从 Web 界面安装 Kubernetes，那么您必须单独安装 DC/OS Kubernetes CLI 子命令。

从 DC/OS CLI 输入：

```shell
dcos package install kubernetes --cli
```
请注意，“服务/名称”的任何自定义值必须包含字母数字字符、`'-'`、`'_'` 或 `'.'`，并且必须以字母数字字符开始和结束，不得超过 24 个字符。此外，现在也可以在组下安装包（例如，将 `/dev/kubernetes` 用作服务名称）。为此，您需要提供文件夹的用户权限（例如， `/dev`），您将在此文件夹安装服务。

选择 [高级安装](./advanced-install)，了解如何执行自定义安装，包括如何设置代理、改进 TLS、启用 Kubernetes 云提供商集成、备份/恢复和高可用性。
