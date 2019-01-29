---
layout: layout.pug
navigationTitle: dcos edgelb config
title: dcos edgelb config
menuWeight: 2
excerpt: 查看和更新 Edge-LB 配置

enterprise: true
---

# 说明
`dcos edgelb config` 命令让您查看或更新 Edge-LB 配置。

# 使用

```bash
dcos edgelb config <file> [OPTIONS]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<file>` | 包含 Edge-LB 配置的 JSON 文件。|


# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| | `--verbose` | 启用额外的请求和响应记录。|
| | `--force-insecure` | 在查询服务时允许未经验证的 TLS 证书。|
| | `--custom-auth-token=DCOS_AUTH_TOKEN` | 在查询服务时使用的自定义 `auth` 令牌。|
| | `--custom-dcos-url=DCOS_URI/DCOS_URL` | 在查询服务时使用的自定义集群 URL。|
| | `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH` |在查询服务时使用的自定义 TLS CA 证书文件。|
| `--name=" <name>"` | 要查询的服务实例的名称。|
| | `--reference` | 显示配置参考。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/1.11/cli/command-reference/dcos-edgelb/) | 管理 Edge-LB。|
