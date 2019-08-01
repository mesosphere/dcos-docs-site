---
layout: layout.pug
navigationTitle:  dcos security cluster saml show
title: dcos security cluster saml show
menuWeight: 85
excerpt: 查看现有 SAML 提供程序配置
enterprise: true
---

# 说明

`dcos security cluster saml show` 命令显示已配置的 SAML 提供程序概览。它将显示有关给定提供程序或概述的详细信息，具体取决于提供程序 ID 是否已指定。

如果指定了多个提供程序，则仅评估第一个 ID。

# 使用

```
dcos security cluster saml show [OPTIONS] [SAML_ID]...
```

# 选项

| 名称 | 说明 |
|-----------------|-----------------|
| `-h`, `--help` | 显示此消息并退出。 |
| `-j`, `--json` | 输出 JSON 格式的数据。 |

## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `SAML_ID` | SAML 提供程序的 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 SAML](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | 管理您的安全声明标记语言 (SAML) 设置。 |


/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml/
