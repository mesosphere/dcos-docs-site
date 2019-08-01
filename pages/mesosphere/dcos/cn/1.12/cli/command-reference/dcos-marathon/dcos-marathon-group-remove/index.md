---
layout: layout.pug
navigationTitle:  dcos marathon group remove
title: dcos marathon group remove
menuWeight: 19
excerpt: 从 DC/OS 中删除 Marathon 应用程序

enterprise: false
---

# 说明

`dcos marathon group remove` 命令让您可以从 DC/OS 中删除应用程序。

# 使用

```bash
dcos marathon group remove [--force] <group-id>
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

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

