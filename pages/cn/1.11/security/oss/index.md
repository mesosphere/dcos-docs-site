---
layout: layout.pug
excerpt: 管理使用 DC/OS 开源管理数据中心的安全
title: DC/OS 开源安全
menuWeight: 80
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

您可以使用 DC/OS [oauth](https://github.com/dcos/dcos-oauth) 在数据中心启用身份认证。通过 DC/OS Web 界面管理身份认证。Admin Router 执行访问控制。

开箱即用 DC/OS 具有 OpenID Connect 端点，位于 [dcos.auth0.com](https://dcos.auth0.com/.well-known/openid-configuration)（与 [Auth0] 合作(https://auth0.com/)）， 与 Google、GiThub 和 Microsoft 连接，为 DC/OS 安装提供基本身份认证。DC/OS 自动添加登录到 DC/OS 集群的第一个用户。

DC/OS 使用 JSON Web 令牌 (JWT) 格式作为其认证令牌。JWT 是一种开放的行业标准 ([RFC）
7519](https://tools.ietf.org/html/rfc7519)) 方法，用于安全地代表两方之间的要求。JWT 是使用
[OpenID Connect 1.0](https://openid.net/specs/openid-connect-core-1_0.html) 获取的，它是在
[OAuth 2.0](http://oauth.net/2/) 协议之上构建的简单身份层。

DC/OS OAuth 提供一个 HTTP API，用于以 RESTful 的方式管理本地用户。

![Auth0 标记](/cn/1.11/img/a0-badge-light.png)
