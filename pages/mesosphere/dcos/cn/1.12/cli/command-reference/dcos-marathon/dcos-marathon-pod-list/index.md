---
layout: layout.pug
navigationTitle:  dcos marathon pod list
title: dcos marathon pod list
menuWeight: 25
excerpt: 查看部署的 pod
enterprise: false
---

# 说明
`dcos marathon pod list` 命令显示已部署 pod 的列表。

# 使用

```bash
dcos marathon pod list [--json|--quiet]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|
| `-q`，`--quiet` | 仅显示列表的 ID。 |
| `-h`，`--help` | 显示有关此命令用法的信息。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

