---
layout: layout.pug
navigationTitle:  dcos task metrics details
title: dcos task metrics details
menuWeight: 9
excerpt: 显示指定任务的所有度量标准
enterprise: false
---

# 说明

`dcos task metrics details` 命令将显示一张表格，列出 `<task-id>` 指定任务的所有度量标准。

# 使用

```bash
dcos task metrics details <task-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `<task-id>` | 完整任务 ID、部分任务 ID 或 UNIX Shell 通配符模式（如“My-Task*”）。|
| `--json` | 打印 JSON 格式的任务列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|
