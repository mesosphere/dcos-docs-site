---
layout: layout.pug
excerpt: 使用 DC/OS 开源管理数据中心的安全
title: DC/OS 开源安全
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
menuWeight: 80
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

确保根据[保护群集](/mesosphere/dcos/1.13/administering-clusters/securing-your-cluster/) 的信息设置网络。

DC/OS 中的所有访问管理都通过 DC/OS 身份和访问管理器 (IAM) 进行。这包括用户帐户管理、登录和认证令牌分布。IAM 提供一个 HTTP API，用于以 RESTful 方式管理用户帐户。

可通过 [OpenID Connect 1.0] (https://openid.net/specs/openid-connect-core-1_0.html)获取认证令牌，这是位于 [OAuth 2.0](http://oauth.net/2/) 协议之上的身份层。

可以将本地用户和服务帐户配置为无外部依赖关系的登录并以安全的方式针对集群自动进行身份验证。

# 延伸阅读

- [让我们加密 DC/OS！](https://mesosphere.com/blog/2016/04/06/lets-encrypt-dcos/)：
  使用 [Let's Encrypt] 的博客帖子(https://letsencrypt.org/)，具有
  在 DC/OS 上运行的服务。

# 未来工作

我们期待与 DC/OS 社区合作，改进现有
安全功能，并在即将发布的版本中引入新功能。

# 后续步骤

- [了解 DC/OS 安全性](/mesosphere/dcos/1.13/administering-clusters/)
- [了解如何监控 DC/OS 群集](/mesosphere/dcos/1.13/monitoring/)
