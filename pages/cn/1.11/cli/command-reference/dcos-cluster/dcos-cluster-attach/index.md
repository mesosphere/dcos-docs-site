---
layout: layout.pug
navigationTitle: dcos cluster attach
title: dcos cluster attach
menuWeight: 2
excerpt: 将 CLI 附加到已连接或链接的集群

enterprise: false
---

# 说明
`dcos cluster attach` 命令让您将 CLI 附加到已连接或 [链接](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-link/) 的集群。当您运行 [`dcos cluster setup`](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup/) 命令时，集群自动被附加。

# 使用

```bash
dcos cluster attach [<connected-cluster-name> | <linked-cluster-name> | <connected-cluster-id> | <linked-cluster-id>]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<connected-cluster-name>` | 已连接的集群的名称。 |
| `<linked-cluster-name>` | 已链接的集群的名称。 |
| `<connected-cluster-id>` | 已连接的集群的 ID。 |
| `<linked-cluster-id>` | 已链接的集群的 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/cn/1.11/cli/command-reference/dcos-cluster/) | 管理与 DC/OS 集群的连接。 |

# 示例
有关示例，请参阅 [集群连接](/cn/1.11/administering-clusters/multiple-clusters/cluster-connections/) 和 [集群链接](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。
