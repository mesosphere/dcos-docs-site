---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store unseal
title: dcos security cluster secret-store unseal
menuWeight: 115
excerpt: 拆封密钥存储库
enterprise: true
---
# 说明

`dcos security cluster secret-store unseal` 命令让您拆封给定存储库。

# 使用

```
dcos security cluster secret-store unseal [OPTIONS] STORE_ID KEY
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-j`, `--json` | JSON 格式的输出数据。 |
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `STORE_ID` | 密钥存储库的 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集密钥存储库](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-secret-store/) | 您的密钥存储库的显示设置。 |