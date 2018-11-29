---
layout: layout.pug
navigationTitle: dcos marathon app kill
title: dcos marathon app kill
menuWeight: 2
excerpt: 终止活动应用程序实例

enterprise: false
---


# 说明
`dcos marathon app kill` 命令允许您终止正在运行的应用程序实例。

# 使用

```bash
dcos marathon app kill <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--host=<host>` | 正在运行应用程序的主机名。|
| `--scale` | 执行操作后缩小应用程序。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |   The application ID. You can view a list of the application IDs with the `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

