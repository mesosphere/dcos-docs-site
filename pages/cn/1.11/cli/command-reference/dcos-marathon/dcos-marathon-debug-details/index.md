---
layout: layout.pug
navigationTitle: dcos marathon debug details
title: dcos marathon debug details
menuWeight: 11
excerpt: 显示 Marathon 应用程序的调试信息

enterprise: false
---


# 说明
`dcos marathon app debug details` 命令让您查看正在等待的 Marathon 应用程序部署的调试信息。

# 使用

```bash
dcos marathon debug details <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon group list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


