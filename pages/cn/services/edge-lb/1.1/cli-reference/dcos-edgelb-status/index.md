---
layout: layout.pug
navigationTitle: dcos edgelb status
title: dcos edgelb status
menuWeight: 40
excerpt: 列出池的负载均衡器任务信息


enterprise: false
---

# 说明
`dcos edgelb status` 命令会返回与池相关联的负载均衡器任务信息列表，例如，代理 IP 地址、任务 ID 等等。
列出池中每个运行负载均衡器实例的名称。

# 使用

```bash
dcos edgelb status [<flags>] <pool-name>
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
| `--task-ids` | Only Display the task ids. |
| `--json` | Show unparsed JSON response. |

# Parent command

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/services/edge-lb/1.1/cli-reference/) | 管理 Edge-LB。 |

# 示例

请参阅 [Edge-LB 使用](/cn/services/edge-lb/1.1/usage/)。
