---
layout: layout.pug
navigationTitle:  dcos node decommission
excerpt: 停用 DC/OS 节点
title: dcos node decommission
menuWeight: 1
---

# 说明

`dcos node decommission` 命令让您可以将代理程序标记为已消失。

# 使用

```bash
dcos node decommission <mesos-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |
| `--mesos-id=<mesos-id>` | 节点的代理 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|
