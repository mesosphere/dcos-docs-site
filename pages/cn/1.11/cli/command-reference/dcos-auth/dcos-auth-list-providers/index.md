---
layout: layout.pug
navigationTitle: dcos auth list-providers
title: dcos auth list-providers
menuWeight: 1
excerpt: 为您的集群发现配置的身份认证提供程序
enterprise: true
---

# 说明
`dcos auth list-providers `命令为您的 DC/OS 集群列出已配置的身份认证提供程序。

# 使用

```bash
dcos auth list-providers [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--json` | 指定以 JSON 为格式的身份认证提供程序列表。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos auth](/cn/1.11/cli/command-reference/dcos-auth/) | 管理 DC/OS 身份和访问。 |

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
有关详细信息，请参阅[服务账户](/cn/1.11/security/ent/service-auth/)。
