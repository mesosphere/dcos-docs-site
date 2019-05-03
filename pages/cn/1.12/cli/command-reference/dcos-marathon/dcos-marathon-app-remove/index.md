---
layout: layout.pug
navigationTitle:  dcos marathon app remove
title: dcos marathon app remove
menuWeight: 4
excerpt: 删除应用程序
enterprise: false
---


# 说明

`dcos marathon app remove` 命令让您可以删除应用程序。

# 使用

```bash
dcos marathon app remove [--force] <app-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |
| `--force` | 在更新期间禁用 Marathon 中的检查。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<app-id>` | 应用程序 ID。您可以使用 `dcos marathon app list` 命令查看应用程序 ID 列表。|




# 示例

请注意，在以下示例中，`remove` 操作成功后不会显示任何输出信息。要确认 `remove` 操作是否成功，请运行 `dcos marathon app list`。


```bash
$ dcos marathon app list
ID             MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/datastax-dse  1024   1     1/1    1/1       ---      False       N/A     export...      
/spark         1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh  
~$ dcos marathon app remove datastax-dse
~$ dcos marathon app list
ID      MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/spark  1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh  
```

您还可以使用 `--force` 选项禁用 Marathon 检查：

```bash
~$ dcos marathon app list
ID           MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/cassandra   1024   1     1/1    1/1       ---      False       N/A     export...      
/kafka       1024   1     0/0    0/0       ---      False       N/A     export...      
/kubernetes  1024   1     0/1    0/0      scale     True        N/A     export...      
/spark       1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh  
~$ dcos marathon app remove --force kafka
~$ dcos marathon app list
ID           MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/cassandra   1024   1     1/1    1/1       ---      False       N/A     export...      
/kubernetes  1024   1     0/1    0/0      scale     True        N/A     export...      
/spark       1024   1     1/1    1/1       ---      False      DOCKER   /sbin/init.sh  
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|