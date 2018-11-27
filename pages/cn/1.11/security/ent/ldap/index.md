---
layout: layout.pug
navigationTitle: LDAP 身份认证
title: LDAP 身份认证
menuWeight: 50
excerpt: 通过 LDAP 设置基于目录的身份认证服务器
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


如果您的组织将用户记录存储在支持 LDAP 的目录服务器中，则可以配置 DC/OS Enterprise 来检查用户凭据。这允许您避免在 DC/OS 中重新创建用户帐户。

在用户尝试登录时，DC/OS 将要求远程 LDAP 服务器验证凭据。DC/OS 从不接收或存储远程用户的密码。因此，如果 DC/OS 无法连接到远程 LDAP，如有人更改或删除 LDAP 配置，则用户的登录将失败。DC/OS 存储用户的内部表达以让 DC/OS 管理员将用户放入组并分配权限。

如果 LDAP 用户名在 [可分辨名称 (DN)](https://www.ldap.com/ldap-dns-and-rdns) 中，则可以使用简单绑定连接到 LDAP 目录。否则，搜索/绑定连接应涵盖所有其他情况。

查看 [管理用户和组] 中的 DC/OS 用户 ID 要求(/1.11/security/ent/users-groups/)。

**要求** 目录服务器必须支持 [LDAP 3](https://tools.ietf.org/html/rfc4511)。

若要设置 LDAP 连接，请执行以下操作:

1. [配置您的连接](/cn/1.11/security/ent/ldap/ldap-conn/)。

2. [配置身份认证](/cn/1.11/security/ent/ldap/ldap-auth/)。

3. [验证连接](/cn/1.11/security/ent/ldap/ldap-verify/)。
