---
layout: layout.pug
navigationTitle:  dcos config show
title: dcos config show
menuWeight: 2
excerpt: 显示群集配置文件
enterprise: false
---

# 说明

`dcos config show` 命令将显示当前 [附加的群集](/cn/1.12/cli/command-reference/dcos-cluster/dcos-cluster-attach/) 的 DC/OS 配置文件内容。

# 使用

```bash
dcos config set <name> <value> [flags]
```
# 选项

| 名称 | 说明 |
|---------|-------------|
|  `--help, h` | 显示使用情况。|

# 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<name>` | 属性的名称 |
| `<value>` | 属性的值 |



# 示例

## 查看特定配置值

在此示例中，显示 DC/OS URL。

```bash
dcos config show core.dcos_url
```

输出如下：

```bash
https://your-cluster-9vqnkrq5pt2n-2781474.cloue-1.elb.amazonaws.com
```

## 查看所有配置值

在此示例中，显示了所有配置值。

```bash
dcos config show
```

输出如下：

```bash
cluster.name MyCluster
core.dcos_acs_token ********
core.dcos_url http://mycluster-elasticl-7qbh2zcfyz6h-4734.us-east-1.elb.amazonaws.com
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
|[dcos config](/cn/1.12/cli/command-reference/dcos-config/) | 管理 DC/OS 配置 |