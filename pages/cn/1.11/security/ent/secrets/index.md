---
layout: layout.pug
navigationTitle: 保密认证信息
title: 保密认证信息
menuWeight: 60
excerpt: 了解保密认证信息存储库

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS Enterprise 保密认证信息存储库可以保护敏感信息，如数据库密码、API 令牌和私钥。在保密路径中存储保密认证信息让您限制哪些服务可以检索值。

[授权 Marathon 服务](/cn/1.11//security/ent/#spaces) 可以在部署时检索保密认证信息，并在环境变量下存储其值。此外，[保密认证信息 API](/cn/1.11/security/ent/secrets/secrets-api/) 让您[密封](/cn/1.11/security/ent/secrets/seal-store/)/[拆封](/cn/1.11/security/ent/secrets/unseal-store/)以及[重新初始化](/cn/1.11/security/ent/secrets/custom-key/)保密认证信息存储库。

在[权限参考](/cn/1.11/security/ent/perms-reference/#secrets)部分中查找有关保密认证信息的更多信息。
