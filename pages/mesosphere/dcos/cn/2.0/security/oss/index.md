---
layout: layout.pug
excerpt: 使用 DC/OS 开源管理数据中心的安全
title: DC/OS 开源安全
render: mustache
model：/mesosphere/dcos/2.0/data.yml
menuWeight: 80
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

确保根据 [保护群集](/mesosphere/dcos/2.0/administering-clusters/securing-your-cluster/) 的信息设置网络。

DC/OS 中的所有访问管理都通过 DC/OS 身份和访问管理 (IAM) 进行。这包括用户账户管理、登录和认证令牌分发。IAM 提供一个 HTTP API，用于以 RESTful 方式管理用户账户。

可通过 [OpenID Connect 1.0](https://openid.net/specs/openid-connect-core-1_0.html) 获取认证令牌，这是位于 [OAuth 2.0](http://oauth.net/2/) 协议之上的身份层。

可以将本地用户和服务账户配置为不需要外部依赖关系就可登录，以及以安全的方式针对群集自动认证。

# 延伸阅读

- [让我们加密 DC/OS！](https://mesosphere.com/blog/2016/04/06/lets-encrypt-dcos/)：
  使用 [Let's Encrypt] 的博客帖子(https://letsencrypt.org/)，具有
  在 DC/OS 上运行的服务。

# 未来工作

我们期待与 DC/OS 社区合作，改进现有
安全功能，并在即将发布的版本中引入新功能。

# 后续步骤

- [了解 DC/OS 安全性](/mesosphere/dcos/2.0/administering-clusters/)
- [了解如何监控 DC/OS 群集](/mesosphere/dcos/2.0/monitoring/)
