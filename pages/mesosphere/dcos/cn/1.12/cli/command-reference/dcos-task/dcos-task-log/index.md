---
layout: layout.pug
navigationTitle:  dcos task log
title: dcos task log
menuWeight: 5
excerpt: 显示任务日志
enterprise: false
---


# 说明
`dcos task log` 命令将显示任务日志。

# 使用

```bash
dcos task log [--all | --completed] [--follow --lines=N] [<task>] [<file>]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--completed` | | 显示已完成和正在进行的任务。|
| `--follow` | | 动态更新日志。|
| `--lines=N` | 10 | 显示最后 N 行。|

## 位置自变量

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `<task>` | | 完整任务 ID、部分任务 ID 或正则表达式。|
| `<file>` | `stdout` | 指定要打印的沙盒文件。默认为 `stdout`。|

日志文件参数应为相对于 Mesos 沙盒的路径。例如：

```
dcos task log [mesosID] /mnt/mesos/sandbox/exporter.log
```
将返回错误消息。相反，请使用以下格式：

```
dcos task log [mesosID] exporter.log
```

# 示例

有关示例，请参阅 [登录文档](/mesosphere/dcos/cn/1.12/monitoring/logging/)。


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|


