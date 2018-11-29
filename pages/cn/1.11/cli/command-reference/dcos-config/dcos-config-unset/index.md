---
layout: layout.pug
navigationTitle: dcos config unset
title: dcos config unset
menuWeight: 3
excerpt: 从配置文件中删除一个属性

enterprise: false
---


# 说明
`dcos config unset` 命令让您从配置文件中删除属性。

# 使用

```bash
dcos config unset <name>
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

## 删除配置值

在本示例中，`core.ssl_verify` 属性被删除。

```bash
dcos config unset core.ssl_verify
```

输出如下：

```bash
Removed [core.ssl_verify]
```
