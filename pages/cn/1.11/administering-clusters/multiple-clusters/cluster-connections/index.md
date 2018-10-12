---
layout: layout.pug
navigationTitle: 群集连接
title: 群集连接
menuWeight: 3
excerpt: 连接到多个 DC/OS 群集
enterprise: false

---

使用 [dcos cluster] (/1.11/cli/command-reference/dcos-cluster) 命令连接到多个 DC/OS 群集。

`dcos cluster` 命令有子命令，用于设置连接并附加到群集以及重命名和删除群集。

## 设置与群集的连接

设置与群集的连接以在文件 `<home-directory>/.dcos/clusters/<cluster_id>/dcos.toml`中存储连接配置，附加到群集并对 DC/OS 进行身份认证。附加到群集设置其为活动群集。

要设置群集连接，运行 `dcos cluster setup` 命令，使用群集 URL 替换 `<dcos-url>` ：

```bash
dcos cluster setup <dcos-url>
```

## 附加到群集

要附加到连接的群集，运行 `dcos cluster attach` 命令，使用群集名称替换 `<name>”：

```bash
dcos cluster attach <connected-cluster-name>
```

## 查看已连接的群集

要查看所有连接的群集，运行 `dcos cluster list` 命令。该命令列出群集名称、群集 ID、状态、DC/OS 版本（如果群集可达）和管理节点的 URL。附加的群集的群集名称旁有星号（`*`）。

状态可具有以下值：

- 可用：群集在本地设置，且可访问
- 不可用：群集在本地设置，且无法访问
- 未配置：群集不在本地设置（即，群集被 [链接](/1.11/administering-clusters/multiple-clusters/cluster-links)至当前附加的群集上）。

在本示例中，附加名为 `dcosdev` 的群集：

```bash
  NAME                   CLUSTER ID                 STATUS       VERSION                     URL
dcosprod     5f7fb957-6daf-446e-8689-0b5b476b2d39  UNAVAILABLE   1.11.0    https://dcosclus-eosy.us-west-2.elb.amazonaws.com
dcosdev*     cf96739f-f800-42ea-95d7-d60acc689194  AVAILABLE     1.11.0    https://dcosclus-5m65.us-west-2.elb.amazonaws.com
```

要仅查看附加的群集，运行 `dcos cluster list --attached` 命令。

## 重命名群集

您可以重命名连接的群集：使用`dcos cluster rename <name> <new-name>` command. For example, to rename your cluster from `dcosdev` to `dcoslive`:

```bash
dcos cluster rename dcosdev dcoslive
```

**备注：** 此命令仅在本地重命名群集。服务器上的实际群集名称未更改。

## 删除群集

您可以删除连接的群集：`dcos cluster remove <name>` command. For example, to remove the cluster `dcosdev`:

```bash
dcos cluster remove dcosdev
```

如果删除附加的群集，执行在群集上安装包之类操作的 dcos 命令可能失败，直到您附加另一个连接的群集为止。
