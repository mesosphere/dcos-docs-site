---
layout: layout.pug
navigationTitle: dcos task exec
title: dcos task exec
menuWeight: 0
excerpt: 在任务容器内部启动进程

enterprise: false
---

# 说明
`dcos task exec` 命令允许您在任务 (<task><cmd>`) inside of a task's (`<task>)  容器内部启动进程 (<cmd>)。

# 使用

```bash
dcos task exec [--interactive --tty] <task> <cmd> [<args>...]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--interactive, -i` | 将 STDIN 流与到远程命令连接以进行交互式会话。|
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
| [dcos task](/1.11/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。| 

# 示例

有关示例，请参阅调试[文档](/1.11/monitoring/debugging/)。
