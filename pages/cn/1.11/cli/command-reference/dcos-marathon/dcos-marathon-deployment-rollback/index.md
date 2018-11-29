---
layout: layout.pug
navigationTitle: dcos marathon deployment rollback
title: dcos marathon deployment rollback
menuWeight: 15
excerpt: 删除部署的应用程序

enterprise: false
---

# 说明
`dcos marathon deployment rollback` 命令让您删除部署的应用程序。

# 使用

```bash
dcos marathon deployment rollback <deployment-id> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<deployment-id>`   |  The deployment ID. You can view a list of the application IDs with the `dcos marathon deployment list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

