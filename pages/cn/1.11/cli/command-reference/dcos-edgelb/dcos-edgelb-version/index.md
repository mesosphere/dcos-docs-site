---
layout: layout.pug
navigationTitle: dcos edgelb version
title: dcos edgelb version
menuWeight: 10
excerpt: 显示 Edge-LB 版本

enterprise: true
---


# 说明
`dcos edgelb version` 命令显示 Edge-LB 版本。

# 使用

```bash
dcos edgelb [<flags>] version
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| | `--verbose` | 启用额外的请求和响应记录。|
| | `--force-insecure` | 在查询服务时允许未经验证的 TLS 证书。|
| | `--custom-auth-token=DCOS_AUTH_TOKEN` | 查询服务时使用的自定义授权令牌。|
| | `--custom-dcos-url=DCOS_URI/DCOS_URL` | 在查询服务时使用的自定义集群 URL。|
| | `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH` | 在查询服务时使用的自定义 TLS CA 证书文件。|
| `--name=" <name>"` | 要查询的服务实例的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/1.11/cli/command-reference/dcos-edgelb/) | 管理 Edge-LB。|

# 示例

请参阅 [Edge-LB 快速入门指南](/cn/1.11/networking/edge-lb/quickstart/)。
