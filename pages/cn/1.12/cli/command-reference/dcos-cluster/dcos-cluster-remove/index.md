---
layout: layout.pug
navigationTitle: dcos cluster remove
title: dcos cluster remove
menuWeight: 5
excerpt: 从 DC/OS CLI 中删除连接的群集


enterprise: false
---

# 说明
`dcos-cluster remove` 命令允许您从 DC/OS CLI 中删除连接的群集。

# 使用

```bash
dcos cluster remove [<cluster-name> | <cluster-id> | --all]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<cluster-name>` | 已连接的群集的名称。 |
| `<cluster-id>` | 已连接的群集的 ID。 |
# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/1.11/cli/command-reference/dcos-cluster/) | 管理您的 DC/OS 群集。|

# 示例
有关示例，请参阅 [群集连接](/1.11/administering-clusters/multiple-clusters/cluster-connections/)。
