---
layout: layout.pug
navigationTitle: dcos marathon debug summary
title: dcos marathon debug summary
menuWeight: 13
excerpt: 显示正在等待的 Marathon 应用程序部署的调试队列

enterprise: false
---


# 说明
`dcos marathon debug summary` 命令让您查看正在等待的 Marathon 应用程序部署的当前队列和调试信息。

# 使用

```bash
dcos marathon debug summary <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

有关此命令的更多信息，请参阅[监控部分](https://docs.mesosphere.com/1.11/monitoring/debugging/cli-debugging/#dcos-marathon-debug-summary)。
