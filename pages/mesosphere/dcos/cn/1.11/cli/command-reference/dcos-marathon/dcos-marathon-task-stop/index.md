---
layout: layout.pug
navigationTitle: dcos marathon task stop
title: dcos marathon task stop
menuWeight: 31
excerpt: 停止任务

enterprise: false
---


# 说明
`dcos marathon task stop` 命令让您停止任务。

# 使用

```bash
dcos marathon task stop <task-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--wipe` | 清除持久数据。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<task-id>`   |    任务ID。 您可以使用以下命令查看任务ID列表 `dcos marathon task list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

