---
layout: layout.pug
navigationTitle:  许可证 CLI
title: 许可证 CLI
menuWeight: 2
enterprise: true
excerpt: 使用命令行界面管理您的 DC/OS 许可证
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---

`dcos license` 命令也记录在 [CLI 命令参考](/mesosphere/dcos/cn/1.13/cli/command-reference/dcos-license/) 文档中。

# 先决条件
- 一个 DC/OS Enterprise 群集。
- [DC/OS CLI](/mesosphere/dcos/cn/1.13/cli/install/) 已安装。
- [DC/OS Enterprise CLI](/mesosphere/dcos/cn/1.13/cli/plugins/#enterprise-cli-plugin) 已安装。


# 列示许可证

```
dcos license list
```

# 更新许可证

每次更新许可条款时，您都将新许可证传递给 DC/OS 许可组件。

```
dcos license renew <file-path>
```

# 获取许可证

要检索许可证，运行

```
dcos license get [--decryption-key] [<id>|active]
```

您可以指定存储许可证的可选路径。默认返回活动许可证。采用可选标识符来检索特定许可证。`--decryption-key` 标记返回许可证审计数据条目校验和解密密钥。

# 获取许可证审计数据

您可以使用命令 `dcos license audit get` 指定存储审计数据的可选路径。该命令采用可选标识符来检索为特定许可证生成的数据。如果您想解密审计数据，您可以使用 `dcos license get --decryption-key` 命令检索解密密钥。


```
dcos license audit get [<id>|active]
```


# 获取许可证状态

命令 `dcos license status` 显示许可条款和违规行为。可以使用可选标记来筛选信息。


```
dcos license status [--terms] [--breaches]
```

