---
layout: layout.pug
navigationTitle: dcos auth login
title: dcos auth login
menuWeight: 2
excerpt: 向 DC/OS 进行身份认证

enterprise: false
---

# 说明
`dcos auth login` 命令让您向 DC/OS 进行身份认证。[dcos cluster setup](/cn/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup/) 命令也运行 `dcos auth login`。

# 使用

```bash
dcos auth login [OPTION]
```

# 选项

| 名称 | 说明 |
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

如果未指定 SSL 选项 `--insecure`、`--no-check` 或 `--ca-certs`之一，CA 证书从集群中下载，并且系统将提供证书的`sha256` 指纹以供验证。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos auth](/cn/1.11/cli/command-reference/dcos-auth/) | 管理 DC/OS 身份和访问。 |
