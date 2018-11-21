---
layout: layout.pug
navigationTitle: dcos
title: dcos
menuWeight: 0
excerpt: 管理 DC/OS 环境变量
enterprise: false
---

# 说明
`dcos` 命令让您管理 DC/OS 环境变量。

# 使用

``` bash
dcos [options] [<command>] [<args>...]
```

# 选项

表 1. 选项

| 名称 | 说明 |
|---------|-------------|-------------|
| | `--debug` | 启用调试模式。|
| | `--help, h` | 显示使用情况。|
| `--log-level=<log-level>`  | Set the logging level. This setting does not affect the output sent to `stdout`. |
| | `--version, v` | 显示版本信息。 |
| `<log-level>` | 严重性等级如表 2 所示。|

表 2. `log-level` 严重性等级

| 名称 | 说明 |
|---------|-------------|
| debug | 显示所有消息。|
| info | 显示信息性、警告、错误和关键消息。|
| warning | 显示警告、错误和关键消息。|
| error | 显示错误和关键消息。 |
| critical | 仅显示关键消息 `stderr`. |
