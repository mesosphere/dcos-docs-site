---
layout: layout.pug
navigationTitle:  dcos security org users create
title: dcos security org users create
menuWeight: 190
excerpt: 创建新用户
enterprise: true
---

# 说明

`dcos security org users create` 命令让您创建新用户并为其分配用户 ID (UID)。

# 选项
 
| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-d`, `--description` <text> | 描述。 |
| `-p`, `--password` <text> | 密码。 |
| `UID` | 用户 ID。（必填）|


# 使用

```
Usage: dcos security org users create [OPTIONS] UID

  Create a new user.

Options:
  -d, --description TEXT  Description.
  -p, --password TEXT     Password.
  -h, --help              Show this message and exit.
```