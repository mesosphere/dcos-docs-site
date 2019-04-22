---
layout: layout.pug
navigationTitle:  dcos security cluster saml add
title: dcos security cluster saml add
menuWeight: 70
excerpt: 配置新的 SAML 提供程序
enterprise: true
---
# 说明

`dcos security cluster saml add` 命令可让您配置新的 SAML 提供程序。

# 使用

```
dcos security cluster saml add [OPTIONS] SAML_ID
```

# 选项

| 名称 | 说明 |
|-------------|-----------------|
| `-d`, `--description <text>` | SAML 提供程序描述。(必填) |
| `-i`, `--idp-metadata <filename>` | 包含 IDP 元数据的 XML 格式文件。(必填) |
| `-b`, `--sp-base-url <text>` | 服务提供程序的基准 URL。(必填) |
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `SAML_ID` | SAML 提供程序的 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 SAML](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | 管理您的安全声明标记语言 (SAML) 设置。 |