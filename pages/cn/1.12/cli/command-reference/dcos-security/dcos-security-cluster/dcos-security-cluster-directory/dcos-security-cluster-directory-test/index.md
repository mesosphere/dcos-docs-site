---
layout: layout.pug
navigationTitle:  dcos security cluster directory test
title: dcos security cluster directory test
menuWeight: 40
excerpt: 测试与 LDAP 后端的连接
enterprise: true
---
# 说明

`dcos security cluster directory test` 命令测试与 LDAP 后端的连接。使用此命令，您可以执行基本测试，并验证当前目录 (LDAP) 配置参数是否能够成功连接到目录后端。例如，此端点模拟通过 LDAP 进行认证的过程，但在发生故障时提供比实际登录端点更多的有用反馈。

# 使用

```
dcos security cluster directory test [OPTIONS] UID PASSWORD
```

# 选项

| 名称 | 说明 |
| `-j`, `--json` | JSON 格式的输出数据。|
| `-h`, `--help` | 显示此消息并退出。 |


## 位置自变量

| 名称 | 说明 |
| `UID` | 用户 ID（必填）|
| `PASSWORD` | UID 的密码。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集目录](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-directory/) | 管理 LDAP 设置。 |
