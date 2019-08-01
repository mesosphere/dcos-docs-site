---
layout: layout.pug
navigationTitle: 认证架构
excerpt: 了解认证操作
title: 认证架构
menuWeight: 1
---

通过 DC/OS UI 进行的认证操作如下所述：

1. 在浏览器中打开群集首页 URL。
2. 如果您有有效的 [认证令牌](/mesosphere/dcos/cn/1.12/security/oss/managing-authentication#log-in-cli) cookie（由 Admin Router 检查），则可以转到群集首页。如果没有，您将重定向至登录页面。
3. DC/OS UI 中的登录页面在 iframe 中 `dcos.auth0.com` 载入登录页面，您可以选择身份提供商，包括 Google、GitHub 和 Microsoft 帐户。
4. 选择一个身份提供商，然后在弹出窗口中完成 OAuth 协议流，它会返回一个 RS256 签名 JWT。根据标准 `exp` 请求，发布的此用户令牌目前有效期为五天。
5. 登录页面将带有您的用户令牌的请求发送到 `http://<master-host-name>/acs/api/v1/auth/login` Admin Router 端点，该端点将其转发到 [dcos-oauth](https://github.com/dcos/dcos-oauth) 服务。如果您是第一个访问群集的用户，则会自动创建一个帐户。任何后续用户必须由群集中的任何其他用户添加，如 [用户管理](/mesosphere/dcos/cn/1.12/security/oss/user-management/) 页面中所述。如果确定登录到群集的用户有效，则会向他们发出包含 `uid` 请求的 HS256 签名 JWT，该请求特定于要登录的群集。

对于 `dcos-oauth` 用来验证它在登录操作期间收到的令牌的服务，
该服务必须有权访问 `dcos.auth0.com` 才能通过
HTTPS 取得所需的公共密钥。目前不支持使用代理进行此请求。

用来与 HS256 算法签署群集特定令牌的共享秘密
在群集启动期间生成，并存储在
每个管理节点上的 `/var/lib/dcos/auth-token-secret` 和
ZooKeeper 的 `/dcos/auth-token-secret` znode 中。

如上所述，为方便设置进程，DC/OS 自动添加第一个
登录到 DC/OS 群集的用户。确保限制
群集的网络访问权限，直到第一个用户已配置。

确保保护认证令牌，因为未经授权的
第三方若获得的情况下可以使用它们登录您的群集。目前不支持使
单个令牌失效。如果令牌暴露，
建议将受影响的用户从群集中移除。

[JWT.IO](https://jwt.io) 服务可用于解码 JWT，以检查
其内容。
