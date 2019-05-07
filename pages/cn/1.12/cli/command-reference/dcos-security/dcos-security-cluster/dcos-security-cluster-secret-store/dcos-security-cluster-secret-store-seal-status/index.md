---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store seal-status
title: dcos security cluster secret-store seal-status
menuWeight: 92
excerpt: 查看密钥存储库的密封状态
enterprise: true
---

# 说明

`dcos security cluster secret-store seal-status` 命令显示密钥存储库的密封状态。

# 使用

```
dcos security cluster secret-store seal-status [OPTIONS] STORE_ID
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-j`, `--json` | JSON 格式的输出数据。 |
| `-h`, `--help` | 显示此消息并退出。|


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `STORE_ID` | 密钥存储库 ID。（必填）|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集密钥存储库](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-secret-store/) | 您的密钥存储库的显示设置。 |