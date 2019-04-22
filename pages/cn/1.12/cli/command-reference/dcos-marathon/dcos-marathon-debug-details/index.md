---
layout: layout.pug
navigationTitle:  dcos marathon debug details
title: dcos marathon debug details
menuWeight: 11
excerpt: 显示 Marathon 应用程序的调试信息
enterprise: false
---


# 说明

`dcos marathon app debug details` 命令会显示队列实例启动的详细信息，用于调试。

# 使用

```bash
dcos marathon debug details <app-id> [--json]
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
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


