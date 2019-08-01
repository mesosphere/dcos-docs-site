---
layout: layout.pug
navigationTitle: dcos task
title: dcos task
menuWeight: 16
excerpt: 管理 DC/OS 任务

enterprise: false
---


# 说明
管理 DC/OS 任务。

# 使用

```bash
dcos task [OPTION]
```

# 选项

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `--completed` | | 打印已完成和正在进行的任务。|
| `--help, h` | | 打印用法。|
| `--info` | 打印该子命令的简短描述。|
| `--json` | | JSON 格式的数据。|
| `--version, v` | | 打印版本信息。|

# 位置自变量

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `<task>` | | 完整任务 ID，部分任务 ID 或正则表达式。|

# dcos task

```bash
Description:
    Manage DC/OS tasks.

Usage:
    dcos task --help
    dcos task --info
    dcos task log [--completed --follow --lines=N] [<task>] [<file>]
    dcos task ls [--long --completed] [<task>] [<path>]
    dcos task [--completed --json <task>]

Command:
    log
        Print the task log. By default, the 10 most recent task logs from stdout
        are printed.
    ls
        Print the list of files in the Mesos task sandbox.

Options:
    --completed
        Print completed and in-progress tasks.
    -h, --help
        Print usage.
    --info
        Print a short description of this subcommand.
    --follow
        Dynamically update the log.
    --json
        Print JSON-formatted list of tasks.
    --lines=N
        Print the last N lines. The default is 10 lines.
    --long
        Print full Mesos sandbox file attributes.
    --version
        Print version information.

Positional Arguments:
    <file>
        Specify the sandbox file to print. The default is stdout.
    <path>
        The Mesos sandbox directory path. The default is '.'.
    <task>
        A full task ID, a partial task ID, or a regular expression.
```

