---
layout: layout.pug
navigationTitle: 集群连接
title: 集群连接
menuWeight: 3
excerpt: 连接到多个 DC/OS 集群
enterprise: false

---

使用 [dcos cluster](/cn/1.11/cli/command-reference/dcos-cluster/) 命令连接到多个 DC/OS 群集。

`dcos cluster` 命令有子命令，用于设置连接并附加到集群以及重命名和删除集群。

## 设置与集群的连接

设置与集群的连接时，会在文件 `<home-directory>/.dcos/clusters/<cluster_id>/dcos.toml`中存储连接配置，附加到集群并对 DC/OS 进行身份认证。附加到集群设置其为活动集群。

要设置集群连接，运行 `dcos cluster setup` 命令，使用集群 URL 替换 `<dcos-url>` ：

```bash
dcos cluster setup <dcos-url>
```

## 附加到集群

要附加到连接的集群，运行 `dcos cluster attach` 命令，使用集群名称替换 `<name>”：

```bash
dcos cluster attach <connected-cluster-name>
```

## 查看已连接的集群

要查看所有连接的集群，运行 `dcos cluster list` 命令。该命令列出集群名称、集群 ID、状态、DC/OS 版本（如果集群可达）和管理节点的 URL。附加的集群的集群名称旁有星号（`*`）。

状态可具有以下值：

- 可用：集群在本地设置，且可访问
- 不可用：集群在本地设置，且无法访问
- 未配置：集群不在本地设置（即，集群被 [链接](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)至当前附加的集群上）。

在本示例中，名为 `dcosdev` 的集群为被附加的集群：

```bash
  NAME                   CLUSTER ID                 STATUS       VERSION                     URL
dcosprod     5f7fb957-6daf-446e-8689-0b5b476b2d39  UNAVAILABLE   1.11.0    https://dcosclus-eosy.us-west-2.elb.amazonaws.com
dcosdev*     cf96739f-f800-42ea-95d7-d60acc689194  AVAILABLE     1.11.0    https://dcosclus-5m65.us-west-2.elb.amazonaws.com
```

要仅查看附加的集群，运行 `dcos cluster list --attached` 命令。

## 重命名集群

您可以使用`dcos cluster rename重命名连接的集群 <name> <new-name>` command. For example, to rename your cluster from `dcosdev` to `dcoslive`:

```bash
dcos cluster rename dcosdev dcoslive
```

<p class="message--note"><strong>注意: </strong> 此命令仅在本地重命名集群。服务器上的实际集群名称未更改。</p>

## 删除集群

您可以用`dcos cluster remove 删除连接的集群 <name>` command. For example, to remove the cluster `dcosdev`:

```bash
dcos cluster remove dcosdev
```

如果删除附加的集群，执行在集群上例如安装程序包之类操作的 dcos 命令可能失败，直到您附加另一个连接的集群为止。
