---
layout: layout.pug
navigationTitle:  dcos security secrets create-sa-secret
title: dcos security secrets create-sa-secret
menuWeight: 305
excerpt: 创建和存储密钥
enterprise: true
---

# 说明

`dcos security secrets create-sa-secret` 命令让您创建服务帐户密钥，或创建一个可供 DC/OS 上运行的服务用于登录到服务帐户的密钥。

# 使用

```
dcos security secrets create-sa-secret [OPTIONS] SA_PRIVATE_KEY SA_UID SECRET_PATH
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-s`,` --store-id <text>` | 要使用的密钥后端。|
| `--strict ` | 执行安全群集通信。|
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `SA_PRIVATE_KEY` | 属于服务帐户的私钥。 |
| `SA_UID` | 服务帐户用户 ID。 |
| `SECRET_PATH` | 密钥路径让您可限制哪些服务可以检索值。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全密钥](/cn/1.12/cli/command-reference/dcos-security/dcos-security-secrets/) | 管理密钥。 |