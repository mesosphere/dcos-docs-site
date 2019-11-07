---
layout: layout.pug
navigationTitle:  dcos diagnostics download
title: dcos diagnostics download
menuWeight: 5
excerpt: 下载诊断捆绑包
enterprise: false
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
---



# 说明
`dcos diagnostics download` 命令允许您将诊断捆绑包下载到特定位置。

# 使用

```bash
dcos diagnostics download <bundle-id> [flags]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--help, -h` | | 显示用法。 |
| `--output=<location>`   |  ./<bundle-id>.zip |  将诊断捆绑包下载到特定位置。如果未设置，则默认位置是您当前的工作目录。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<bundle-id>`   |   捆绑包 ID。例如， `a697769a-2d5d-4b2a-a2ec-055b9fe9eecf`。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos diagnostics](/mesosphere/dcos/2.0/cli/command-reference/dcos-diagnostics/) | 处理 DC/OS 诊断捆绑包 |

