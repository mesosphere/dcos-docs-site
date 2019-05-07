---
layout: layout.pug
navigationTitle:  dcos node metrics summary
title: dcos node metrics summary
menuWeight: 11
excerpt: 汇总 Mesos 代理节点的详细信息
enterprise: false
---

# 说明

`dcos node metrics summary` 命令打印 <mesos-id> 指定的代理节点的 CPU、内存和磁盘度量标准。

# 使用

```
dcos node metrics summary <mesos-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |
| `--json` | 显示 JSON 格式的数据。|
| `<mesos-id>` | 代理节点的 ID 编号。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

