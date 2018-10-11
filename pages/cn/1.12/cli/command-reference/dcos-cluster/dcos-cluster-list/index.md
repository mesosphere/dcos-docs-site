---
layout: layout.pug
navigationTitle: dcos cluster list
title: dcos cluster list
menuWeight: 4
excerpt: 列出连接到 DC/OS CLI 的群集

enterprise: false
---

# 说明
`dcos-cluster list` 命令允许您列出连接到 DC/OS CLI 的群集。

# 使用

```bash
dcos cluster list [--attached --json]
```

# 选项

| 名称、简写 | D 描述 |
|---------|-------------|
| | `--attached` | 仅附加的群集。 |
| | `--json` | 显示 JSON 格式化列表。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |

# 示例
有关示例，请参阅 [群集连接](/1.11/administering-clusters/multiple-clusters/cluster-connections/)。
