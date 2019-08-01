---
layout: layout.pug
navigationTitle:  dcos security cluster oidc show
title: dcos security cluster oidc show
menuWeight: 65
excerpt: 查看 DC/OS 证书颁发机构信息
enterprise: true
---

# 说明

`dcos security cluster oidc show` 命令显示已配置的 OpenID Connect 提供程序的概览。它将显示有关给定提供程序或概述的详细信息，具体取决于提供程序 ID 是否已指定或备注。

如果指定了多个提供程序，则仅评估第一个 ID。

# 使用

```
dcos security cluster oidc show [OPTIONS] [OIDC_ID]...
```

# 选项

| 名称 | 说明 |
|----------------|-------------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-j`, `--json` | JSON 格式的输出数据。|


## 位置自变量

| 名称 | 说明 |
|--------|------------------|
| `OIDC_ID` | OpenID Connect 提供程序 ID。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 OIDC](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | 管理 OIDC 设置。 |
