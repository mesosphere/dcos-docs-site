---
layout: layout.pug
navigationTitle:  dcos marathon app start
title: dcos marathon app start
menuWeight: 7
excerpt: 启动应用程序
enterprise: false
---


# 说明

`dcos marathon app start` 命令让您可以启动应用程序。

# 使用

```bash
dcos marathon app start [--force] <app-id> [<instances>]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|
| `-h`，`--help` | 显示有关此命令用法的信息。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|
| `--instances` | 实例数量。|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


