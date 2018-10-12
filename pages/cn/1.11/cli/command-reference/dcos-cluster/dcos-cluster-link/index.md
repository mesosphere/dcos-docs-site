---
layout: layout.pug
navigationTitle: dcos cluster link
title: dcos cluster link
menuWeight: 3
excerpt: 将连接的群集链接到另一群集
enterprise: true
---

# 说明
`dcos cluster link` 命令允许您配置从一个群集指向一个或多个群集的单向链接。访问群集时，您可以查看与其链接的群集。您可以[附加](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-attach/) 链接的群集，无需事先运行 `dcos cluster setup`。

**前提条件**

- [`dcos cluster setup`](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup/)命令用于设置要被链接的群集，必须指定相同的身份认证提供程序。例如：

  ```
  dcos cluster setup <dcos-url-a> --provider=dcos-users
  dcos cluster setup <dcos-url-b> --provider=dcos-users
  ```

# 使用

```bash
dcos cluster link <dcos-url-a>
```

**注意：** 如果群集链接成功，则控制台没有输出。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<dcos-url-a>` | 可访问管理节点的 URL 或 IP 地址。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |

# 示例
有关示例，请参阅 [群集链接](/1.11/administering-clusters/multiple-clusters/cluster-links/)。
