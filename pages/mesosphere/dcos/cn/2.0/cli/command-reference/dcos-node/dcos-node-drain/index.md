---
layout: layout.pug
navigationTitle:  dcos node drain
title: dcos node drain
menuWeight: 6
excerpt: 排空代理节点以使其任务得到重新安排
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
enterprise: false
---

# 说明

`dcos node drain` 命令允许您排空 Mesos 代理节点，以使其任务得到重新安排。

# 使用

```
dcos node drain <mesos-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--decommission`   |   在决定排空之后停用代理。 |
| `--help, h` | 显示用法。 |
| `--timeout`   |   执行请求超时。 |
| `--wait`   |   等待排空完成。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<mesos-id>` | 节点的代理 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/mesosphere/dcos/2.0/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

