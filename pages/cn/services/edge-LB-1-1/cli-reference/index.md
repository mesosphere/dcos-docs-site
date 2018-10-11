---
layout: layout.pug
navigationTitle:  CLI Reference
title: CLI Reference
menuWeight: 70
excerpt: Reference for all CLI commands in the Edge-LB package

enterprise: false
---

# 说明
Edge-LB CLI 子命令允许您从 DC/OS CLI 配置和管理 Edge-LB 负载均衡器。

# 使用

```bash
dcos edgelb [<flags>] [OPTIONS] [<args> ...]
```

# 选项

| 名称、简称 | 说明 |
|----------|-------------|
| | `--help, h` | 打印使用。 |
| | `--verbose` | 启用额外的请求和响应记录。 |
| | `--force-insecure` | 在查询服务时允许未经验证的 TLS 证书。 |
| | `--custom-auth-token=DCOS_AUTH_TOKEN` | 指定在查询服务时使用的自定义认证令牌。 |
| | `--custom-dcos-url=DCOS_URI/DCOS_URL` | 指定在查询服务时使用的自定义群集 URL。 |
| | `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH` | 指定在查询服务时使用的自定义 TLS CA 证书文件。 |
| `--名称=" <name>"` | 要查询的服务实例的名称。 |
