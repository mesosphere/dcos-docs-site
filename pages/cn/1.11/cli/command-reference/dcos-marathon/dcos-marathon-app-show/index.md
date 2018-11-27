---
layout: layout.pug
navigationTitle: dcos marathon app show
title: dcos marathon app show
menuWeight: 6
excerpt: 查看在 DC/OS 上运行的应用程序

enterprise: false
---

# 说明
dcos marathon app show 命令让您查看在 DC/OS 上运行的应用程序的详细信息。

# 使用

```bash
dcos marathon app show <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--app-version=<app-version>` | 使用的应用程序版本。可以指定为绝对值或相对值。绝对值必须为 ISO8601 日期格式。相对值必须指定为负整数，它们表示当前部署的应用定义中的版本。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


