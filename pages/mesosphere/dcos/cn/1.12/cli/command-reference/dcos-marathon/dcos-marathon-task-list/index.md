---
layout: layout.pug
navigationTitle:  dcos marathon task list
title: dcos marathon task list
menuWeight: 29
excerpt: 显示所有任务
enterprise: false
---


# 说明
`dcos marathon task list` 命令显示所有任务的列表。

# 使用

```bash
dcos marathon task list [--json|--quiet] [<app-id>]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|
| `-q`，`--quiet` | 仅显示列表的 ID。 |
| `-h`，`--help` | 显示有关此命令用法的信息。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


