---
layout: layout.pug
navigationTitle: dcos edgelb list
title: dcos edgelb list
menuWeight: 25
excerpt: 列出所有已配置池的名称和摘要
enterprise: false
---

# 说明
`dcos edgelb list` 命令会返回所有已配置池的名称列表和摘要。

# 使用

```bash
dcos edgelb list [<flags>]
```

# 选项

| 名称、简称 | 说明 |
|---------|-------------|
| `--help, h`   | Print usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |
| `--json` | Show unparsed JSON response. |

# Parent command

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/services/edge-lb/1.1/cli-reference/) | 管理 Edge-LB。 |

# 示例

请参阅 [Edge-LB 使用](/cn/services/edge-lb/1.1/usage/)。
