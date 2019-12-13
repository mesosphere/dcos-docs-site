---
layout: layout.pug
navigationTitle: 管理用户和组
title: 管理用户和组
menuWeight: 0
excerpt: 管理用户和组
enterprise: true
---



DC/OS Enterprise 可管理两种类型的用户：

* **本地**：本地用户帐户仅存在于 DC/OS 中。

* **外部**：DC/OS 仅存储用户的 ID 或用户名以及其他 DC/OS 特定信息，如权限和组成员。DC/OS 从不接收或存储外部用户的密码。相反，它将用户凭据的验证委派给以下其中一项：LDAP 目录、SAML 或 OpenID Connect。

DC/OS Enterprise 还允许您创建用户组，并从 LDAP 导入用户组。组可以更容易地管理权限。您可以一次为整个用户组分配权限，而不是单独为每个用户帐户分配权限。

从 LDAP 导入组可以更容易地添加外部用户。
