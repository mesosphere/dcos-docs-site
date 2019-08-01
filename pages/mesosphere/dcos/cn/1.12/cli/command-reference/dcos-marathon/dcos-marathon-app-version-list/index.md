---
layout: layout.pug
navigationTitle:  dcos marathon app version list
title: dcos marathon app version list
menuWeight: 10
excerpt: 显示应用程序的版本历史记录

enterprise: false
---


# 说明

`dcos marathon app version list` 命令让您列出应用程序的版本历史记录。

# 使用

```bash
dcos marathon app version list [--max-count=<max-count>] <app-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--max-count=<max-count>` | 获取和返回的最大条目数。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


