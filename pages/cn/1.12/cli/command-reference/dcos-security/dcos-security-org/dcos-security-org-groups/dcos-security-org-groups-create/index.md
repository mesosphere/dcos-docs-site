---
layout: layout.pug
navigationTitle:  dcos security org groups create
title: dcos security org groups create
menuWeight: 130
excerpt: 创建用户组
enterprise: true
---
# 说明
`dcos security org groups create` 命令让您可以创建新组。

# 使用

```bash
dcos security org groups create [OPTIONS] GID
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `d`, `--description <text>` | 组描述。|
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `GID` | 组 ID。（必填）|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全群集组织分组](/cn/1.12/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) | 管理用户组和组成员。 |