---
layout: layout.pug
navigationTitle:  dcos security org groups show
title: dcos security org groups show
menuWeight: 155
excerpt: 查看组信息
render: mustache
model: /mesosphere/dcos/2.1/data.yml
enterprise: true
---

# 说明

`dcos security org groups show` 命令将显示一个或多个组的基本信息。

# 使用

```
dcos security org groups show [OPTIONS] [GIDS]...
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|  `-h`, `--help` |                显示此消息并退出。|
|  `-j`, `--json` | JSON 格式的输出数据。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `GID` | 组 ID。（必填)|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos security cluster org groups](/mesosphere/dcos/cn/2.1/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  管理用户组和组成员。 |
