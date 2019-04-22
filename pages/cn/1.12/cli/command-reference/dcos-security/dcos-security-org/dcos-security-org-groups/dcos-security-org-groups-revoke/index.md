---
layout: layout.pug
navigationTitle:  dcos security org groups revoke
title: dcos security org groups revoke
menuWeight: 155
excerpt: 撤销组进行资源操作的权限
enterprise: true
---
# 说明

`dcos security org groups revoke` 命令将撤消具有给定 GID 的组使用给定的 RID 对资源执行给定操作的权限。

# 使用

```
dcos security org groups revoke [OPTIONS] GID RID ACTION
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `GID` | 组 ID。（必填）|
| `RID` | 资源 ID。（必填）|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全群集组织分组](/cn/1.12/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) | 管理用户组和组成员。 |