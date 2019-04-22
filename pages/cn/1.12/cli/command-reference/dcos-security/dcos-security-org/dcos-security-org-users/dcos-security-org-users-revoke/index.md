---
layout: layout.pug
navigationTitle:  dcos security org users revoke
title: dcos security org users revoke
menuWeight: 205
excerpt: 撤销用户权限
enterprise: true
---

# 说明

`security org users revoke` 命令将撤销指定用户对指定资源执行给定操作的权限。

# 选项
 
| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `UID` | 用户 ID。（必填）|
| `RID` | 资源 ID。(必填) |
| `ACTION` | 指定的操作。|

# 使用

```
Usage: security org users revoke [OPTIONS] UID RID ACTION

  Revoke permission for the user with the given UID to enact a given ACTION on
  the resource with the given RID.

Options:
  -h, --help  Show this message and exit.
```