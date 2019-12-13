---
layout: layout.pug
navigationTitle:  dcos security org service-accounts create
title: dcos security org service-accounts create
menuWeight: 165
excerpt: 创建服务帐户
enterprise: true
---

# 说明

`dcos security org service-accounts create` 命令让您可以创建服务帐户，并向其提供服务帐户 ID (SID)。请注意 `--public-key` 和 `--secret` 选项互相不包含。

# 使用

```
dcos security org service-accounts create [OPTIONS] SID
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-p`, `--public-key` <filename> | 待使用公钥的路径；`-` 从 STDIN 读取 |
| `-s`, `--secret <text>` | 要使用的密码。 |
| `-d`, `--description <text>` | 新建服务帐户的描述。默认使用账户的 ID。 |
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `SID` | 服务账户 ID。（必填）|

