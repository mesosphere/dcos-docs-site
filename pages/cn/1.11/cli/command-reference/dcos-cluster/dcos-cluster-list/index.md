---
layout: layout.pug
navigationTitle: dcos cluster list
title: dcos cluster list
menuWeight: 4
excerpt: 列出连接到 DC/OS CLI 的集群

enterprise: false
---

# 说明
`dcos-cluster list` 命令让您列出连接到 DC/OS CLI 的集群。

# 使用

```bash
dcos cluster list [--attached --json]
```

# 选项

| 名称、简写 | D 描述 |
|---------|-------------|
| | `--attached` | 仅附加的集群。 |
| | `--json` | 显示以 JSON 为格式的列表。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/cn/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 集群。 |

# 示例
有关示例，请参阅 [集群连接](/cn/1.11/administering-clusters/multiple-clusters/cluster-connections/)。
