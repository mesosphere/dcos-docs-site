---
layout: layout.pug
navigationTitle: DC/OS Authentication Token
title: DC/OS Authentication Token
excerpt: Getting familiar with DC/OS Authentication tokens
render: mustache
model: /data.yml
menuWeight: 10
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS uses JSON Web Tokens for authenticating requests to the cluster. In DC/OS terminology, these are named `DC/OS Authentication tokens`. The Identity and Access Manager is the only entity in the cluster that issues DC/OS Authentication tokens.

# DC/OS Authentication token format

A DC/OS Authentication token is a RFC 7519 JSON Web Token (JWT) of type RS256. The JWT payload contains the user or service ID that the token was issued for in the (`uid`) claim and an (`exp`) claim indicating the time after which the token will be considered invalid.

JWT Header
```json
{
    "alg": "RS256",
    "typ": "JWT"
}
```

JWT Payload
```json
{
    "uid": "<uid>",
    "exp": <expiration_time>
}
```

In the process of generating a new DC/OS Authentication token, the IAM signs the token with its private key. DC/OS Authentication tokens can be inspected via [jwt.io](https://jwt.io) or via your favorite JWT library.

# Lifetime and renewal

In DC/OS Open Source, Authentication tokens are valid for five days after they have been issued. After five days, you must log in again to obtain a new token. Using [service accounts](/1.13/security/oss/user-account-management/service-accounts/) and the [service login](/1.13/security/oss/login/service-login/) make it easy to automate this process when deploying long-running services.

# Obtain a DC/OS Authentication token

DC/OS authentication tokens can be obtained by any registered user of the cluster. The way to obtain a DC/OS authentication is by logging in to DC/OS. The login method varies by interface and user type.

If you want to get an authentication token then you can refer to the following types of user specific login documentations.

* [External user login](/1.13/security/oss/login/external-user-login/)
* [Local user login](/1.13/security/oss/login/local-user-login/)
* [Service login](/1.13/security/oss/login/service-login/)

# Pass an Authentication token to the API

## Prerequisite
- [DC/OS Authentication token](/1.13/security/oss/authentication/authentication-token/)

You can make external calls to HTTP API endpoints of your DC/OS cluster. You must first obtain an authentication token and then include it in your HTTP request.
A DC/OS Authentication token must be passed in the `Authorization` HTTP header. The header value must start with `token=` followed by the token, as shown below.

```http
Authorization: token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg
```

<p class="message--important"><strong>IMPORTANT: </strong>Formats like `Bearer <token>` are not supported.</p>
