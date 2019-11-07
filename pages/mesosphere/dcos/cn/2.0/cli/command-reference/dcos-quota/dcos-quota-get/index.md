---
layout: layout.pug
navigationTitle:  dcos quota get
title: dcos quota get
menuWeight: 1
excerpt: 获取配额
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# 说明

`dcos quota get` 命令允许您获取现有配额。

# 使用

```bash
dcos quota get <group> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| | `--help, h` | 打印使用。|
| `--json`   |   JSON 格式化结果。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos quota](/mesosphere/dcos/2.0/cli/command-reference/dcos-quota/)   | 管理 DC/OS 配额。 |
