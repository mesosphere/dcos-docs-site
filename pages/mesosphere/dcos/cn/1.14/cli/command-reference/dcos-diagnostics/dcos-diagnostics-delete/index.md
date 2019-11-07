---
layout: layout.pug
navigationTitle:  dcos diagnostics delete
title: dcos diagnostics delete
menuWeight: 4
excerpt: 删除捆绑包
enterprise: false
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---


# 说明
`dcos diagnostics delete` 命令允许您删除诊断捆绑包。

# 使用

```bash
dcos diagnostics delete <bundle-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<bundle-id>`   |   捆绑包 ID。例如， `a697769a-2d5d-4b2a-a2ec-055b9fe9eecf`。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos diagnostics](/mesosphere/dcos/1.14/cli/command-reference/dcos-diagnostics/) | 处理 DC/OS 诊断捆绑包 |

