---
layout: layout.pug
navigationTitle: DC/OS 认证令牌
title: DC/OS 认证令牌
excerpt: 了解 DC/OS 认证令牌
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
menuWeight: 10
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS 使用 JSON Web 令牌来认证对群集的请求。在 DC/OS 术语中，这些被称为 `DC/OS Authentication tokens`。身份和访问管理是群集中唯一发放 DC/OS 认证令牌的实体。

# DC/OS 认证令牌格式

DC/OS 认证令牌是 RS256 类型的 RFC 7519 JSON Web 令牌 (JWT)。JWT 有效负载包含在 (`uid`) 声明和 (`exp`) 声明（指出多长时间之后将令牌视为无效）中为其发放令牌的用户或服务 ID。

JWT 标头
```json
{
    "alg": "RS256",
    "typ": "JWT"
}
```

JWT 有效负载
```json
{
    "uid": "<uid>",
    "exp": <expiration_time>
}
```

在生成新 DC/OS 认证令牌的过程中，IAM 使用其私钥签署令牌。DC/OS 认证令牌可通过 [jwt.io](https://jwt.io) 或通过您最喜欢的 JWT 库进行检查。

# 生命周期和续订

在 DC/OS Open Source 中，认证令牌在发放后的五天内有效。五天后，您必须再次登录才能获取新的令牌。使用 [服务账户](/mesosphere/dcos/2.0/security/oss/user-account-management/service-accounts/) 和 [服务登录](/mesosphere/dcos/2.0/security/oss/login/service-login/) 可在部署长期运行服务时轻松自动化该过程。

# 获取 DC/OS 认证令牌

群集的任何注册用户都可以获取 DC/OS 认证令牌。获得 DC/OS 认证的方法是登录 DC/OS。登录方法因界面和用户类型而异。

若要获得认证令牌，您可以参考以下类型的用户特定登录文档。

* [外部用户登录](/mesosphere/dcos/2.0/security/oss/login/external-user-login/)
* [本地用户登录](/mesosphere/dcos/2.0/security/oss/login/local-user-login/)
* [服务登录](/mesosphere/dcos/2.0/security/oss/login/service-login/)

# 将认证令牌传递到 API

## 先决条件
- [DC/OS 认证令牌](/mesosphere/dcos/2.0/security/oss/authentication/authentication-token/)

您可以对 DC/OS 群集的 HTTP API 端点进行外部调用。您必须首先获取认证令牌，然后将其纳入您的 HTTP 请求中。
DC/OS 认证令牌必须在 `Authorization` HTTP 标头中传递。标头值必须以 `token=` 开头，后跟令牌，如下所示。

```http
Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg
```

<p class="message--important"><strong>重要信息：</strong>`Bearer <token>` 等格式不受支持。</p>
