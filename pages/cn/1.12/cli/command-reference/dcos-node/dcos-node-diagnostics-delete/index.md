---
layout: layout.pug
navigationTitle:  dcos node diagnostics delete
title: dcos node diagnostics delete
menuWeight: 4
excerpt: 显示诊断捆绑包的详细信息
enterprise: false
---


# 说明
dcos 节点诊断删除命令让您可以查看诊断捆绑包的详细信息。

# 使用

```bash
dcos node diagnostics delete <bundle> 
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<bundle>` | 捆绑包文件名。例如， `bundle-2017-02-01T00:33:48-110930856.zip`。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

