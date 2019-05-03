---
layout: layout.pug
navigationTitle:  dcos node log
title: dcos node log
menuWeight: 9
excerpt: 显示节点的 Mesos 日志

enterprise: false
---


# 说明
`dcos node log` 命令显示主导管理节点、代理节点或两者的 Mesos 日志。

# 使用

```bash
dcos node log [--follow --lines=N --leader --mesos-id=<mesos-id>]  [--component=<component-name> --filter=<filter>...]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--help, h` | | 显示用法。 |
| `--leader` | | 主管理节点。|
| `--follow` | | 动态更新日志。|
| `--lines=N` | 10 | 显示最后 N 行。|
| `--mesos-id=<mesos-id>` | | 节点的代理 ID。|
| `--component=<component-name>` | | 显示 DC/OS 组件日志。|
| `--filter=<filter>` | | 按字段和值筛选日志。筛选器必须是以冒号分隔的字符串。例如：`--filter _PID:0 --filter _UID:1`。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|
