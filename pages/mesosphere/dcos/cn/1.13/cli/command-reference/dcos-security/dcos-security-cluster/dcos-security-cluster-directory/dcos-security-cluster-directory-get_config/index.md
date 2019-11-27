---
layout: layout.pug
navigationTitle:  dcos security cluster directory get_config
title: dcos security cluster directory get_config
menuWeight: 32
excerpt: 检索 LDAP 配置
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: true
---

# 说明

`dcos security cluster directory get_config` 命令将检索当前 LDAP 配置。

# 选项

| 名称 | 说明 |
|----------|---------------|
|`-j`, `--json`| JSON 格式的输出数据|
|`-h`, `--help`| 显示此消息并退出|

# 使用

```
dcos security cluster directory get_config [OPTIONS]
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集目录](/mesosphere/dcos/1.13/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-directory/) | 管理 LDAP 设置。 |

