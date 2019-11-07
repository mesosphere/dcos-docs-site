---
layout: layout.pug
navigationTitle:  dcos quota create
title: dcos quota create
menuWeight: 1
excerpt: 创建配额
render: mustache
model：/mesosphere/dcos/2.0/data.yml
enterprise: false
---


# 说明

`dcos quota create` 命令允许您创建新配额。

# 使用

```bash
dcos quota create <group> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--cpu`     | 配额限制的 CPU 数。 |
| `--disk`     | 配额限制的磁盘数（在 MiB 中）。 |
| `--force` | 强制配额创建。 |
| `--gpu`     | 配额限制的 GPU 数。 |
| | `--help, h` | 打印使用。|
| `--mem`     | 配额限制的内存量（在 MiB 中）。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos quota](/mesosphere/dcos/2.0/cli/command-reference/dcos-quota/)   | 管理 DC/OS 配额。 |
