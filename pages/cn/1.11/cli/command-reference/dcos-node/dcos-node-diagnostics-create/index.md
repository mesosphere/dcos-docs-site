---
layout: layout.pug
navigationTitle: dcos node diagnostics create
title: dcos node diagnostics create
menuWeight: 3
excerpt: 创建诊断捆绑包

enterprise: false
---



# 说明
`dcos node diagnostics create` 命令让您创建诊断捆绑包。

# 使用

```bash
dcos node diagnostics create <nodes> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|-------------|
| `<nodes>` | 在其上运行命令的节点。节点可以是以下任一项：IP 地址、主机名、Mesos ID、或关键词“all”、“masters”、“agent”。您必须对关键词使用引号。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

