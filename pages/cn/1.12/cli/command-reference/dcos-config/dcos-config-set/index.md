---
layout: layout.pug
navigationTitle:  dcos config set
title: dcos config set
menuWeight: 1
excerpt: 添加或设置 DC/OS 配置属性
enterprise: false
---

# 说明

`dcos config set` 命令将在当前群集使用的配置文件中添加或设置属性。表 1 显示可用属性。

# 使用

```bash
dcos config set <name> <value> [flags]
```
# 选项

| 名称 | 说明 |
|---------|-------------|
|  `--help, h` | 显示使用情况。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<name>` | 属性的名称 |
| `<value>` | 属性的值 |

### 表 1 - 属性


| 名称 | 值 |
|-----------------------|------------------------------------------------|
|  `core.dcos_acs_token` | DC/OS 认证令牌。当您使用 `dcos auth login` 登录 DC/OS CLI  时，它将认证令牌值存储在本地。有关详细信息，请参阅 [IAM API](/cn/1.12/security/oss/iam-api/)。|
| `core.dcos_url` | DC/OS 群集的公共管理节点 URL|
|  `core.mesos_master_url` | Mesos 管理节点 URL。默认为 `core.dcos_url`|
|  `core.pagination` | 指示是否标页号输出。默认为 true。|
| `core.ssl_verify` | 指示是否验证 SSL 证书或设置 SSL 证书的路径|
|  `core.timeout` | 请求超时（秒），最小值为 1 秒。默认为 3 分钟。|
| `core.ssh_user` |   |
| `core.ssh_proxy_ip`  |   |
|  `core.reporting` | |
| `core.prompt_login` |  |



# 示例

## 设置请求超时

在此示例中，请求超时设置为五分钟。

```bash
dcos config set core.timeout 300
```
如果命令成功，将不显示确认信息。要验证属性是否已设置，请运行 `dcos config show`:


```bash
dcos config show
cluster.name user_13-3fwr25e
core.dcos_acs_token ********
core.dcos_url http://user_13-elasticl-1x5proho90v2b-1931064628.us-east-1.elb.amazonaws.com
core.timeout 300
```

## 设置 SSL 设置

在此示例中，HTTPS 的 SSL 证书验证设置为 `true`。

```bash
dcos config set core.ssl_verify true
```
如果命令成功，将不显示确认信息。

要验证属性是否已设置，请使用 `dcos config show`:

```bash
[core.ssl_verify]: set to 'true'
```


# 父命令

| 命令 | 说明 |
|---------|-------------|
|[dcos config](/cn/1.12/cli/command-reference/dcos-config/) | 管理 DC/OS 配置 |
