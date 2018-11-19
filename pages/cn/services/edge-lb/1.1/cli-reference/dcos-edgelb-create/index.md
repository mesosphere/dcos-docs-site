---
layout: layout.pug
navigationTitle:  dcos edgelb create
title: dcos edgelb create
menuWeight: 5
excerpt: Create a single pool given a definition file written in JSON or YAML

enterprise: false
---

# 说明
`dcos edgelb create` 命令从 JSON 或 YAML 中写入的定义文件创建单个池。

# 使用

```bash
dcos edgelb create [<flags>] <pool-file>
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
| `--json`  | Show unparsed JSON response. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos edgelb](/services/edge-lb/1.1/cli-reference) | 管理 Edge-LB。 |

# 示例

请参阅 [Edge-LB 使用](/services/edge-lb/1.1/usage)。
