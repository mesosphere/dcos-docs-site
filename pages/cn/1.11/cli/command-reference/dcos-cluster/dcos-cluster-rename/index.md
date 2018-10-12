---
layout: layout.pug
navigationTitle: dcos cluster rename
title: dcos cluster rename
menuWeight: 6
excerpt: 重命名群集

enterprise: false
---

# 说明
`dcos cluster rename` 命令允许您重命名群集。

# 使用

```bash
dcos cluster rename <name> <new-name>
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<name>` | 已连接的群集的名称。 |
| `<new-name>` | 连接的群集的新名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/1.11/cli/command-reference/dcos-cluster/) | 管理您的 DC/OS 群集。|

# 示例
有关示例，请参阅 [群集连接](/1.11/administering-clusters/multiple-clusters/cluster-connections/)。
