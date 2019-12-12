---
layout: layout.pug
navigationTitle: 本地用户帐户
title: 本地用户帐户管理
excerpt: 管理本地用户帐户
render: mustache
model: /mesosphere/dcos/1.13/data.yml
menuWeight: 20
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 添加本地用户帐户

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/cn/1.13/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/cn/1.13/security/oss/iam-api/) 来添加本地用户帐户，请用相应的值替换 `<uid>` 和 `<password>` 并执行以下命令：

```bash
curl -i -X PUT http://<host-ip>/acs/api/v1/users/<uid> -d '{"password": "<password>"}' -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

<p class="message--note"><strong>注意：</strong>密码长度必须至少为 5 个字符。</p>

# 列出本地用户帐户

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/cn/1.13/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 [身份和访问管理 (IAM) API](/mesosphere/dcos/cn/1.13/security/oss/iam-api/) 来列出所有已配置用户帐户，请执行以下命令：

```bash
curl -i -X GET http://<host-ip>/acs/api/v1/users -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

<p class="message--note"><strong>注意：</strong>这将包括外部用户帐户。本地用户帐户被列为 `provider_type: internal`。</p>

# 更改本地用户密码

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/cn/1.13/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/cn/1.13/security/oss/iam-api/) 来更改本地用户帐户的密码，请用相应的值替换 `<uid>` 和 `<password>` 并执行以下命令：

```bash
curl -i -X PATCH http://<host-ip>/acs/api/v1/users/<uid> -d '{"password": "<password>"}' -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

<p class="message--note"><strong>注意：</strong>密码长度必须至少为 5 个字符。</p>

# 删除本地用户帐户

## 使用 IAM API

**前提条件：**
- [DC/OS 认证令牌](/mesosphere/dcos/cn/1.13/security/oss/authentication/authentication-token/) 作为 `TOKEN` 导出到环境中。

要使用 DC/OS [身份和访问管理 (IAM) API](/mesosphere/dcos/cn/1.13/security/oss/iam-api/) 来删除本地用户帐户，请用相应的值替换 `<uid>` 并执行以下命令：

```bash
curl -i -X DELETE http://<host-ip>/acs/api/v1/users/<uid> -H 'Content-Type: application/json' -H "Authorization: token=$TOKEN"
```

## 使用 UI

1. 登录 UI。
2. 在 **用户** 界面中，选择 uid，然后单击 **删除**。
3. 单击 **Delete** 以确认操作。
