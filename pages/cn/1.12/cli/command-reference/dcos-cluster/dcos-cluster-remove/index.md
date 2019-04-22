---
layout: layout.pug
navigationTitle:  dcos cluster remove
title: dcos cluster remove
menuWeight: 4
excerpt: 从 DC/OS CLI 中删除连接的群集
enterprise: false
---

# 说明
`dcos-cluster remove` 命令将从 DC/OS CLI 中删除配置的群集。必须传递一个群集名称或其中一个 `--all`/ `--unavailable` 选项。

# 使用

```bash
  dcos cluster remove <cluster> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--all` | 删除所有群集。 |
| `-h`，`--help` | `remove` 命令帮助。 |
| ` --unavailable` | 删除不可用群集。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<name>` | 群集名称 |


# 示例

1. 运行 `dcos cluster list` 命令，获取要删除的群集名称：

    ```
    dcos cluster list
              NAME                          ID                     STATUS     VERSION                                         URL                                          
        user_81-rd373u5  bb07074e-2c3d-4dc5-8523-75cab9d517cb  UNAVAILABLE  UNKNOWN  http://user_81-elasticl-7qbh2zcfyz6h-407934734.us-east-1.elb.amazonaws.com        
    *  user_45-wosq2gi     7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE    1.12.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com  
    ```

1. 运行含有要删除群集名称的 `dcos cluster remove` 命令。在本示例中，我们将删除名为“user_81-rd373u5”的群集：

    ```
    dcos cluster remove user_81-rd373u5
    ```
 如果命令成功完成，将无确认消息。

1. 要确认已删除群集，请再次运行 `dcos cluster list`：

    ```
    dcos cluster list
            NAME                        ID                    STATUS    VERSION                                         URL                                          
    *  user_45-wosq2gi     7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE    1.12.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com
    ```


如需更多示例，请参阅 [群集连接](/1.12/administering-clusters/multiple-clusters/cluster-connections/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) | 管理您的 DC/OS 群集 