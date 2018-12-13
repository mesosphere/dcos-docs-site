---
layout: layout.pug
navigationTitle: dcos task log
title: dcos task log
menuWeight: 1
excerpt: 显示任务日志

enterprise: false
---


# 说明
`dcos task log` 命令将显示任务日志。

# 使用

```bash
dcos task log <task> <file> [OPTION]
```

# 选项

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `--completed` | | 显示已完成和正在进行的任务。|
| `--follow` | | 动态更新日志。|
| `--lines=N` | 10 | 显示最后 N 行。|

# 位置自变量

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `<task>` | | 完整任务 ID，部分任务 ID 或正则表达式。|
| `<file>`   |  `stdout` | 指定要显示的沙盒文件。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/cn/1.11/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|

# 示例

有关示例，请参阅[文档](/cn/1.11/monitoring/logging/)。
