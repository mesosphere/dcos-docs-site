---
layout: layout.pug
navigationTitle: dcos cluster setup
title: dcos cluster setup
menuWeight: 7
excerpt: 设置连接到 DC/OS 集群

enterprise: false
---

# 说明
`dcos cluster setup` 命令让您设置与 DC/OS 集群的连接、向 DC/OS 进行身份认证以及附加到集群。

# 使用

```bash
dcos cluster setup <dcos-url> [OPTIONS]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--ca-certs=<ca-certs>` | [enterprise type="inline" size="small" /] 用于验证请求的可信任 CA 的列表的路径。|
| | `--insecure` | 允许请求绕过 SSL 证书验证。类似于 `dcos config set core.ssl_verify=False`| |
| | `--no-check` | [enterprise type="inline" size="small" /] 请勿检查从集群下载的 CA 证书。这样不安全。 |
| `--password-env=<password_env>` | 包含登录密码的环境变量的名称。|
| `--password-file=<password_file>` | 包含登录密码的文件的路径。|
| `--password=<password>` | 登录密码。这样不安全。 |
| `--private-key=<key_path>` | 包含私钥的文件的路径。|
| `--provider=<provider_id>` | [enterprise type="inline" size="small" /] 用于登录的身份认证提供程序。 |
| `--username=<username>` | 登录用户名。|

## SSL 选项

如果未指定 SSL 选项`--insecure`、 `--no-check` 或 `--ca-certs` 当中的一个，CA 证书从集群中下载，并且提供证书的 `sha256` 指纹以供验证。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<dcos-url>` | 可访问管理节点的 URL 或 IP 地址。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/cn/1.11/cli/command-reference/dcos-cluster/) | 管理 DC/OS 集群。 |

# 示例
有关示例，请参阅 [集群连接](/cn/1.11/administering-clusters/multiple-clusters/cluster-connections/)。
