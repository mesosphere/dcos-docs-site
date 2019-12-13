---
layout: layout.pug
navigationTitle:  dcos cluster rename
title: dcos cluster rename
menuWeight: 5
excerpt: 重命名群集
enterprise: false
---

# 说明
`dcos cluster rename` 命令将重命名配置的群集。

# 使用

```bash
dcos cluster rename <cluster> <name> [flags]
```

# 选项
| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 此命令的帮助。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<cluster>` | 已连接的群集的名称 |
| `<name>` | 连接的群集的新名称 |


# 示例
有关示例，请参阅 [群集连接](/mesosphere/dcos/cn/1.12/administering-clusters/multiple-clusters/cluster-connections/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-cluster/) | 管理您的 DC/OS 群集 |
