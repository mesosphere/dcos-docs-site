---
layout: layout.pug
navigationTitle: dcos edgelb lb-config
title: dcos edgelb lb-config
menuWeight: 20
excerpt: 显示与池关联的运行负载平衡器配置
enterprise: false
---

# 说明
`dcos edgelb lb-config` 命令会显示与池关联的运行中的负载均衡器配置。您可以查看池中所有负载均衡器的活动负载均衡器配置。


# 使用

```bash
dcos edgelb lb-config [<flags>] <pool-name>
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
| `--raw` | Show unparsed load-balancer config. |

# Parent command

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/services/edge-lb/1.1/cli-reference/) | 管理 Edge-LB。 |

# 示例

请参阅 [Edge-LB 使用](/cn/services/edge-lb/1.1/usage/)。
