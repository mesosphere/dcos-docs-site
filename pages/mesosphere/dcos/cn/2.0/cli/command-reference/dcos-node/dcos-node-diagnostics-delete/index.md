---
layout: layout.pug
navigationTitle:  dcos node diagnostics delete
title: dcos node diagnostics delete
menuWeight: 4
excerpt: 显示诊断捆绑包的详细信息
enterprise: false
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---


# 说明
dcos 节点诊断删除命令允许您查看诊断捆绑包的详细信息。

**自 DC/OS 2.0 以来，此命令已弃用，请使用 `dcos diagnostics delete` 代替。**

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
| [dcos 节点](/mesosphere/dcos/2.0/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

