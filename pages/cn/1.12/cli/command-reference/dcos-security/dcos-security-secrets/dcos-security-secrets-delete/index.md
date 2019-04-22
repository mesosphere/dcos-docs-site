---
layout: layout.pug
navigationTitle:  dcos security secrets delete
title: dcos security secrets delete
menuWeight: 310
excerpt: 删除密钥
enterprise: true
---

# 说明

`dcos security secrets delete` 命令删除密钥，包括在路径 PATH 下存储的密钥。

# 使用

```
dcos security secrets delete [OPTIONS] PATH
```

# 选项

| 名称 | 说明 |
|------------------|----------------------|
|`-s`, `--store-id <text>` | 要使用的密钥后端。|
| `-h`, `--help` | 显示此消息并退出。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `PATH` | 密钥路径的 URL 或 IP 地址。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全密钥](/cn/1.12/cli/command-reference/dcos-security/dcos-security-secrets/) | 管理密钥。 |