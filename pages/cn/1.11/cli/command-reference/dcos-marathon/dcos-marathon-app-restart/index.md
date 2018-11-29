---
layout: layout.pug
navigationTitle: dcos marathon app restart
title: dcos marathon app restart
menuWeight: 5
excerpt: 重新启动应用程序

enterprise: false
---


# 说明
`dcos marathon app restart` 命令允许您重新启动应用程序。

# 使用

```bash
dcos marathon app restart <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


