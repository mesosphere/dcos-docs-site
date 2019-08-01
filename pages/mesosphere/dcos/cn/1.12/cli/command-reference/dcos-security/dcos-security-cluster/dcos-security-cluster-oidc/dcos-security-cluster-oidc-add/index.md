---
layout: layout.pug
navigationTitle:  dcos security cluster oidc add
title: dcos security cluster oidc add
menuWeight: 13
excerpt: 配置新的 OpenID Connect 提供程序
enterprise: true
---


# 说明

`dcos security cluster oidc add` 命令让您配置新的 OpenID Connect 提供程序。


# 使用

```
dcos security cluster oidc add [OPTIONS] OIDC_ID
```

# 选项

| 名称 | 说明 |
|--------|------------------|
| `-d`, `--description <text>` | 新的 OIDC 提供程序描述。(必填) | 
| `-i`, `--issuer <text>` | 新的 OIDC 提供程序的发行方。(必填) | 
| `-b`, `--base-url <text>` | 新的 OIDC 提供程序的基准 URL。(必填) | 
| `-c`, `--client-secret <text>` | 新的 OIDC 提供程序的客户端密钥。(必填) | 
| `--client-id <text>` | 新的 OIDC 提供程序的客户端 ID。(必填) | 
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `OIDC_ID` | OpenID Connect 提供程序 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 OIDC](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | 管理 OIDC 设置。 |
