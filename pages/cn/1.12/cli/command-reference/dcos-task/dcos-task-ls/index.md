---
layout: layout.pug
navigationTitle:  dcos task ls
title: dcos task ls
menuWeight: 7
excerpt: 显示 Mesos 任务目录中的文件列表
enterprise: false
---

# 说明
`dcos task ls` 命令显示 Mesos 任务沙盒中的文件列表。

# 使用

```bash
dcos task ls [--all | --completed] [--long] [<task>] [<path>]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--all` | 打印已完成和正在进行的任务。|
| `--completed` | 显示已完成和正在进行的任务。|
| `--long` | 显示完整的 Mesos 沙盒文件属性。|

## 位置自变量

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `<task>` | | 完整任务 ID、部分任务 ID 或正则表达式。|
| `<path>` | `.` | Mesos 沙盒目录路径。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|
