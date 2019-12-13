---
layout: layout.pug
navigationTitle: dcos marathon app stop
title: dcos marathon app stop
menuWeight: 8
excerpt: 停止应用程序

enterprise: false
---


# 说明
`dcos marathon app stop` 命令让您停止应用程序。

# 使用

```bash
dcos marathon app stop <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|
| `--instances` | 实例数量。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |   应用程序ID。 您可以使用以下命令查看应用程序ID列表 `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


