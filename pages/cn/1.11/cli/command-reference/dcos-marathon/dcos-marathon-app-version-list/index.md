---
layout: layout.pug
navigationTitle: dcos marathon app version list
title: dcos marathon app version list
menuWeight: 10
excerpt: 显示应用程序的版本历史记录

enterprise: false
---


# 说明
`dcos marathon app version list` 命令列出应用程序的版本历史记录。

# 使用

```bash
dcos marathon app version list <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--max-count=<max-count>` | 获取和返回的最大条目数。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


