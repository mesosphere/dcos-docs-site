---
layout: layout.pug
navigationTitle:  dcos node deactivate
excerpt: 取消激活 DC/OS 节点
title: dcos node deactivate
menuWeight: 1
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
---

# 说明

`dcos node deactivate` 命令允许您取消激活 Mesos 代理节点。

# 使用

```bash
dcos node deactivate <mesos-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<mesos-id>` | 节点的代理 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/mesosphere/dcos/2.0/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|
