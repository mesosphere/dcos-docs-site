---
layout: layout.pug
navigationTitle:  dcos task metrics summary
title: dcos task metrics summary
menuWeight: 11
excerpt: 显示任务的主要度量标准 
enterprise: false
---

# 说明

`dcos task metrics summary` 将显示一张表格，列出 `<task-id>` 指定任务的主要度量标准。

# 使用

```
dcos task metrics summary <task-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `<task-id>` | 完整任务 ID、部分任务 ID 或 UNIX Shell 通配符模式（如“My-Task*”）。|
| `--json` | 打印 JSON 格式的任务列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/cn/1.12/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|
