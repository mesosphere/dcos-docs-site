---
layout: layout.pug
navigationTitle: dcos cluster attach
title: dcos cluster attach
menuWeight: 2
excerpt: 将 CLI 附加到已连接或链接的群集

enterprise: false
---

# 说明
`dcos cluster attach` 命令允许您将 CLI 附加到已连接或 [链接](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-link/) 的群集。当您运行 [`dcos cluster setup`](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup) 命令时，群集自动被附加。

# 使用

```bash
dcos cluster attach [<connected-cluster-name> | <linked-cluster-name> | <connected-cluster-id> | <linked-cluster-id>]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<connected-cluster-name>` | 已连接的群集的名称。 |
| `<linked-cluster-name>` | 已链接的群集的名称。 |
| `<connected-cluster-id>` | 已连接的群集的 ID。 |
| `<linked-cluster-id>` | 已链接的群集的 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster]](/1.11/cli/command-reference/dcos-cluster/) | 管理与 DC/OS 群集的连接。 |

# 示例
有关示例，请参阅 [群集连接](/1.11/administering-clusters/multiple-clusters/cluster-connections/) 和 [群集链接](/1.11/administering-clusters/multiple-clusters/cluster-links/)。
