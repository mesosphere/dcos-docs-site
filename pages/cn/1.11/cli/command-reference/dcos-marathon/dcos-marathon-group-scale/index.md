---
layout: layout.pug
navigationTitle: dcos marathon group scale
title: dcos marathon group scale
menuWeight: 20
excerpt: 扩展组

enterprise: false
---


# 说明
`dcos marathon group scale` 命令让您扩展组。

# 使用

```bash
dcos marathon group scale <group-id> <scale-factor> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<group-id>`   |   The group ID. You can view a list of the group IDs with the `dcos marathon group list` 命令。|
| `<scale-factor>` | 应用程序组的扩展因数。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

