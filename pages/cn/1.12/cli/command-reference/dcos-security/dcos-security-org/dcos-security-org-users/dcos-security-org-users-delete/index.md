---
layout: layout.pug
navigationTitle:  dcos security org users delete
title: dcos security org users delete
menuWeight: 195
excerpt: 删除用户
enterprise: true
---

# 说明

`dcos security org users delete` 命令让您使用 UID 删除用户。

# 选项
 
| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `UID` | 用户 ID。（必填）|

# 使用

```
Usage: dcos security org users delete [OPTIONS] UID

  Delete user identified by UID.

Options:
  -h, --help  Show this message and exit.
```