---
layout: layout.pug
navigationTitle: CLI 参考
title: CLI 参考
menuWeight: 70
excerpt: Edge-LB 安装包中所有 CLI 命令的参考
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
| `--help, h`   | Print usage. |
| `--verbose`   | Enable additional logging of requests and responses. |
| `--force-insecure`   | Allow unverified TLS certificates when querying service. |
| `--custom-auth-token=DCOS_AUTH_TOKEN`   | Specify a custom auth token to use when querying a service. |
| `--custom-dcos-url=DCOS_URI/DCOS_URL`   | Specify a custom cluster URL to use when querying a service. |
| `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH`   | Specify a custom TLS CA certificate file to use when querying a service. |
| `--name="<name>"`   | Name of the service instance to query. |
