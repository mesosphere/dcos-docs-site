---
layout: layout.pug
navigationTitle:  本地用户登录
title: 本地用户登录
excerpt: 以本地用户地身份登录到 DC/OS
render: mustache
model: /mesosphere/dcos/2.0/data.yml
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 使用 DC/OS CLI 登录

**前提条件：**
- [DC/OS CLI](/mesosphere/dcos/cn/2.0/cli/)

使用 [DC/OS CLI](/mesosphere/dcos/cn/2.0/cli/)，可以通过指定 `dcos-users` 登录提供商，以本地 DC/OS 用户的身份登录。

1. 要通过 DC/OS CLI 登录，请替换以下 [auth login](/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-auth/dcos-auth-login/) 命令中的 `uid` 和 `password`：

    ```bash
    dcos auth login --provider=dcos-users --username=<uid> --password=<password>
    ```

1. 通过执行以下命令来显示 DC/OS 认证令牌：

    ```bash
    dcos config show core.dcos_acs_token
    ```

1. 将 DC/OS 认证令牌导出到环境中，以便在其他命令中使用：

    ```bash
    export TOKEN=$(dcos config show core.dcos_acs_token)
    ```

# 使用 IAM API 登录

本地用户可以使用 [身份和访问管理 (IAM) API](/mesosphere/dcos/cn/2.0/security/oss/iam-api/) 登录。

1. 要登录本地用户账户，请替换以下命令中的 `<uid>` 和 `<password>`：

    ```bash
    curl -X POST http://<host-ip>/acs/api/v1/auth/login -d '{"uid": "<uid>", "password": "<password>"}' -H 'Content-Type: application/json'
    ```

1. HTTP 响应主体中将返回与以下内容类似的 DC/OS 认证令牌：

    ```json
    {
      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJib290c3RyYXB1c2VyIiwiZXhwIjoxNDgyNjE1NDU2fQ.j3_31keWvK15shfh_BII7w_10MgAj4ay700Rub5cfNHyIBrWOXbedxdKYZN6ILW9vLt3t5uCAExOOFWJkYcsI0sVFcM1HSV6oIBvJ6UHAmS9XPqfZoGh0PIqXjE0kg0h0V5jjaeX15hk-LQkp7HXSJ-V7d2dXdF6HZy3GgwFmg0Ayhbz3tf9OWMsXgvy_ikqZEKbmPpYO41VaBXCwWPmnP0PryTtwaNHvCJo90ra85vV85C02NEdRHB7sqe4lKH_rnpz980UCmXdJrpO4eTEV7FsWGlFBuF5GAy7_kbAfi_1vY6b3ufSuwiuOKKunMpas9_NfDe7UysfPVHlAxJJgg"
    }
    ```
