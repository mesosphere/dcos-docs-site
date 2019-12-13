---
layout: layout.pug
navigationTitle: dcos marathon task show
title: dcos marathon task show
menuWeight: 30
excerpt: 显示特定任务的信息

enterprise: false
---


# 说明
`dcos marathon task show` 命令让您列出特定任务。

# 使用

```bash
dcos marathon task show <task-id> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<task-id>`   |  任务ID。 您可以使用以下命令查看任务ID列表 `dcos marathon task list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


