---
layout: layout.pug
navigationTitle:  dcos marathon deployment watch
title: dcos marathon deployment watch
menuWeight: 16
excerpt: 监控应用程序部署
enterprise: false
---


# 说明

`dcos marathon deployment watch` 命令让您可以监控部署。

# 使用

```bash
dcos marathon deployment watch [--max-count=<max-count>] [--interval=<interval>] <deployment-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--interval=<interval>` | 操作之间等待的秒数。|
| `--max-count=<max-count>` | 获取和返回的最大条目数。|
| `-h`，`--help` | 显示有关此命令用法的信息。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<deployment-id>` | 部署 ID。您可以使用 `dcos marathon deployment list` 命令查看部署 ID 列表。|


# 示例

`dcos marathon deployment watch` 命令不返回确认消息，因此请运行 `dcos marathon deployment list` 以查看部署状态。

```
dcos marathon deployment watch confluent-zookeeper
dcos marathon deployment list
APP                   POD  ACTION   PROGRESS  ID                                    
/confluent-zookeeper  -    restart    0/1     ec0f4f22-ed8c-4bc1-ad55-5854603e257a  
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|
