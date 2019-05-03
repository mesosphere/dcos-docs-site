---
layout: layout.pug
navigationTitle:  dcos marathon app stop
title: dcos marathon app stop
menuWeight: 8
excerpt: 停止应用程序

enterprise: false
---


# 说明

`dcos marathon app stop` 命令让您可以停止应用程序。

# 使用

```bash
dcos marathon app stop [--force] <app-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--force` | 在更新期间禁用 Marathon 中的检查。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|



# 示例

在以下示例中，我们首先运行 `dcos marathon app list`，获取当前部署的应用程序列表。运行命令 `dcos marathon app stop <app-id>` 后，系统返回部署编号。但是，要确认应用程序是否已经停止，请再次运行 `dcos marathon app list`。这次如果您看到 Kafka 应用程序显示零任务并无运行状况，即表示已停止。

```bash
~$ dcos marathon app list
ID      MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/kafka  1024   1     1/1    1/1       ---      False       N/A     export...      
/spark  1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh  
~$ dcos marathon app stop kafka
Created deployment e2c02572-a673-41b9-ad67-cf1b7c042a91
~$ dcos marathon app list
ID      MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/kafka  1024   1     0/0    0/0       ---      False       N/A     export...      
/spark  1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh  
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|