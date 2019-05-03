---
layout: layout.pug
navigationTitle:  cos security cluster oidc modify
title: cos security cluster oidc modify
menuWeight: 60
excerpt: 修改现有 OIDC 提供程序配置
enterprise: true
---

# 说明

`cos security cluster oidc modify` 命令让您可以修改现有 OIDC 提供程序配置。

# 使用

```
dcos security cluster oidc modify [OPTIONS] OIDC_ID
```

# 选项


| 名称 | 说明 |
|--------------|-----------------|
| ` -d`, `--description <text>` | OIDC 提供程序的描述。（必填）|
| `-i`, `--issuer <text>` | OIDC 提供程序的发行方。(必填) |
| `-b`, `--base-url <text>` | OIDC 提供程序的基准 URL。（必填）|
| `-c`, `--client-secret <text>` | OIDC 提供程序的客户端密钥。（必填）|
| `--client-id <text>` | 新的 OIDC 提供程序的客户 ID。(必填) |
| `-h`, `--help` | 显示此消息并退出。|


## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `OIDC_ID` | OpenID Connect 提供程序 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 OIDC](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | 管理 OIDC 设置。 |
