---
layout: layout.pug
navigationTitle:  dcos security org service-accounts keypair
title: dcos security org service-accounts keypair
menuWeight: 175
excerpt: 创建公钥-私钥对
enterprise: true
---

# 说明

`dcos security org service-accounts keypair` 命令让您创建用于服务帐户的公钥-私钥对。

# 使用

```
dcos security org service-accounts keypair [OPTIONS] PRIVATE_KEY PUBLIC_KEY
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-l`, `--key-length [2048|4096]` | RSA 密钥长度。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `PRIVATE_KEY` | 私钥。（必填）|
| `PUBLIC_KEY` | 公钥。（必填）|

