---
layout: layout.pug
navigationTitle: 安全强化
title: 安全强化
menuWeight: 100
excerpt: 增加集群的安全性
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


当您从 `disabled` 转为 `permissive` 转为 `strict` [安全模式](/cn/1.11/security/ent/#security-modes)时，您的集群将变得更加安全。但是，有许多设置可以独立于安全模式进行修改，以提高集群的安全性。

- <a name="secure-flag"></a>在 `permissive` 和 `strict` 模式下，将[`auth_cookie_secure_flag`](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#auth-cookie-secure-flag-enterprise) 设置为 `true`。

- <a name="zk"></a>不要使用默认 ZooKeeper 凭据。而是为以下内容指定长的随机值：[`zk_super_credentials`](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#zk-superuser)、[`zk_master_credentials`](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#zk-master) 和 [`zk_agent_credentials`](/cn/1.11/installing/ent/custom/configuration/configuration-parameters/#zk-agent)。

- [获取 DC/OS CA 的根证书](/cn/1.11/security/ent/tls-ssl/get-cert/#oob) 并手动配置 [浏览器](/cn/1.11/security/ent/tls-ssl/ca-trust-browser/)、[DC/OS CLI](/cn/1.11/security/ent/tls-ssl/ca-trust-cli/)、[curl](/cn/1.11/security/ent/tls-ssl/ca-trust-curl/) 和其他客户端。

- [使用自定义密匙对重新初始化您的密钥存储库](/cn/1.11/security/ent/secrets/custom-key/) 并将自定义密匙存储在非常安全的位置。
- [即使在可选的情况下，也可以使用服务帐户配置服务](/cn/1.11/security/ent/service-auth/)。

- [使用密匙来存储敏感信息并将其传递给服务](/cn/1.11/security/ent/secrets/)。

- [使用空间来限制对密匙的服务访问](/cn/1.11//security/ent/#spaces)。

- 严格限制 SSH 密钥的分发。对于调试，请考虑使用 [`dcos task exec`](/cn/1.11/monitoring/debugging/)。

- 遵守 [最小权限原则](http://searchsecurity.techtarget.com/definition/principle-of-least-privilege-POLP) 并只向您的用户提供他们所需的最低 [权限](/cn/1.11/security/ent/perms-reference/)。避免授予用户或服务帐户 `dcos:superuser` 权限。

- 如果[配置外部 LDAP 目录](/cn/1.11/security/ent/ldap/ldap-conn/)，请选择**对所有连接使用 SSL/TLS**或 **尝试 StarTtLS，如果失败则中止，并在 **CA certificate chain (Optional)** 字段中提供 CA 根证书以及 LDAP 目录服务器的任何中间证书。

- [覆盖服务的 Linux 用户帐户](/cn/1.11/security/ent/users-groups/config-linux-user/)以使用权限较低的帐户，如 `nobody`。
