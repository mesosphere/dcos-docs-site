---
layout: layout.pug
navigationTitle:  dcos service log
title: dcos service log
menuWeight: 1
excerpt: 显示服务日志
enterprise: false
---

# 说明

`dcos service log` 命令显示服务日志。

<p class="message--important"><strong>重要信息：</strong>若要使用 <code>dcos service log marathon</code> 命令查看本地 DC/OS Marathon 日志，您必须位于同一网络上或者通过 VPN 连接到群集。如需更多信息，请参阅 <a href="/1.12/monitoring/logging/quickstart/">访问本地 DC/OS Marathon 日志</a>。</p>

# 使用

```bash
dcos service log [--follow --lines=N --ssh-config-file=<path> --user=<user>] <service> [<file>]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--follow` | | 在日志文件生成后打印数据。 |
| `--lines=N` | 10 | 显示最后 N 行。|
| `--ssh-config-file=<path>` | | SSH 配置文件的路径。这用于访问 Marathon 日志。|
| `--user=<user>` | 用户 ID。 | |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<file>` | Mesos 沙盒的服务日志文件名。默认为 `stdout`。|
| `<service>` | DC/OS 服务名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos service](/cn/1.12/cli/command-reference/dcos-service/) | 管理 DC/OS 服务。|
