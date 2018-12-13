---
layout: layout.pug
navigationTitle: dcos marathon deployment list
title: dcos marathon deployment list
menuWeight: 14
excerpt: 显示当前部署的应用程序列表

enterprise: false
---


# 说明
`dcos marathon deployment list` 命令让您查看当前部署的应用程序列表。

# 使用

```bash
dcos marathon deployment list <app-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


