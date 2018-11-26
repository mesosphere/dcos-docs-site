---
layout: layout.pug
navigationTitle: dcos cluster link
title: dcos cluster link
menuWeight: 3
excerpt: 将连接的集群链接到另一集群
enterprise: true
---

# 说明
`dcos cluster link` 命令让您配置从一个集群指向一个或多个集群的单向链接。访问集群时，您可以查看与其链接的集群。您可以[附加](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-attach/) 链接的集群，无需事先运行 `dcos cluster setup`。

**前提条件**

-用于设置要被链接的集群的[`dcos cluster setup`](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup/)命令，必须指定相同的身份认证提供程序。例如：

  ```
  dcos cluster setup <dcos-url-a> --provider=dcos-users
  dcos cluster setup <dcos-url-b> --provider=dcos-users
  ```

# 使用

```bash
dcos cluster link <dcos-url-a>
```

**注意：** 如果集群链接成功，则控制台没有输出。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<dcos-url-a>` | 可访问管理节点的 URL 或 IP 地址。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/cn/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 集群。 |

# 示例
有关示例，请参阅 [集群链接](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。
