---
layout: layout.pug
navigationTitle:  dcos quota list
title: dcos quota list
menuWeight: 1
excerpt: 列出所有配额
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# 说明

`dcos quota list` 命令允许您列出群集上的所有组配额。

# 使用

```bash
dcos quota list [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| | `--help, h` | 打印使用。|
| `--json` | JSON 格式的列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos quota](/mesosphere/dcos/2.0/cli/command-reference/dcos-quota/)   | 管理 DC/OS 配额。 |
