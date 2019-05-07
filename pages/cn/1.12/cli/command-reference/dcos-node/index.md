---
layout: layout.pug
navigationTitle:  dcos node
title: dcos node
menuWeight: 11
excerpt: 显示 DC/OS 节点信息
enterprise: false
---


# 说明
`dcos node` 命令让您可以查看 DC/OS 节点信息。

# 使用

```bash
dcos node [OPTION]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |
| `--info` | 显示该子命令的简短描述。|
| `--json` | 显示 JSON 格式的数据。|
| `--version` | 显示版本信息。|


# 示例

```bash
dcos node 
   HOSTNAME        IP                         ID                    TYPE                 REGION          ZONE       
  10.0.2.221   10.0.2.221  02b1bdc8-2bac-44a0-81ff-65816936b97b-S1  agent            aws/us-west-2  aws/us-west-2a  
  10.0.5.54    10.0.5.54   02b1bdc8-2bac-44a0-81ff-65816936b97b-S0  agent            aws/us-west-2  aws/us-west-2a  
master.mesos.  10.0.6.122    02b1bdc8-2bac-44a0-81ff-65816936b97b   master (leader)  aws/us-west-2  aws/us-west-2a  
```

# 命令

