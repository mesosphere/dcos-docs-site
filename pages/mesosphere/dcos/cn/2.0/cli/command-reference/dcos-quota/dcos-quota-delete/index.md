---
layout: layout.pug
navigationTitle:  dcos quota delete
title: dcos quota delete
menuWeight: 1
excerpt: 删除配额
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# 说明

`dcos quota delete` 命令允许您删除现有配额。

# 使用

```bash
dcos quota delete <group> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 打印使用。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos quota](/mesosphere/dcos/2.0/cli/command-reference/dcos-quota/)   | 管理 DC/OS 配额。 |
