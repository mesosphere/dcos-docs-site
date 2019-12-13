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

<p class="message--note"><strong>注意: </strong> 如果群集链接成功，则控制台没有输出。</p>

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster](/mesosphere/dcos/cn/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |

# 示例
有关示例，请参阅 [集群链接](/mesosphere/dcos/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。
