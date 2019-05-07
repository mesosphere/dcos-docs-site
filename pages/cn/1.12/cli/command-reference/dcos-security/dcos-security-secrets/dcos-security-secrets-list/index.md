---
layout: layout.pug
navigationTitle:  dcos security secrets list
title: dcos security secrets list
menuWeight: 315
excerpt: 列出密钥
enterprise: true
---

# 说明

`dcos security secrets list` 命令将列出给定路径中存储的所有密钥。

# 使用

```
dcos security secrets list [OPTIONS] PATH
```

# 选项

| 名称 | 说明 |
|------------------|----------------------|
|`-s`, `--store-id <text>` | 要使用的密钥后端。|
|`-j`, `--json` | JSON 格式的输出数据。|
| `-h`, `--help` | 显示此消息并退出。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `PATH` | 密钥路径的 URL 或 IP 地址。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全密钥](/cn/1.12/cli/command-reference/dcos-security/dcos-security-secrets/) | 管理密钥。 |