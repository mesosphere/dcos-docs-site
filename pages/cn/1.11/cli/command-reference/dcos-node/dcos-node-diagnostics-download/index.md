---
layout: layout.pug
navigationTitle: dcos node diagnostics download
title: dcos node diagnostics download
menuWeight: 3
excerpt: 下载诊断捆绑包

enterprise: false
---



# 说明
`dcos node diagnostics download` 命令让您将诊断捆绑包下载到特定位置。

# 使用

```bash
dcos node diagnostics download <bundle> [OPTION]
```

# 选项

| 名称，简写 | 默认值 | 说明 |
|---------|-------------|-------------|
| `--location=<location>` | 当前目录 | 将诊断捆绑包下载到特定位置。如果未设置，则默认位置是您当前的工作目录。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<bundle>`   |  The bundle filename. For example, `bundle-2017-02-01T00:33:48-110930856.zip`. |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.11/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|


