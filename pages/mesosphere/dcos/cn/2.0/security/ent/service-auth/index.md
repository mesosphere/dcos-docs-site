---
layout: layout.pug
navigationTitle:  服务认证
title: 服务认证
menuWeight: 80
excerpt: 认证服务帐户
enterprise: true
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

服务帐户与公私密钥对、密匙、权限和认证令牌一起使用，以提供 DC/OS [服务](/mesosphere/dcos/2.0/overview/concepts/#dcos-service) 对 DC/OS 的访问权限。服务帐户控制允许服务进行的通信和 DC/OS API 操作。

DC/OS 服务需要进行身份认证，具体取决于您的安全模式。

| 安全模式 | 群集内通信 | 外部群集通信 |
|---------------|-----------------------|----------------------------|
| 宽容    | 可选              | 必需                   |
| 严格        | 必需              | 必需                   |

## 服务身份认证组件
要验证服务身份，您将需要：

- 公私密钥对
- 服务帐户
- 服务帐户密匙
- 服务帐户权限
- 服务登录令牌

### JSON Web 令牌 (JWT)
服务身份认证涉及两个用于服务身份认证 JSON Web 令牌 (JWT)。

- **服务登录令牌** 要登录到 DC/OS，需要**服务登录令牌**。这是使用服务私钥签名的 JWT，用作一次性密码。应为一次性使用生成服务登录令牌（例如，用于单次服务登录程序），并应包括到期时间。

-  **认证令牌** 在服务使用服务登录令牌连接到 DC/OS 后，IAM 服务会创建一个 **认证令牌**，然后服务可以使用该令牌来验证其对 DC/OS 的传出请求。认证令牌可用于长期访问。

### Mesos 身份认证主体
DC/OS 服务在向 Mesos 主节点注册时提供主体。在[严格安全模式](/mesosphere/dcos/2.0/security/ent/#security-modes)下，服务帐户名称必须与 `principal` 中指定的名称相匹配。有关 principal 的更多信息，请参阅 [Mesos 文档]（http://mesos.apache.org/documentation/latest/authorization/）。

下图说明了这一顺序。

![服务身份认证](/mesosphere/dcos/2.0/img/authn-service.png)

图 1. 服务身份认证
