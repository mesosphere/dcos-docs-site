---
layout: layout.pug
navigationTitle: 登录
title: 登录
excerpt: 登录到 DC/OS 群集
menuWeight: 20
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

# 用户登录

对于 DC/OS 来说，登录是交换 [DC/OS 认证令牌] 用户凭据的过程(/mesosphere/dcos/1.14/security/oss/authentication/authentication-token/)。

用户必须获得 DC/OS 认证才能使用 DC/OS 群集。在 DC/OS 中，认证令牌的使用期限为五天。认证令牌到期后，用户必须再次登录。

DC/OS 处理多种用户类型。可通过 [IAM API] 管理用户账户(/mesosphere/dcos/1.14/security/oss/iam-api/)；参见 [用户管理](/mesosphere/dcos/1.14/security/oss/user-management/)。

不同用户类型有不同的登录方法，但每一个都会产生一个 DC/OS 认证令牌：

* **外部用户登录**：外部用户账户只能通过 Auth0（使用其 Google、GitHub 或 Microsoft 凭据）以单点登录的方式登录。
* **本地用户登录**：本地用户通过输入密码来登录，该密码与 DC/OS 中存储的密码哈希进行比较。
* **服务登录**：服务通过输入一个短暂的“服务登录令牌”来登录，该令牌使用存储在 DC/OS 中的服务账户公钥来验证其签名。

# 用户登出

用户无法主动登出 DC/OS。只要颁发的 DC/OS 认证令牌存在且有效，那么被颁发该令牌的用户就可以操作 DC/OS 群集。但是，用户可以决定删除其拥有的任何有效的 DC/OS 认证令牌。DC/OS CLI [auth logout](/mesosphere/dcos/1.14/cli/command-reference/dcos-auth/dcos-auth-logout/) 命令就是这样操作的。

<p class="message--note"><strong>注意：</strong>无法撤销对 DC/OS 群集的访问，除非等到认证令牌到期。</p>
