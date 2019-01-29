---
layout: layout.pug
navigationTitle: dcos node diagnostics
title: dcos node diagnostics
menuWeight: 2
excerpt: 显示诊断捆绑包的详细信息

enterprise: false
---

    
# 说明
`dcos node diagnostics` 命令让您查看诊断捆绑包的详细信息。

# 使用

```bash
dcos node diagnostics [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--cancel` | 取消正在运行的诊断工作。|
| `--list` | 列出可用的诊断捆绑包。|
| `--json` | 显示 JSON 格式的数据。|
| `--status` | 显示诊断工作状态。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

