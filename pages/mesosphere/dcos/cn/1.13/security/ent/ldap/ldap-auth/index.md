---
layout: layout.pug
navigationTitle:  指定身份认证和参数
title: 指定身份认证和参数
menuWeight: 2
render: mustache
model: /mesosphere/dcos/1.13/data.yml
excerpt: 为 LDAP 目录指定身份认证方法和参数
enterprise: true
---


在此部分中，您将为 LDAP 目录设置身份认证方法和参数。您可以使用两种绑定类型和两种验证方法。

# 绑定类型

绑定操作用于对目录服务器进行客户端身份验证，建立用于该连接上后续操作的授权身份，并指定客户端要使用的 LDAP 协议版本。

您可以使用两种绑定类型：

- 匿名绑定 - 使用简单绑定或搜索绑定。任何人都可以连接到 LDAP 服务器。此绑定类型不需要 **Lookup DN** 或 **Lookup Password**。
- LDAP 凭据 - 需要 **Lookup DN** 和 **Lookup Password**。必须先确立 LDAP 凭据。

# 身份验证方法

您可以使用两种验证方法。

- 简单绑定。通过简单绑定的验证是验证 LDAP 客户端的最常见方式，但您也可以选择“搜索绑定”验证方法。您可以匿名绑定，或者您可以提供 LDAP 凭据，例如，“lookup DN”和“lookup password”。在任一情况下，您都必须提供用户 DN 模板。如果您的 LDAP 用户名是 [可分辨名称 (DN)](https://www.ldap.com/ldap-dns-and-rdns) 的一部分，则选择简单绑定。

- 搜索绑定。虽然简单的绑定连接只需一步即可完成，但搜索/绑定操作需要两个步骤。首先，在目录中搜索用户名属性。如果找到，则进行绑定操作以检查用户对外部目录的凭据。您必须指定“用户搜索库”和“用户搜索筛选模板”。在某些方法中，您还必须指定“lookup DN”和“lookup password”。如果您的 LDAP 用户名 **不** 是 [可分辨名称 (DN) ](https://www.ldap.com/ldap-dns-and-rdns)的一部分，则选择搜索绑定。

## 简单绑定中的匿名绑定

当您选择简单绑定中的匿名绑定时，您必须提供 **用户 DN 模板**。

1. 在 **添加目录** 窗口中，单击 **身份验证**。
1. 在 **绑定类型** 下，单击 **匿名绑定**。
1. 在 **身份验证方法** 下，单击 **简单绑定**。
1. 输入外部 LDAP 目录可用于在 **用户 DN 模板** 字段中查找用户帐户的 DN 模板。此字符串必须包含 `%(username)s`，DC/OS 会将其替换为用户在登录时提供的用户名。例如：

    ```bash
    cn=%(username)s,dc=los-pollos,dc=io
    uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
    uid=%(username)s,ou=users,dc=example,dc=com
    ```

1. 完成条目后，对话框应如下所示。

    ![简单绑定参数](/mesosphere/dcos/1.13/img/GUI-LDAP-anonymous-simple-bind.png)

    图 1. ## 简单绑定中的匿名绑定参数 

1. 单击 **Add Directory**。

1. [验证您的连接](/mesosphere/dcos/cn/1.13/security/ent/ldap/ldap-verify/)。

## 搜索绑定中的匿名绑定

当您选择搜索绑定中的匿名绑定时，您必须提供 **用户搜索库** 和 **用户搜索筛选模板**。

1. 在 **添加目录** 窗口中，单击 **身份验证**。
1. 在 **绑定类型** 下，单击 **匿名绑定**。
1. 在 **身份验证方法** 下，单击 **搜索绑定**。
1. 在 **User Search Base**（用户搜索库）字段中，指定目录中要开始搜索 LDAP 用户名的位置。这应为[搜索库对象](https://technet.microsoft.com/en-us/library/cc978021.aspx)的 DN。例如：

    ```bash
    cn=Users,dc=example,dc=com 
    ```

1. 在 **User Search Filter Template** 字段中指定将 LDAP 用户名转换为有效 LDAP 搜索筛选器的模板。该条目必须包含以下占位符：`%(username)s`。例如：

    ```bash
    (sAMAccountName=%(username)s)
    (uid=%(username)s)
    ```
1. 完成条目后，对话框应如下所示。

    ![搜索绑定中的匿名绑定](/mesosphere/dcos/1.13/img/GUI-LDAP-anonymous-search-bind.png)

    图 2. 搜索绑定中的匿名绑定参数

1. 单击 **Add Directory**。
1. [验证您的连接](/mesosphere/dcos/cn/1.13/security/ent/ldap/ldap-verify/)。

## 简单绑定中的 LDAP 凭据

选择 **LDAP 凭据** 作为绑定类型和 **简单绑定** 作为身份验证类型时，您必须提供 **Lookup DN**、**Lookup Password** 和 **用户 DN 模板**。

1. 在 **添加目录** 窗口中，单击 **身份验证**。
1. 在 **绑定类型** 下，单击 **LDAP 凭据**。
1. 在 **身份验证方法** 下，单击 **简单绑定**。
1. 提供用于连接到 LDAP 服务器的用户帐户的完整 DN，以在 **Lookup DN** 字段中导入用户、组以及检查用户凭据。例如：

    ```bash
        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com
    ```

    <p class="message--note"><strong>注意：</strong>我们建议使用只读用户帐户。</p>

1. 在 **Lookup Password** 字段中提供帐户的密码。

1. 输入外部 LDAP 目录可用于在 **用户 DN 模板** 字段中查找用户帐户的 DN 模板。此字符串必须包含 `%(username)s`，DC/OS 会将其替换为用户在登录时提供的用户名。例如：

    ```bash
    cn=%(username)s,dc=los-pollos,dc=io
    uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
    uid=%(username)s,ou=users,dc=example,dc=com
    ```

1. 完成条目后，对话框应如下所示。

    ![简单绑定参数](/mesosphere/dcos/1.13/img/GUI-LDAP-credentials-simple.png)

    图 3. 简单绑定中的 LDAP 凭据参数 

1. 单击 **Add Directory**。

1. [验证您的连接](/mesosphere/dcos/cn/1.13/security/ent/ldap/ldap-verify/)。

搜索绑定中的 LDAP 凭据

选择 **LDAP 凭据** 作为绑定类型和 **搜索绑定** 作为身份验证类型时，您必须提供 **Lookup DN**、**Lookup Password**、**用户搜索库** 和 **用户搜索筛选模板**。

1. 在 **添加目录** 窗口中，单击 **身份验证**。
1. 在 **绑定类型** 下，单击 **LDAP 凭据**。
1. 提供用于连接到 LDAP 服务器的用户帐户的完整 DN，以在 **Lookup DN** 字段中导入用户、组以及检查用户凭据。例如：

    ```bash
        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com
    ```

    <p class="message--note"><strong>注意：</strong>我们建议使用只读用户帐户。</p>

1. 在 **Lookup Password** 字段中提供帐户的密码。
1. 在 **身份验证方法** 下，单击 **搜索绑定**。
1. 在 **User Search Base**（用户搜索库）字段中，指定目录中要开始搜索 LDAP 用户名的位置。这应为搜索库对象的 DN。例如：

    ```bash
    cn=Users,dc=example,dc=com 
    ```

1. 在 **User Search Filter Template** 字段中指定将 LDAP 用户名转换为有效 LDAP 搜索筛选器的模板。该条目必须包含以下占位符：`%(username)s`。例如：

    ```bash
    (sAMAccountName=%(username)s)
    (uid=%(username)s)
    ```
1. 完成条目后，对话框应如下所示。

    ![搜索绑定中的 LDAP 凭据](/mesosphere/dcos/1.13/img/GUI-LDAP-credentials-search.png)

    图 4. 搜索绑定中的 LDAP 凭据参数

1. 单击 **Add Directory**。
1. [验证您的连接](/mesosphere/dcos/cn/1.13/security/ent/ldap/ldap-verify/)。

