---
layout: layout.pug
navigationTitle:  使用证书颁发机构 API
title: 使用证书颁发机构 API
menuWeight: 500
excerpt: 查看、创建和签署证书
enterprise: true
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


# 关于证书颁发机构 API

DC/OS 证书颁发机构 API 允许您查看 DC/OS Enterprise 所使用的 TLS 证书、创建证书签名请求 (CSR)<>以及让 DC/OS CA 签署 CSR 。

## 请求和响应格式

API 仅支持 JSON。您必须在 HTTP 标头中包含 `application/json` 作为 `Content-Type`，如下所示。

    Content-Type: application/json


## 主机名和基本路径

主机名将根据应用程序运行的位置而有所不同。

* 如果您的应用程序在 DC/OS 群集之外运行，那么您应该使用群集 URL。这可以通过启动 DC/OS UI 并从浏览器复制域名来获取。或者，您可以登录到 DC/OS CLI 并键入 `dcos config show core.dcos_url` 以获取群集 URL。在生产环境中，这应该是位于主服务器前面的负载均衡器的地址。

* 如果您的应用程序在群集内部运行，则使用 `master.mesos`。

将 `/ca/api/v2/` 附加到主机名，如下所示。

    https://<host-name-or-ip>/ca/api/v2/


# 身份验证和授权

如果您希望访问的端点需要身份认证，则需要具有以下权限之一的认证令牌：

- `dcos:superuser`
- `dcos:adminrouter:ops:ca:ro`
- `dcos:adminrouter:ops:ca:rw`

# 获取认证令牌

### 通过 IAM API

若要获取认证令牌，请将请求正文中具有必要权限的用户的用户名和密码传递给[身份和访问管理服务 API](/mesosphere/dcos/1.13/security/ent/iam-api/) 的 `/auth/login` 端点。它将返回认证令牌，如下所示。

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
}
```

### 通过 DC/OS CLI

使用 `dcos auth login` 登录 [DC/OS CLI](/mesosphere/dcos/1.13/cli/) 时，它会在本地存储认证令牌值。您可以在 cURL 命令中将此值引用为变量（在下一部分中讨论）。

或者，您可以使用以下命令获取认证令牌值。

```bash
dcos config show core.dcos_acs_token
```

## 传递认证令牌

### 通过 HTTP 标头

复制令牌值并将其传递到 HTTP 标头的 `Authorization` 字段中，如下所示。

```http
Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg
```

### 通过 `curl` 作为字符串值

例如，使用 `curl`，您将按以下方式传递此值。

```bash
curl -H "Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
```

### 通过 `curl` 作为 DC/OS CLI 变量

然后，您可以在 `curl` 命令中引用此值，如下所示。

```bash
curl -H "Authorization: token=$(dcos config show core.dcos_acs_token)"
```

## 刷新认证令牌

默认情况下，认证令牌在五天后过期。如果您的程序需要运行超过五天，则需要一个服务帐户。有关更多信息，请参阅[配置自定义服务](/mesosphere/dcos/1.13/security/ent/service-auth/custom-service-auth/)。

# API 参考

[swagger api='/mesosphere/dcos/1.13/api/certificate-authority.yaml']


# 日志记录

虽然 API 会返回信息性错误消息，但您也可能会发现检查服务日志很有用。有关说明，请参阅[服务和任务日志记录](/mesosphere/dcos/1.13/monitoring/logging/)。
