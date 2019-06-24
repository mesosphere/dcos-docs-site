---
layout: layout.pug
navigationTitle:  dcos marathon task show
title: dcos marathon task show
menuWeight: 30
excerpt: 显示特定任务的信息
enterprise: false
---


# 说明
`dcos marathon task show` 命令可以让您列出特定任务。

# 使用

```bash
dcos marathon task show <task-id> 
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<task-id>` | 任务 ID。您可以使用 `dcos marathon task list` 命令查看任务 ID 列表。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


