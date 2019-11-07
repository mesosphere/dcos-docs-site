---
layout: layout.pug
navigationTitle:  强化
title: 强化
menuWeight: 100
excerpt: 增加群集的安全性
render: mustache
model：/mesosphere/dcos/2.0/data.yml
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


当您从 `permissive` 转为 `strict` [安全模式] (/mesosphere/dcos/2.0/security/ent/#security-modes) 时，您的群集将变得更加安全。但是，有许多设置可以独立于安全模式进行修改，以提高群集的安全性。

- 确保根据 [保护群集](/mesosphere/dcos/2.0/administering-clusters/securing-your-cluster/) 的信息设置网络。

- <a name="secure-flag"></a>设置 [`auth_cookie_secure_flag`](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#auth-cookie-secure-flag-enterprise) 为 `true`。

- <a name="zk"></a>不要使用默认 ZooKeeper 凭据。相反，为以下各项指定长的随机值：[`zk_super_credentials`](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#zk-superuser)、[`zk_master_credentials`](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#zk-master) 和 [`zk_agent_credentials`](/mesosphere/dcos/2.0/installing/production/advanced-configuration/configuration-reference/#zk-agent)。

- [获取 DC/OS CA 的根证书](/mesosphere/dcos/2.0/security/ent/tls-ssl/get-cert/#oob) 并手动配置 [浏览器](/mesosphere/dcos/2.0/security/ent/tls-ssl/ca-trust-browser/)、[DC/OS CLI](/mesosphere/dcos/2.0/security/ent/tls-ssl/ca-trust-cli/)、[curl](/mesosphere/dcos/2.0/security/ent/tls-ssl/ca-trust-curl/) 和其他客户端。

- [即使在可选的情况下，也可以使用服务帐户配置服务](/mesosphere/dcos/2.0/security/ent/service-auth/)。

- [使用密匙来存储敏感信息并将其传递给服务](/mesosphere/dcos/2.0/security/ent/secrets/)。

- [使用空间来限制对密匙的服务访问](/mesosphere/dcos/2.0//security/ent/#spaces)。

- 严格限制 SSH 密钥的分发。对于调试，请考虑使用 [`dcos task exec`](/mesosphere/dcos/2.0/monitoring/debugging/)。

- 坚持[最低权限原则]（http://searchsecurity.techtarget.com/definition/principle-of-least-privilege-POLP），并为您的用户提供他们所需的最低[权限] (/mesosphere/dcos/2.0/security/ent/perms-reference/)。避免授予用户或服务帐户 `dcos:superuser` 权限。

- 如果[配置外部 LDAP 目录](/mesosphere/dcos/2.0/security/ent/ldap/ldap-conn/)，请选择**对所有连接使用 SSL/TLS**或 **尝试 StarTtLS，如果失败则中止，并在 **CA certificate chain (Optional)** 字段中提供根 CA 根证书以及 LDAP 目录服务器的任何中间证书。

- [覆盖服务的 Linux 用户帐户](/mesosphere/dcos/2.0/security/ent/users-groups/config-linux-user/)以使用权限较低的帐户，如 `nobody`。

