---
layout: layout.pug
navigationTitle:  dcos config unset
title: dcos config unset
menuWeight: 3
excerpt: 从配置文件中删除属性
enterprise: false
---


# 说明
`dcos config unset` 命令将从用于当前群集的配置文件中删除属性。

# 使用

```bash
dcos config unset <name> [flags]
```
# 选项

| 名称 | 说明 |
|---------|-------------|
|  `--help, h` | 显示使用情况。|



## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<name>` | 属性的名称 |



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
# 父命令

| 命令 | 说明 |
|---------|-------------|
|[dcos config](/cn/1.12/cli/command-reference/dcos-config/) | 管理 DC/OS 配置 |