---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store show
title: dcos security cluster secret-store show
menuWeight: 95
excerpt: 查看已配置的密钥存储库
enterprise: true
---

# 说明

`dcos security cluster secret-store show` 命令显示已配置的密钥存储库概述。它将显示有关密钥存储库或概述的详细信息，具体取决于是否指定了密钥存储库 ID。

如果指定了多个密钥存储库，则只评估第一个 ID。

# 使用

```
dcos security cluster secret-store show [OPTIONS] [STORE_ID]...
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


# 示例

以下是没有提供存储库 ID 时的 `dcos security cluster secret-store show` 输出信息。

```
dcos security cluster secret-store show
default:
    addr: http://127.0.0.1:8200
    description: DC/OS Default Secret Store Backend
    driver: vault
    initialized: true
    sealed: false
```
# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集密钥存储库](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-secret-store/) | 您的密钥存储库的显示设置。 |