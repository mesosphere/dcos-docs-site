---
layout: layout.pug
navigationTitle:  dcos security org groups grant
title: dcos security org groups grant
menuWeight: 143
excerpt: 授予群组权限
render: mustache
model：/mesosphere/dcos/2.0/data.yml
enterprise: true
---

# 说明

`dcos security org groups grant` 命令授予具有给定 GID 的组使用给定的 RID 对资源执行给定操作的权限。

# 使用

```
dcos security org groups grant [OPTIONS] GID RID ACTION
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help`| 显示此消息并退出。|
| `--description` | 文本。带有给定 RID 的 ACL 描述。如果存在含有给定 RID 的 ACL，则描述将不会被覆盖。默认：“使用 DC/OS Enterprise CLI 创建”。

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `GID` | 组 ID。（必填）|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 安全群集组织分组](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) | 管理用户组和组成员。 |
