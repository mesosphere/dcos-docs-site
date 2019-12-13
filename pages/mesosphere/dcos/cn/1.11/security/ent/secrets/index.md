---
layout: layout.pug
navigationTitle: 密钥
title: 密钥
menuWeight: 60
excerpt: 了解密钥存储库

enterprise: true
---


DC/OS Enterprise 密钥存储库可以保护敏感信息，如数据库密码、API 令牌和私钥。在密钥路径中存储密钥让您限制哪些服务可以检索值。

[授权 Marathon 服务](/mesosphere/dcos/cn/1.11//security/ent/#spaces) 可以在部署时检索密钥，并在环境变量下存储其值。此外，[密钥 API](/mesosphere/dcos/cn/1.11/security/ent/secrets/secrets-api/) 让您[密封](/mesosphere/dcos/cn/1.11/security/ent/secrets/seal-store/)/[拆封](/mesosphere/dcos/cn/1.11/security/ent/secrets/unseal-store/)以及[重新初始化](/mesosphere/dcos/cn/1.11/security/ent/secrets/custom-key/)密钥存储库。

在[权限参考](/mesosphere/dcos/cn/1.11/security/ent/perms-reference/#secrets)部分中查找有关密钥的更多信息。
