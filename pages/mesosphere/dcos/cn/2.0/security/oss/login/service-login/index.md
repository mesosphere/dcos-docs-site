---
layout: layout.pug
navigationTitle:  服务登录
title: 服务登录
excerpt: 以服务身份登录到 DC/OS
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
menuWeight: 30
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 安全服务登录

通过以加密安全的方式输入服务登录令牌，服务无需发送密码即可登录 DC/OS。

服务登录令牌始终由希望执行服务登录的服务生成，理想情况下是按需生成。目的是仅针对一次性使用（例如，针对单个服务登录过程）来生成令牌。因此，任何服务登录令牌都应包括到期时间。

通过服务登录令牌（由生成该令牌的服务的私钥签名）来启用安全服务登录。

# 使用 DC/OS CLI 登录 

<p class="message--note"><strong>注意：</strong>这演示了服务账户测试的手动登录。内部生成用于登录过程的服务登录令牌。</p>

**前提条件：**
- [DC/OS CLI](/mesosphere/dcos/2.0/cli/)

使用 [DC/OS CLI](/mesosphere/dcos/2.0/cli/)，可以通过指定 `dcos-services` 登录提供商，以服务的身份登录。

要使用 DC/OS CLI 来测试服务登录，请通过 [auth login](/mesosphere/dcos/2.0/cli/command-reference/dcos-auth/dcos-auth-login/) 命令指定 `dcos-services` 登录提供商。在执行以下命令之前，先用相应的值替换 `<service-account-id>` 和 `<private-key-path>`：

```bash
dcos auth login --provider=dcos-users --username=<service-account-id> --private-key=<private-key-path>
```

# 使用 IAM API 登录

## 构建服务登录令牌

对于 DC/OS，服务登录令牌必须为 RS256 类型的 RFC 7519 JSON Web 令牌 (JWT)。

DC/OS 的服务登录令牌是通过将服务账户 ID（借助 (`uid`) 声明）和以 Unix 秒为单位的到期时间（借助 (`exp`) 声明）添加到 JWT 有效负载中来构建的。JWT 标头必须指定 RS256 算法。令牌由服务账户的私钥进行签名。

1. 标头
    ```json
    {
        "alg": "RS256",
        "typ": "JWT"
    }
    ```

1. 有效负载
    ```json
    {
        "uid": "<uid>",
        "exp": <expiration_time>
    }
    ```

服务登录令牌可通过 [jwt.io](https://jwt.io) 或者通过您最喜欢的 JWT 库手动创建。

<p class="message--note"><strong>注意：</strong>服务登录令牌和 DC/OS 认证令牌是具有相同声明的 RS256 型 JWT。但是，它们不可互换。服务登录令牌由服务私钥签名，而 DC/OS 认证令牌由 IAM 私钥签署。</p>

## 使用服务登录令牌登录

**前提条件：**
- [服务登录令牌](/mesosphere/dcos/2.0/security/oss/authentication/authentication-token/service-login/#generate-a-service-login-token)

在服务登录期间，服务登录令牌会被发送到 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/2.0/security/oss/iam-api/)。

<p class="message--note"><strong>注意：</strong>IAM 将拒绝使用生命期超过 10 分钟的服务登录令牌。</p>


1. 要登录某个服务，请在执行以下命令之前提供 `<service-account-id>` 和 `<service-login-token>`：

    ```bash
    curl -k -X POST https://<host-ip>/acs/api/v1/auth/login -d '{"uid": "<service-account-id>", "token": "<service-login-token>"}' -H 'Content-Type: application/json'
    ```

1. HTTP 响应主体中将返回与以下示例类似的 DC/OS 认证令牌。

    ```json
    {
      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
    }
    ```

# 认证令牌续订

在 DC/OS Open Source 中，认证令牌在五天后过期。服务账户登录用于长期运行服务，可自动获取新的 DC/OS 认证令牌。当同时要进行多个令牌续订时，有多种缓解 IAM 上负载的策略。

理想情况下，服务应计算认证令牌到期之前的时间长度，该时间长度嵌入令牌本身，并在它到期之前请求新的令牌。但是，服务也可以等待，直到其收到 `401` 以请求新的认证令牌。

API 使用者应能够在当前认证令牌到期时处理。

* **过期后续订** 使用此方法，您会在收到“无效令牌”响应后获得新的认证令牌。使用 401 HTTP 状态代码响应无效认证令牌，并且该服务重新调用服务帐户登录程序。尝试获取新的认证令牌（通过重试和后退）。在服务没有有效认证令牌的期间，服务可能需要阻止操作，从而导致延迟峰值。
* **到期前续订** 使用此方法，令牌将在到期前刷新。服务可以在到期之前安排异步令牌续订。它可以获取新的认证令牌，而旧的认证令牌仍然有效。这可防止由过期认证令牌引起的延迟峰值。
