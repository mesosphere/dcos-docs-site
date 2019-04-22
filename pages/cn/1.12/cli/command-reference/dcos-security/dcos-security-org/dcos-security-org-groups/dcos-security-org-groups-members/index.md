---
layout: layout.pug
navigationTitle:  dcos security org groups members
title: dcos security org groups members
menuWeight: 145
excerpt: 列出组成员
enterprise: true
---
# 说明

`dcos security org groups members` 命令将列出组中的所有成员。

# 使用

```
dcos security org groups members [OPTIONS] GID
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-j`, `--json` | JSON 格式的输出数据。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `GID` | 组 ID。（必填）|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全群集组织分组](/cn/1.12/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) | 管理用户组和组成员。 |