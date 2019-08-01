---
layout: layout.pug
navigationTitle:  dcos marathon group update
title: dcos marathon group update
menuWeight: 22
excerpt: 更新 Marathon 组属性
enterprise: false
---


# 说明

`dcos marathon group update` 命令让您可以更新 Marathon 组属性。

# 使用

```bash
dcos marathon group update [--force] <group-id> [<properties>...]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--force` | 在更新期间禁用 Marathon 中的检查。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<group-id>` | 组 ID。您可以使用 `dcos marathon group list` 命令查看组 ID 列表。|
| `<properties>` | 一个或多个 JSON 对象属性的列表，以空格分开。列表必须以 `<key>=<value>` 为格式。例如， `cpus=2.0 mem=308`。如果省略，则从 stdin 上提供的 JSON 对象读取属性。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

