---
layout: layout.pug
navigationTitle: dcos node list-components
title: dcos node list-components
menuWeight: 4
excerpt: 在指定节点上显示可用的 DC/OS 组件

enterprise: false
---

  
# 说明
`dcos node list-components` 命令在指定节点上显示可用的 DC/OS 组件列表。

# 使用

```bash
dcos node list-components [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|
| `--leader` | 主节点。|
| `--mesos-id=<mesos-id>` | 节点的代理 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|


