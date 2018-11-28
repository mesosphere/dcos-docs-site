---
layout: layout.pug
navigationTitle: dcos edgelb pool config
title: dcos edgelb pool config
menuWeight: 5
excerpt: 查看和更新 Edge-LB 池配置

enterprise: true
---


# 说明
`dcos edgelb pool config` 命令让您查看或更新 Edge-LB 池配置。

# 使用

```bash
dcos edgelb pool config <name> [<file>] [OPTIONS]
```

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|-------------|
| `<name>` | 池名称。|
| `[<file>]` | 包含 Edge-LB 配置的 JSON 文件。|

# 选项

| 名称，简写 | 说明 |
|---------|------------|
| | `--help, h` | 显示使用情况。|
| | `--verbose` | 启用额外的请求和响应记录。|
| | `--force-insecure` | 在查询服务时允许未经验证的 TLS 证书。|
| | `--custom-auth-token=DCOS_AUTH_TOKEN` | 指定在查询服务时使用的自定义授权令牌。|
| | `--custom-dcos-url=DCOS_URI/DCOS_URL` | 指定在查询服务时使用的自定义集群 URL。|
| | `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH` | 指定在查询服务时使用的自定义 TLS CA 证书文件。|
| `--name=" <name>"` | 要查询的服务实例的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/1.11/cli/command-reference/dcos-edgelb/) | 管理 Edge-LB。|

# 示例

请参阅 [Edge-LB 快速入门指南](/cn/1.11/networking/edge-lb/quickstart/)。
