---
layout: layout.pug
navigationTitle:  dcos marathon group scale
title: dcos marathon group scale
menuWeight: 20
excerpt: 扩展组

enterprise: false
---


# 说明

`dcos marathon group scale` 命令让您可以扩展组。

# 使用

```bash
dcos marathon group scale [--force] <group-id> <scale-factor> 
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
| `<scale-factor>` | 扩展应用程序组的因素。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

