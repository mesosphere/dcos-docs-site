---
layout: layout.pug
navigationTitle:  dcos cluster link
title: dcos cluster link
menuWeight: 3
excerpt: 将连接的群集链接到另一群集
enterprise: true
---

# 说明
`dcos cluster link` 命令使您能够配置从一个群集指向一个或多个群集的单向链接。访问群集时，您可以查看与其连接的群集。您可以[附加](/cn/1.12/cli/command-reference/dcos-cluster/dcos-cluster-attach/) 已连接的群集，无需事先运行 `dcos cluster setup`。

**先决条件**

- 您使用 [`dcos cluster setup`](/cn/1.12/cli/command-reference/dcos-cluster/dcos-cluster-setup/)命令设置要被连接的群集，必须指定相同的身份认证提供程序。


# 使用

```bash
dcos cluster link <cluster> [flags]
```

如果群集链接成功，则控制台没有输出。

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--ca-certs string` | 指定具有受信任 CA 的文件的路径，据此验证请求。 |
| `-h`，`--help` | 显示链接帮助。 |
| `--insecure` | 允许请求绕过 TLS 证书验证（不安全）。|
| `--name string` | 指定群集的自定义名称。 |
| `--no-check` | 不检查从群集下载的 CA 证书。（不安全） 仅适用于 Enterprise DC/OS。[enterprise type="inline" size="small" /]|
| `--password string` | 在命令行中指定密码（不安全）。|
| `--password-file string` | 指定包含密码的文件的路径。|
| `--private-key string` | 指定包含服务 acc`ount 私钥的文件路径。 |
| `--provider string` | 指定要使用的登录提供程序。 |
| `--username string` | 指定登录用户名。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<cluster>` | 可访问管理节点的 URL 或 IP 地址。（必填）|



# 示例
有关示例，请参阅 [群集链接](/cn/1.12/administering-clusters/multiple-clusters/cluster-links/)。



# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos cluster](/cn/1.12/cli/command-reference/dcos-cluster/) | 管理 DC/OS 群集。 |