---
layout: layout.pug
navigationTitle: dcos cluster remove
title: dcos cluster remove
menuWeight: 5
excerpt: 从 DC/OS CLI 中删除连接的集群


enterprise: false
---

# 说明
`dcos-cluster remove` 命令允许您从 DC/OS CLI 中删除连接的集群。

# 使用

```bash
dcos cluster remove [<cluster-name> | <cluster-id> | --all]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<cluster-name>` | 已连接的集群的名称。 |
| `<cluster-id>` | 已连接的集群的 ID。 |
# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/cn/1.11/cli/command-reference/dcos-cluster/) | 管理您的 DC/OS 集群。|

# 示例
有关示例，请参阅 [集群连接](/cn/1.11/administering-clusters/multiple-clusters/cluster-connections/)。
