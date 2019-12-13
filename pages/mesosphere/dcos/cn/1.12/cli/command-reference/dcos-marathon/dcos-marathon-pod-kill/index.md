---
layout: layout.pug
navigationTitle:  dcos marathon pod kill
title: dcos marathon pod kill
menuWeight: 24
excerpt: 停止一个或多个正在运行的 pod 实例
enterprise: false
---

# 说明
`dcos marathon pod kill` 命令让您终止一个或多个正在运行的 pod 实例。

# 使用

```bash
dcos marathon pod kill <pod-id> [<instance-ids>...]
```
# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<instance-ids>` | 一个或多个 pod 实例 ID 的列表，以空格分隔。|
| `<pod-id>` | Pod ID。您可以使用 `dcos marathon pod list` 命令查看 pod ID 列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

