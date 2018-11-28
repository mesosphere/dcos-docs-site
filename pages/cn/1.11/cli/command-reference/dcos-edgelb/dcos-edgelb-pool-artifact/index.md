---
layout: layout.pug
navigationTitle: dcos edgelb pool artifact
title: dcos edgelb pool artifact
menuWeight: 4
excerpt: 列出 Edge-LB 池可用的工件

enterprise: true
---

# 说明
 `dcos edgelb pool artifact` 命令让您列出可用于 Edge-LB 池的工件。

# 使用

```bash
dcos edgelb [<flags>] pool artifact [<flags>] <name> [<artifact> [<artifactFile>]]
````

位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<name>` | 池名称。|
| `[<artifact>]` | 要查看的工件名称。|
| `[<artifactFile>]` | 要存储的工件文件。|


# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| | `--verbose` | 启用额外的请求和响应记录。|
| | `--force-insecure` | 在查询服务时允许未经验证的 TLS 证书。|
| | `--custom-auth-token=DCOS_AUTH_TOKEN` | 指定在查询服务时使用的自定义授权令牌。|
| | `--custom-dcos-url=DCOS_URI/DCOS_URL` | 指定在查询服务时使用的自定义集群 URL。|
| | `--custom-cert-path=DCOS_CA_PATH/DCOS_CERT_PATH` | 指定在查询服务时使用的自定义 TLS CA 证书文件。|
| `--name=" <name>"` | 要查询的服务实例的名称。|
| | `--raw` | 显示未解析的工件。|
| | `--delete` | 删除工件。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos edgelb](/cn/1.11/cli/command-reference/dcos-edgelb/) | 管理 Edge-LB。|
