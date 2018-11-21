---
layout: layout.pug
navigationTitle: dcos task exec
title: dcos task exec
menuWeight: 0
excerpt: 在任务容器内部启动进程

enterprise: false
---

# 说明
`dcos task exec` 命令让您在<cmd>`) inside of a task's (`<task>容器（‘’）启动进程 。

# 使用

```bash
dcos task exec [--interactive --tty] <task> <cmd> [<args>...]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--interactive, -i` | 将 STDIN 流连接到远程命令以进行交互式会话。|
| `--tty, -t` | 将 TTY 与远程流连接。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<args>`   |  Additional arguments to pass to the command (`<cmd>`). |
| `<cmd>`   |  The command to run inside the remote task's container. For example: `/bin/bash`. |
| `<task>` | 完整任务 ID，部分任务 ID 或正则表达式。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/cn/1.11/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。| 

# 示例

有关示例，请参阅调试[文档](/cn/1.11/monitoring/debugging/)。
