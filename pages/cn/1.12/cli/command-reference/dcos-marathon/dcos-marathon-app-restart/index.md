---
layout: layout.pug
navigationTitle:  dcos marathon app restart
title: dcos marathon app restart
menuWeight: 5
excerpt: 重新启动应用程序
enterprise: false
---


# 说明

`dcos marathon app restart` 命令让您可以重新启动应用程序。

# 使用

```bash
dcos marathon app restart [--force] <app-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |
| `--force` | 在更新期间禁用 Marathon 中的检查。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


