---
layout: layout.pug
navigationTitle: dcos marathon deployment watch
title: dcos marathon deployment watch
menuWeight: 16
excerpt: 监控应用程序部署

enterprise: false
---


# 说明
`dcos marathon deployment watch` 命令让您监控部署。

# 使用

```bash
dcos marathon deployment watch <deployment-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--interval=<interval>` | 操作之间等待的秒数。|
| `--max-count=<max-count>` | 获取和返回的最大条目数。|


# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<deployment-id>`   | The deployment ID. You can view a list of the deployment IDs with the `dcos marathon deployment list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

