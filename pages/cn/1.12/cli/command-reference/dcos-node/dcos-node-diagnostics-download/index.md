---
layout: layout.pug
navigationTitle:  dcos node diagnostics download
title: dcos node diagnostics download
menuWeight: 5
excerpt: 下载诊断捆绑包
enterprise: false
---



# 说明
`dcos node diagnostics download` 命令让您将诊断捆绑包下载到特定位置。

# 使用

```bash
dcos node diagnostics download <bundle> [--location=<location>]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--help, h` | | 显示用法。 |
| `--location=<location>` | 当前目录 | 将诊断捆绑包下载到特定位置。如果未设置，则默认位置是您当前的工作目录。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<bundle>` | 捆绑包文件名。例如， `bundle-2017-02-01T00:33:48-110930856.zip`。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|


