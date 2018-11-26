---
layout: layout.pug
navigationTitle: dcos config show
title: dcos config show
menuWeight: 2
excerpt: 显示集群配置文件

enterprise: false
---


# 说明
`dcos config show` 命令让您显示当前 [附加的集群] 的 DC/OS 配置文件内容(/1.11/cli/command-reference/dcos-cluster/dcos-cluster-attach/)。

# 使用

```bash
dcos config show <name>
```


# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<name>` | 属性的名称。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
|[dcos config](/cn/1.11/cli/command-reference/dcos-config/) | 管理 DC/OS 配置。 |

# 示例

## 查看特定配置值

在此示例中，显示了 DC/OS URL。

```bash
dcos config show core.dcos_url
```

输出如下：

```bash
https://your-cluster-9vqnkrq5pt2n-2781474.cloue-1.elb.amazonaws.com
```

## 查看所有配置值

在此示例中，所有配置值已显示。

```bash
dcos config show
```

输出如下：

```bash
core.dcos_url https://your-cluster-9vqnkrq5pt2n-2781474.cloue-1.elb.amazonaws.com
core.ssl_verify false
```
