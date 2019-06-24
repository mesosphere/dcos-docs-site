---
layout: layout.pug
navigationTitle:  dcos marathon app kill
title: dcos marathon app kill
menuWeight: 2
excerpt: 终止活动应用程序实例
enterprise: false
---


# 说明

`dcos marathon app kill` 命令让您可以终止正在运行的应用程序实例。

# 使用

```bash
dcos marathon app kill [--scale] [--host=<host>] <app-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |
| `--host=<host>` | 正在运行应用程序的主机名。|
| `--scale` | 执行操作后缩小应用程序。|

# 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|



# 示例

```bash
dcos marathon app kill kafka
Killed tasks: []
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|