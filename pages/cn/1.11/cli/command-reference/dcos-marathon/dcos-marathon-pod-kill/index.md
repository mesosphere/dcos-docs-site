---
layout: layout.pug
navigationTitle: dcos marathon pod kill
title: dcos marathon pod kill
menuWeight: 24
excerpt: 停止一个或多个正在运行的 pod 实例

enterprise: false
---

# 说明
`dcos marathon pod kill` 命令让您终止一个或多个正在运行的 pod 实例。

# 使用

```bash
dcos marathon pod kill <instance-ids> <pod-id> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<instance-ids>` | 一个或多个 pod 实例 ID 的列表，以空格分隔。|
| `<pod-id>`   |  The pod ID. You can view a list of the pod IDs with the `dcos marathon pod list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

