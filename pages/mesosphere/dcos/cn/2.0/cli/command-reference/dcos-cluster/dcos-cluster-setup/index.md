---
layout: layout.pug
navigationTitle:  dcos cluster setup
title: dcos cluster setup
menuWeight: 6
excerpt: 配置 CLI 以便与群集通信
enterprise: false
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---

# 说明
`dcos cluster setup` 命令将配置与 DC/OS 群集的连接、向 DC/OS 进行身份验证以及附加到群集。

它还将自动安装 [Core 和 Enterprise CLI 插件](/mesosphere/dcos/2.0/cli/plugins/)。

# 使用

```bash
  dcos cluster setup <url> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--ca-certs string` |指定具有受信任 CA 的文件的路径，据此验证请求。
| `-h`，`--help` | 显示此命令的帮助。 |
| `--insecure` | 允许请求绕过 TLS 证书验证（不安全）。
| `--name string` | 指定群集的自定义名称。
| `--no-check` | 请勿勾选从群集下载的 CA 证书。（不安全） 仅适用于 Enterprise DC/OS。[enterprise type="inline" size="small" /]
| `--password string` | 在命令行中指定密码（不安全）。
| `--password-file string` | 指定包含密码的文件的路径。
| `--private-key string` | 指定包含服务帐户私钥的文件路径。
| `--provider string` | 指定要使用的登录提供商。
| `--username string` | 指定登录用户名。


## TLS 选项

如果未指定 SSL 选项`--insecure`、 `--no-check` 或 `--ca-certs` 当中的一个，CA 证书从群集中下载，并且提供证书的 `sha256` 指纹以供验证。

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<url>` | 可访问管理节点的 URL 或 IP 地址 |


# 示例
有关示例，请参阅 [群集连接](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-connections/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster] ](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |
