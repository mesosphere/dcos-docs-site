---
layout: layout.pug
navigationTitle: 身份认证
title: 身份认证
menuWeight: 2
excerpt: 为 LDAP 目录指定身份认证方法和参数
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


在此部分中，您将为 LDAP 目录设置身份认证方法和参数。

# 选择认证方法

1. 在 **Connection** 选项卡中指定连接参数后，单击 **Authentication**。

1. 提供用于连接到 LDAP 服务器的用户帐户的完整 DN，以导入用户、组以及检查在 **Lookup DN** 字段中用户凭据。以下是几个示例。

 cn=read-only-user,dc=los-pollos,dc=io
 uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
 uid=read-only-user,ou=users,dc=example,dc=com

 **注意：**我们建议使用只读用户帐户。

1. 在 **Lookup Password** 字段中提供帐户的密码。

1. 选择以下其中一项。

 - **简单绑定**：如果您的 LDAP 用户名是 [可分辨名称 (DN)] 的一部分(https://www.ldap.com/ldap-dns-and-rdns)。

 - **搜索/绑定**：如果您的 LDAP 用户名不是 [可分辨名称 (DN) 的一部分](https://www.ldap.com/ldap-dns-and-rdns)。

1. 请参阅与您选择相对应的部分。

 - [指定简单绑定参数](#specify-simple-bind-parameters)

 - [指定搜索/绑定参数](#specify-searchbind-parameters)

# 指定简单绑定参数

1. 键入外部 LDAP 目录可用于在 **User DN Template** 字段中查找用户帐户的 DN 模板。此字符串必须包含 `%(username)s`，DC/OS 会将其替换为用户在登录时提供的用户名。下面是一些示例。

 cn=%(username)s,dc=los-pollos,dc=io
 uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
 uid=%(username)s,ou=users,dc=example,dc=com

1. 完成输入后，对话框应如下所示。

 ![简单绑定参数](/cn/1.11/img/ldap-add-dir-auth-simple-bind.png) 

 图 1. 简单绑定参数 

1. 单击 **Add Directory**。

1. [验证您的连接](/cn/1.11/security/ent/ldap/ldap-verify/)。


# 指定搜索/绑定参数

虽然简单的绑定连接只需一步即可完成，但搜索/绑定操作需要两个步骤。首先，在目录中搜索用户名属性。如果找到，则进行绑定操作以检查用户对外部目录的凭据。

1. 在 **User Search Base**（用户搜索库）字段中，指定目录中要开始搜索 LDAP 用户名的位置。这应为[搜索库对象]的 DN(https://technet.microsoft.com/en-us/library/cc978021.aspx)。示例：`cn=Users,dc=example,dc=com`

1. 在 **User Search Filter Template** 字段中指定将 LDAP 用户名转换为有效 LDAP 搜索筛选器的模板。必须包含以下占位符：`%(username)s`示例：

    - `(sAMAccountName=%(username)s)`
    - `(uid=%(username)s)`

1. 完成输入后，对话框应类似于如下所示的示例。

 ![搜索/绑定参数](/cn/1.11/img/ldap-add-dir-auth-search-bind.png)

 图 2. 搜索绑定参数

1. 单击 **Add Directory**。

1. [验证您的连接](/cn/1.11/security/ent/ldap/ldap-verify/)。
