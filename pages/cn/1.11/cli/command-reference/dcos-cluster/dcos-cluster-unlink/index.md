---
layout: layout.pug
navigationTitle: dcos cluster unlink
title: dcos cluster unlink
menuWeight: 8
excerpt: 取消一个集群和另一个集群的链接
enterprise: true
---

# 说明
`dcos cluster unlink` 命令允许您取消一个集群和另一个集群的链接。

# 使用

```bash
dcos cluster unlink [<linked-cluster-name> | <linked-cluster-id> ]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<linked-cluster-name>` | 已链接的集群的 ID。 |
| `<linked-cluster-id>` | 已链接的集群的 ID。 |

**注意：** 如果集群链接成功，则控制台没有输出。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/cn/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 集群。 |

# 示例
有关示例，请参阅 [集群链接](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。
