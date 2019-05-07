---
layout: layout.pug
navigationTitle:  dcos marathon deployment list
title: dcos marathon deployment list
menuWeight: 14
excerpt: 显示当前部署的应用程序列表

enterprise: false
---


# 说明

`dcos marathon deployment list` 命令显示当前部署的应用程序列表。

# 使用

```bash
dcos marathon deployment list [--json|--quiet] [<app-id>]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--json` | 显示 JSON 格式的数据。|
| `-q`，`--quiet` | 仅显示列表的 ID。 |
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。|




# 示例

```bash
dcos marathon deployment list
APP          POD  ACTION  PROGRESS  ID                                    
/kubernetes  -    scale     1/2     e913f8a4-530c-438c-9f6e-709af1730c84  
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|