---
layout: layout.pug
navigationTitle:  dcos security org users grant
title: dcos security org users grant
menuWeight: 205
excerpt: 授予用户权限
enterprise: true
---

# 说明

`dcos security org users grant` 命令让您授予由特定 UID 权限标识的用户在标识的资源上执行指定操作的权限。

# 选项
 
| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `--description <text>` | 带有给定 RID 的 ACL 描述。如果存在含有给定 RID 的 ACL，则描述将不会被覆盖。默认：“使用安全 CLI 创建”。|
| `UID` | 用户 ID。（必填）|
| `RID` | 资源 ID。(必填) |

# 使用

```
Usage: dcos security org users grant [OPTIONS] UID RID ACTION

  Grant the user with the given UID permission to enact a given ACTION on the
  resource with the given RID.

Options:
  --description TEXT  The description of the ACL with the given RID. If an ACL
                      exists with the given RID then the description will not be
                      overwritten. Default: "Created with the security CLI".
  -h, --help          Show this message and exit.
```
