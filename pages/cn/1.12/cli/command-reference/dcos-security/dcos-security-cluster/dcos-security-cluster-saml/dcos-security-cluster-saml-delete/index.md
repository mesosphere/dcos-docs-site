---
layout: layout.pug
navigationTitle:  dcos security cluster saml delete
title: dcos security cluster saml delete
menuWeight: 13
excerpt: 删除 SAML 提供程序配置
enterprise: true
---

# 说明

`dcos security cluster saml delete` 命令让您可以删除 SAML 提供程序配置。

# 使用

```
dcos security cluster saml delete [OPTIONS] SAML_ID
```


# 选项

| 名称 | 说明 |
|-------------------|------------------|
| `-h`, `--help` | 显示此消息并退出。|


## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `SAML_ID` | SAML 提供程序的 ID。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 SAML](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | 管理您的安全声明标记语言 (SAML) 设置。 |