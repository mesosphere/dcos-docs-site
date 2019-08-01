---
layout: layout.pug
navigationTitle:  dcos marathon debug summary
title: dcos marathon debug summary
menuWeight: 13
excerpt: 显示正在等待的 Marathon 应用程序部署的调试队列
enterprise: false
---


# 说明
`dcos marathon debug summary` 命令显示队列实例启动的汇总信息，用于调试。

# 使用

```bash
dcos marathon debug summary <app-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--json` | 显示 JSON 格式的数据。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

