---
layout: layout.pug
navigationTitle: HTTP API 端点身份认证
menuWeight: 42
excerpt: 使用 HTTP API 端点进行身份认证
title: HTTP API 端点身份认证
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可以对 DC/OS 集群中的 HTTP API 端点进行外部调用。您必须首先获取认证令牌，然后将其纳入您的 HTTP 请求中。认证令牌在五天后过期。您可以在 JSON Web 令牌 (JWT) 的 ["exp"（到期时间）要求](https://tools.ietf.org/html/rfc7519#section-4.1.4) 中查看到期时间。重新登录 DC/OS，刷新令牌。

# 获取认证令牌

使用 DC/OS CLI 获取认证令牌。登录 DC/OS CLI 时，将 OpenID Connect ID 令牌粘贴到终端提示符中。此 OpenID Connect ID 令牌将您记录到 DC/OS CLI 中，但不允许您访问 HTTP API 端点。您必须获取认证令牌才能获得对 HTTP API 端点的访问权限。完成以下步骤以获取认证令牌。

1. [登录到 DC/OS CLI](/cn/1.11/security/oss/managing-authentication/#logging-in-to-the-dcos-cli)。登录 DC/OS CLI 会导致您的认证令牌被写入配置文件。

2. 使用以下命令确认此写入成功，并查看您的认证令牌。

```bash
dcos config show core.dcos_acs_token
```

# 将认证令牌传递到 DC/OS 端点

DC/OS 端点预计在 HTTP 报文头的 `Authorization` 字段中找到您的认证令牌，如下所示。

```http
Authorization: token=<authentication-token>
```

凭借 `cURL`，您可以使用命令替换来从配置文件中提取令牌值。以下示例说明了此语法。

**Marathon 请求示例：**

```bash
curl --header "Authorization: token=$(dcos config show core.dcos_acs_token)" http://<master-host-name>/service/marathon/v2/apps
```

**Mesos 请求示例：**

```bash
curl --header "Authorization: token=$(dcos config show core.dcos_acs_token)" http://<master-host-name>/mesos/master/state.json
```
