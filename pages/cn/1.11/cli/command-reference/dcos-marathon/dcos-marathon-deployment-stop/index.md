---
layout: layout.pug
navigationTitle: dcos marathon deployment stop
title: dcos marathon deployment stop
menuWeight: 16
excerpt: 取消正在进行的应用程序部署

enterprise: false
---


# 说明
`dcos marathon deployment stop` 命令让您取消正在进行的应用程序部署。

# 使用

```bash
dcos marathon deployment stop <deployment-id> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<deployment-id>`   |   部署ID。 您可以使用以下命令查看应用程序ID列表 `dcos marathon deployment list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|


