---
layout: layout.pug
navigationTitle:  dcos security org groups add_user
title: dcos security org groups add_user
menuWeight: 125
excerpt: 将用户添加到组
enterprise: true
---
# 说明

`dcos security org groups add_user` 命令让您将用户添加到指定用户组。

# 使用

```
dcos security org groups add_user [OPTIONS] GID UID
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `GID` | 组 ID。（必填）|
| `UID` | 用户 ID。（必填）|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全群集组织分组](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) | 管理用户组和组成员。 |
