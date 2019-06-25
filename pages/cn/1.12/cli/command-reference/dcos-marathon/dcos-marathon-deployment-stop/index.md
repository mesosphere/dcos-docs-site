---
layout: layout.pug
navigationTitle:  dcos marathon deployment stop
title: dcos marathon deployment stop
menuWeight: 16
excerpt: 取消正在进行的应用程序部署
enterprise: false
---


# 说明

`dcos marathon deployment stop` 命令让您可以取消正在进行的应用程序部署。

# 使用

```bash
dcos marathon deployment stop <deployment-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<deployment-id>` | 部署 ID。您可以使用 `dcos marathon deployment list` 命令查看部署 ID 列表。 |




# 示例

在以下示例中，我们将首先运行 `dcos marathon deployment list` 以获取部署 ID，再用它们运行带有 `deployment-id` 的 `dcos marathon deployment stop` 以停止部署。系统不提供任何确认输出信息，因此我们再次运行 `dcos marathon deployment list` 以确认部署是否已停止。

```bash
dcos marathon deployment list
APP                   POD  ACTION  PROGRESS  ID                                    
/confluent-zookeeper  -    scale     1/2     09db9c92-5662-4613-bff1-d20c3c876466  
dcos marathon deployment stop 09db9c92-5662-4613-bff1-d20c3c876466 
dcos marathon deployment list
There are no deployments
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|