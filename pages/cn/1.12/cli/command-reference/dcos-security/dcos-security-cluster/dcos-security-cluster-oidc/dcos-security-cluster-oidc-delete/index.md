---
layout: layout.pug
navigationTitle:  dcos security cluster oidc delete
title: dcos security cluster oidc delete
menuWeight: 50
excerpt: 删除 OIDC 提供程序配置
enterprise: true
---

# 说明

`dcos security cluster oidc delete` 命令让您删除 OpenID Connect 提供程序配置。

# 使用

```
dcos security cluster oidc delete [OPTIONS] OIDC_ID
```

# 选项

| 名称 | 说明 |
|---------|-----------------|
| `-h`, `--help` | 显示此消息并退出。|


## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `OIDC_ID` | OpenID Connect 提供程序 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 OIDC](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | 管理 OIDC 设置。 |
