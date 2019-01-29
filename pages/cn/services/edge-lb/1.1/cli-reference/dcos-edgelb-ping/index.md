---
layout: layout.pug
navigationTitle: dcos edgelb ping
title: dcos edgelb ping
menuWeight: 30
excerpt: 测试 Edge-LB API 服务器的就绪情况
enterprise: false
---

# 说明
dcos edgelb ping 命令允许您测试 Edge-LB API 服务器的就绪状态。成功的结果是字符串 `pong`。如果 API 尚未可用，此命令会返回 HTTP 错误。

# 使用

```bash
dcos edgelb ping
```

# 选项

| 名称、简称 | 说明 |
|---------|-------------|
| `--help, h`   | Display usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |

# Parent command

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/services/edge-lb/1.1/cli-reference/) | 管理 Edge-LB。 |

# 示例

请参阅 [Edge-LB 使用](/cn/services/edge-lb/1.1/usage/)。
