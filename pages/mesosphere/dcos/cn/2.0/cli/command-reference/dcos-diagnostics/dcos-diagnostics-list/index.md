---
layout: layout.pug
navigationTitle:  dcos diagnostics list
title: dcos diagnostics list
menuWeight: 5
excerpt: 列出诊断包
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---



# 说明
`dcos diagnostics list` 命令允许您列出所有可用的诊断捆绑包。

# 使用

```bash
dcos diagnostics list [flags]
```

# 选项

| 名称 | 默认 | 说明 |
|---------|-------------|-------------|
| `--help, h` | | 显示用法。 |
| `--json`   |  |  以 JSON 格式打印列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos diagnostics](/mesosphere/dcos/2.0/cli/command-reference/dcos-diagnostics/) | 处理 DC/OS 诊断捆绑包 |

