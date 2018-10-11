---
layout: layout.pug
navigationTitle: dcos cluster unlink
title: dcos cluster unlink
menuWeight: 8
excerpt: 取消另一个群集对一个群集的链接
enterprise: true
---

# 说明
`dcos cluster unlink` 命令允许您取消另一个群集对一个群集的链接。

# 使用

```bash
dcos cluster unlink [<linked-cluster-name> | <linked-cluster-id> ]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<linked-cluster-name>` | 已链接的群集的 ID。 |
| `<linked-cluster-id>` | 已链接的群集的 ID。 |

**注意：** 如果群集链接成功，则控制台没有输出。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |

# 示例
有关示例，请参阅 [群集链接](/1.11/administering-clusters/multiple-clusters/cluster-links/)。
