---
layout: layout.pug
navigationTitle:  dcos security cluster directory import_group
title: dcos security cluster directory import_group
menuWeight: 33
excerpt: 导入一个 LDAP 组
enterprise: true
---

# 说明

`dcos security cluster directory import_group` 命令从配置的目录 (LDAP) 后端导入一组用户。有关组导入的详细信息，请参阅 IAM 文档。

# 使用

```
dcos security cluster directory import_user [OPTIONS] GID
```

# 选项

| 名称 | 说明 |
|--------|-------------------|
| `-h`, `--help` | 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|--------|-------------------|
| `GID` | 组 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集目录](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-directory/) | 管理 LDAP 设置。 |