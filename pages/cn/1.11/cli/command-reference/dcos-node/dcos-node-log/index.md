---
layout: layout.pug
navigationTitle: dcos node log
title: dcos node log
menuWeight: 5
excerpt: 显示节点的 Mesos 日志

enterprise: false
---


# 说明
`dcos nod log` 命令显示主导管理节点的 Mesos 日志、代理节点的 Mesos 日志，或两者的 Mesos 日志。

# 使用

```bash
dcos node log [OPTION]
```

# 选项

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `--leader` | | 主导的管理节点。|
| `--follow` | | 动态更新日志。|
| `--lines=N` | 10 | 显示最后 N 行。|
| `--master` | | 此选项已弃用，并替换为 `--leader`。|
| `--mesos-id=<mesos-id>` | 节点的代理 ID。|
| `--slave=<agent-id>`   |             | This option is deprecated and is replaced by `--mesos-id`. |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|


