---
layout: layout.pug
navigationTitle: 密钥 API
title: 密钥 API
menuWeight: 6
excerpt: 了解密钥 API

enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->



# 关于密钥 API

通过密钥 API，您可以管理密钥，并执行一些后端功能，例如密封和拆封密钥存储库。它提供比 DC/OS GUI 更多的功能。

# 请求和响应格式

API 仅支持 JSON。您必须在 HTTP 报文头中包含 `application/json` 作为 `Content-Type`，如下所示。

 Content-Type: application/json


# 主机名和基础路径

要使用的主机名根据应用程序运行的位置而异。

* 如果您的应用程序在 DC/OS 集群之外运行，则应该使用集群 URL。若要获取集群 URL，请启动 DC/OS GUI，并从浏览器复制域名。在生产环境中，这应该是位于管理节点前面的负载均衡器的路径。

* 如果您的应用程序在集群内部运行，则使用 `master.mesos`。

将 `/secrets/v1/<api_endpoint>` 附加到主机名，如下所示。

 https://<host-name-or-ip>/secrets/v1/<api_endpoint>


# 身份验证和授权

# 关于身份认证和授权

所有密钥 API 端点都需要身份认证令牌。

# 获取身份认证令牌

### 通过 IAM API

若要获取认证令牌，请将请求正文中 `superuser` 的用户名和密码传递给[身份和访问管理服务 API](/cn/1.11/security/ent/iam-api/) 的 `/auth/login` 端点。它将返回认证令牌，如下所示。

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
}
```

### 通过 DC/OS CLI

使用 `dcos auth login` 登录 [DC/OS CLI](/cn/1.11/cli/) 时，它会在本地存储认证令牌值。您可以在 `curl` 命令中将此值引用为变量（在下一部分中讨论）。或者，您可以使用以下命令获取身份认证令牌值：

```bash
dcos config show core.dcos_acs_token
```

## 通过传递认证令牌

您可以通过 HTTP 报文头或使用 curl 作为字符串变量或 DC/OS CLI 变量传递认证令牌。

### 通过 HTTP 报文头

复制令牌值并将其传递到 HTTP 报文头的 `Authorization` 字段中，如下所示。

```http
Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg
```

### 通过 curl 作为字符串值

例如，使用 `curl`，您将按以下方式传递此值。

```bash
curl -H "Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
```

### 通过 curl 作为 DC/OS CLI 变量

然后，您可以在 `curl` 命令中引用此值，如下所示。

```bash
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

## 刷新身份认证令牌

默认情况下，身份认证令牌在五天后过期。如果您的程序需要运行超过五天，则需要一个服务帐户。有关更多信息，请参阅[配置自定义服务](/cn/1.11/security/ent/service-auth/custom-service-auth/)。


# API 参考

[swagger api='/1.11/api/secrets.yaml']


# 日志记录

虽然 API 会返回有用的错误消息，但您也可能会发现检查服务日志很有用。有关说明，请参阅[服务和任务日志记录](/cn/1.11/monitoring/logging/)。
