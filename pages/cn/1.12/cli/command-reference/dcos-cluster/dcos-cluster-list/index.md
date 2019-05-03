---
layout: layout.pug
navigationTitle:  dcos cluster list
title: dcos cluster list
menuWeight: 3
excerpt: 列出已连接的群集
enterprise: false
---

# 说明
`dcos-cluster list` 命令将列出已配置的群集以及已连接到当前群集的群集。

# 使用

```bash
dcos cluster list [flags]
```



# 选项

| 名称 | 说明 |
|---------|-------------|
| `--attached` | 仅返回已连接的集群。 |
| `--json` | 显示 JSON 格式的列表。|
| `-h`，`--help` | 显示此命令的帮助。 |



# 示例

```
dcos cluster list
      NAME                    CLUSTER ID                  STATUS    VERSION           URL            
MyCluster  00548eb6-9626-47d8-9076-d57b56752225  AVAILABLE    1.12    https://100.220.241.100 
```

```
dcos cluster list --attached
          NAME                        ID                    STATUS    VERSION                                         URL                                          
  *  user_45-wosq2gi  7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE  1.12.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com 
```

```json
dcos cluster list --json
[
    {
        "attached": false,
        "cluster_id": "bb07074e-2c3d-4dc5-8523-75cab9d517cb",
        "name": "user_84-rd373u5",
        "status": "UNAVAILABLE",
        "url": "http://user_84-elasticl-7qbh2zcfyz6h-407934734.us-east-1.elb.amazonaws.com",
        "version": "UNKNOWN"
    },
    {
        "attached": true,
        "cluster_id": "7edd47b7-7f22-4bd5-b8a9-b53a204aafd3",
        "name": "user_45-wosq2gi",
        "status": "AVAILABLE",
        "url": "https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com",
        "version": "1.12.0"
    }
]
```

如需更多示例，请参阅 [群集连接](/cn/1.12/administering-clusters/multiple-clusters/cluster-connections/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster](/cn/1.12/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |