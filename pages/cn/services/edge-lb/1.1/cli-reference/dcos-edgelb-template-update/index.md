---
layout: layout.pug
navigationTitle:  dcos edgelb template update
title: dcos edgelb template update
menuWeight: 60
excerpt: 为负载均衡器的池更新自定义配置模板

enterprise: false
---


# 说明
`dcos edgelb template update` 命令为负载均衡器池更新自定义配置模板。

使用名为 `haproxy.cfg.ctmpl` 的模板将生成池的渲染 `haproxy.cfg`。高级用户可以修改和上传此模板的自定义版本。

# 使用

```bash
dcos edgelb template update <pool-name> <template-file>
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
