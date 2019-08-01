---
layout: layout.pug
navigationTitle:  dcos auth list-providers
title: dcos auth list-providers
menuWeight: 1
excerpt: 列出群集的登录提供商
enterprise: true
---

# 说明

`dcos auth list-providers` 命令列出群集可用的登录提供程序。

# 使用

```bash
dcos auth list-providers <url> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--json` | 返回 JSON 格式的提供程序列表。 |
| `-h`，`--help` | 显示列表提供程序的帮助。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<url>`  |    | 

# 示例

在本示例中，列出了可用的 DC/OS 身份认证提供程序。

```bash
dcos auth list-providers
```

输出应类似于：

```bash
PROVIDER ID    AUTHENTICATION TYPE
dcos-services  Authenticate using a DC/OS service user account (using username and private key)
dcos-users     Authenticate using a standard DC/OS user account (using username and password)
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos auth](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-auth/) | 管理 DC/OS 身份和访问。 |
