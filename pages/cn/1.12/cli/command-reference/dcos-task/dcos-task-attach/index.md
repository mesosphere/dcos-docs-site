---
layout: layout.pug
navigationTitle:  dcos task attach
title: dcos task attach
menuWeight: 1
excerpt: 在任务容器内部连接进程
enterprise: false
---

# 说明

`dcos task attach` 命令让您将 CLI 连接到已经运行任务的 `stdio`。

```bash
dcos task attach [--no-stdin] <task>
```

要从任务中断开，请键入序列 `CTRL-p CTRL-q`。

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--no-stdin` | 请勿将 CLI 的 `stdin` 连接到任务。 |

## 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<task>` | 完整任务 ID、部分任务 ID 或 UNIX Shell 通配符模式（如“My-Task*”）。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/cn/1.12/cli/command-reference/dcos-task/) | 管理 DC/OS 任务。|
