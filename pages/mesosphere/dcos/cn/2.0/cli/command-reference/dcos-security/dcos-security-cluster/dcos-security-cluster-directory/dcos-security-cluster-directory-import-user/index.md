---
layout: layout.pug
navigationTitle:  dcos security cluster directory import_user
title: dcos security cluster directory import_user
menuWeight: 35
excerpt: 从 LDAP 后端导入一位用户
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---
# 说明

`dcos security cluster directory import_user` 命令从配置的目录 (LDAP) 后端导入用户。


# 使用

```bash
dcos security cluster directory import_user [OPTIONS] UID
```


# 选项

| 名称 | 说明 |
|----------|---------|
|  `-h`, `--help` |                显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|--------|-------------------|
| `UID` | 用户 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos security cluster directory](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-directory/) | 管理 LDAP 设置。 |
