---
layout: layout.pug
navigationTitle:  dcos cluster attach
title: dcos cluster attach
menuWeight: 2
excerpt: 将 CLI 附加到已连接或链接的群集
enterprise: false
---

# 说明
`dcos cluster attach` 命令将把 CLI 附加到已接上或称 [已连接](/cn/1.12/cli/command-reference/dcos-cluster/dcos-cluster-link/) 的群集。当您运行 [`dcos cluster setup`](/cn/1.12/cli/command-reference/dcos-cluster/dcos-cluster-setup/) 命令时，群集自动被附加。

# 使用

```bash
dcos cluster attach <cluster> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|  `--help, h` | 显示使用情况。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<cluster>` | 群集的 ID（必填）|



# 示例

```
dcos cluster list
        NAME                          ID                     STATUS     VERSION                                         URL                                          
    user_81-rd373u5  bb07074e-2c3d-4dc5-8523-75cab9d517cb  UNAVAILABLE  UNKNOWN  http://user_81-elasticl-7qbh2zcfyz6h-407934734.us-east-1.elb.amazonaws.com        
*  user_45-wosq2gi     7edd47b7-7f22-4bd5-b8a9-b53a204aafd3  AVAILABLE    1.12.0   https://user_45-wo-elasticl-1uwhasco5acg9-2062765490.eu-central-1.elb.amazonaws.com 
```


如需更多示例，请参阅 [群集连接](/cn/1.12/administering-clusters/multiple-clusters/cluster-connections/) 和 [群集链接](/cn/1.12/administering-clusters/multiple-clusters/cluster-links/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos cluster](/cn/1.12/cli/command-reference/dcos-cluster/) | 管理与 DC/OS 群集的连接 |