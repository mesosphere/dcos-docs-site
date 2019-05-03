---
layout: layout.pug
navigationTitle:  dcos security secrets create
title: dcos security secrets create
menuWeight: 300
excerpt: 创建和存储密钥
enterprise: true
---

# 说明

`dcos security secrets create` 命令让您可以在特定路径下创建和存储密钥。
# 使用

```
dcos security secrets create [OPTIONS] PATH
```

# 选项
 
| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-s`, `--store-id <text> ` | 要使用的密钥后端。|
| `-v`, `--value <text> ` | 密钥的值。|
| `-t`, `--text-file`, `--value-file <filename>` | 将文件内容视为密钥的值。假设内容是通过 UTF-8 编码的文本。|
| `-f`, `--file <filename>` | 使用原始文件内容作为密钥的值：将未修改的字节序列传递给 DC/OS 密钥服务|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `PATH` | 密钥路径的 URL 或 IP 地址。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全密钥](/cn/1.12/cli/command-reference/dcos-security/dcos-security-secrets/) | 管理密钥。 |