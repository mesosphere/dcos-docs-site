---
layout: layout.pug
navigationTitle: dcos marathon group show
title: dcos marathon group show
menuWeight: 21
excerpt: 显示组列表

enterprise: false
---


# 说明
`dcos marathon group show` 命令显示组的详细列表。

# 使用

```bash
dcos marathon group show <group-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--group-version=<group-version>` | 该用于命令中的组版本。可以指定为绝对值或相对值。绝对值必须为 ISO8601 日期格式。相对值必须指定为负整数，它们表示当前部署的组定义中的版本。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<group-id>`   |  The group ID. You can view a list of the group IDs with the `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

