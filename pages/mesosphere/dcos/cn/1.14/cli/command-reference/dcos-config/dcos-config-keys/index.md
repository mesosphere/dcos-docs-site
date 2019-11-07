---
layout: layout.pug
navigationTitle:  dcos config keys
title: dcos config keys
menuWeight: 1
excerpt: 检索 DC/OS 配置属性密钥列表
enterprise: false
渲染：胡须
型号：/mesosphere/dcos/data.yml
---

# 说明

`dcos config keys` 返回您可以在 DC/OS 配置文件中设置的配置属性键的列表。

# 使用

```bash
dcos config keys [options]
```
# 选项

| 名称 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| `--quiet, q`   |   仅打印配置键。|

<!--
# 权限
要列出群集的配置键，您的用户帐户必须具有以下权限：
-->
# 示例
要检索群集的配置属性键列表，请运行以下命令：

```bash
dcos config keys
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
|[dcos config](/mesosphere/dcos/1.14/cli/command-reference/dcos-config/) | 管理 DC/OS 配置 |
