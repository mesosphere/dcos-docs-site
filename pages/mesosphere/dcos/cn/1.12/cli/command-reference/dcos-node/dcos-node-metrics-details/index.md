---
layout: layout.pug
navigationTitle:  dcos node metrics details
title: dcos node metrics details
menuWeight: 10
excerpt: 显示 Mesos 代理节点的详细信息
enterprise: false
---

# 说明

`dcos node metrics details` 命令打印一张表格，显示 <mesos-id> 指定的代理节点的所有度量标准。

# 使用

```
dcos node metrics details <mesos-id>  [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |
| `--json` | 显示 JSON 格式的数据。|
| `--mesos-id=<mesos-id>` | 节点的代理 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|


