---
layout: layout.pug
navigationTitle: 身份和访问管理 API
title: 身份和访问管理 API
menuWeight: 40
excerpt: 使用 DC/OS 身份和访问管理 API
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

身份和访问管理 API 允许您通过 RESTful 界面管理用户。

# 请求和响应格式

API 仅支持 `JSON`。您必须在 HTTP 标头中包含 `application/json` 作为 `Content-Type`，如下所示。
```bash
    Content-Type: application/json
```
# 主机名和基础路径

要使用的主机名会根据程序运行的位置而有所不同。

* 如果您的程序在 DC/OS 群集之外运行，则应该使用群集 URL。这可以通过启动 DC/OS Web 界面并从浏览器复制域名来获取。或者，您可以登录到 DC/OS CLI 并键入 `dcos config show core.dcos_url` 以获取群集 URL。在生产环境中，这应该是位于主服务器前面的负载均衡器的路径。

* 如果您的程序在群集内部运行，则应使用 `master.mesos`。

将 `/acs/api/v1` 附加到主机名，如下所示。
```text
    http://<host-ip>/acs/api/v1
```

# 验证

所有 IAM 端点都需要认证令牌，`auth` 端点除外。`auth` 端点不需要认证令牌，因为它们的目的是在成功登录后返回认证令牌。

# 用户管理

DC/OS Open Source 支持可通过 `/users` API 端点管理的三种用户类型。

[用户账户管理](/mesosphere/dcos/2.0/security/oss/user-account-management/) 文档详细说明了可用操作的调用。

# 认证令牌验证

IAM 可以通过`/auth/jwks`API 端点为第三方实体提供公钥信息，以便带外验证 DC/OS 认证令牌。

请参阅 [带外令牌验证](/mesosphere/dcos/2.0/security/oss/authentication/out-of-band-verification/)，了解如何代表 IAM 实施认证令牌验证。

# API 参考

[swagger api='/mesosphere/dcos/2.0/api/oss-iam.yaml']

# 日志记录

虽然 API 会返回信息性错误消息，但您也可能会发现检查服务日志很有用。有关说明，请参阅[服务和任务日志记录](/mesosphere/dcos/2.0/monitoring/logging/)。

