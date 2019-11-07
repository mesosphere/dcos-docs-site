---
layout: layout.pug
navigationTitle:  LDAP 身份认证
title: LDAP 身份认证
menuWeight: 50
excerpt: 通过 LDAP 设置基于目录的身份认证服务器
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


如果您的组织将用户记录存储在支持轻量目录访问协议 (LDAP) 的目录服务器中，则可以配置 DC/OS Enterprise 来检查用户凭据。这允许您避免在 DC/OS 中重新创建用户帐户。在版本 1.12 及更高版本中，DCOS 会定期[与您的 LDAP 同步] (/mesosphere/dcos/2.0/security/ent/ldap/ldap-sync/)，从而让您的群组和用户更轻松地保持最新状态。

在用户尝试登录时，DC/OS 将要求远程 LDAP 服务器验证凭据。DC/OS 从不接收或存储远程用户的密码。因此，如果 DC/OS 无法连接到远程 LDAP，如有人更改或删除 LDAP 配置，则用户的登录将失败。DC/OS 存储用户的内部表达以允许 DC/OS 管理员将用户放入组并分配权限。

如果 LDAP 用户名在 [可分辨名称 (DN)](https://www.ldap.com/ldap-dns-and-rdns) 中，则可以使用简单绑定连接到 LDAP 目录。否则，搜索/绑定连接应涵盖所有其他情况。

查看 [管理用户和组] 中的 DC/OS 用户 ID 要求(/mesosphere/dcos/2.0/security/ent/users-groups/)。

**要求** 目录服务器必须支持 [LDAP 3](https://tools.ietf.org/html/rfc4511)。

若要设置 LDAP 连接，请执行以下操作:

1. [配置您的连接](/mesosphere/dcos/2.0/security/ent/ldap/ldap-conn/)。

2. [配置身份认证](/mesosphere/dcos/2.0/security/ent/ldap/ldap-auth/)。

3. [验证连接](/mesosphere/dcos/2.0/security/ent/ldap/ldap-verify/)。
