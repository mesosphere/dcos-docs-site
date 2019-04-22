---
layout: layout.pug
navigationTitle:  dcos marathon app list
title: dcos marathon app list
menuWeight: 3
excerpt: 显示所有已安装的应用程序
enterprise: false
---


# 说明

`dcos marathon app list` 将显示已安装应用程序的列表。

# 使用

```bash
dcos marathon app list [--json|--quiet]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help` | 显示此消息后退出。 |
| `--json` | 显示 JSON 格式的数据。|
| `-q`，`--quiet` | 仅显示列表的 ID。 |




# 示例

```bash
dcos marathon app list
ID             MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD            
/datastax-dse  1024   1     1/1    1/1       ---      False       N/A     export...    
/kafka         1024   1     1/1    1/1       ---      False       N/A     export...      
/spark         1024   1     0/1    0/0      scale     False      DOCKER   /sbin/init.sh  
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|