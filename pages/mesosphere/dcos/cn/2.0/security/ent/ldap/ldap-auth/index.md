---
layout: layout.pug
navigationTitle:  指定身份认证和参数
title: 指定身份认证和参数
menuWeight: 2
render: mustache
model: /mesosphere/dcos/2.0/data.yml
excerpt: 为 LDAP 目录指定身份认证方法和参数
enterprise: true
---


在此部分中，您将为 LDAP 目录设置身份认证方法和参数。您可以使用两种绑定类型和两种身份认证方法。

# 绑定类型

绑定操作用于对目录服务器进行客户端身份认证，建立用于该连接上后续操作的授权身份，并指定客户端要使用的 LDAP 协议版本。

您可以使用两种绑定类型：

- 匿名绑定 - 使用简单绑定或搜索绑定。任何人都可以连接到 LDAP 服务器。此绑定类型不需要 **查找 DN** 或 **查找密码**。
- LDAP 凭据 - 需要 **查找 DN** 和 **查找密码**。必须先确立 LDAP 凭据。

# 身份认证方法

您可以使用两种身份认证方法。

- 简单绑定。通过简单绑定的身份认证是验证 LDAP 客户端的最常见方式，但您也可以选择搜索绑定身份认证方法。您可以匿名绑定，也可以提供 LDAP 凭据，例如“查找 DN”和“查找密码”。在任一情况下，您都必须提供用户 DN 模板。如果您的 LDAP 用户名是 [可分辨名称 (DN)](https://www.ldap.com/ldap-dns-and-rdns) 的一部分，请选择简单绑定。

- 搜索绑定。虽然简单的绑定连接只需一步即可完成，但搜索/绑定操作需要两个步骤。首先，在目录中搜索用户名属性。如果找到，则进行绑定操作以检查用户对外部目录的凭据。您必须指定用户搜索库和用户搜索筛选模板。在某些方法中，您还必须指定“查找 DN”和“查找密码”。如果您的 LDAP 用户名不是 [可分辨名称 (DN) 的一部分](https://www.ldap.com/ldap-dns-and-rdns)，请选择搜索绑定。

## 使用简单绑定的匿名绑定

当您选择“使用简单绑定的匿名绑定”时，您必须提供 **用户 DN 模板**。

1. 在 **添加目录** 窗口中，单击 **身份认证**。
1. 在 **绑定类型**下，单击 **匿名绑定**。
1. 在 **身份认证方法**下，单击 **简单绑定**。
1. 键入外部 LDAP 目录可用于在 **用户 DN 模板** 字段中查找用户账户的 DN 模板。此字符串必须包含 `%(username)s`，DC/OS 会将其替换为用户在登录时提供的用户名。示例如下：

    ```bash
    cn=%(username)s,dc=los-pollos,dc=io
    uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
    uid=%(username)s,ou=users,dc=example,dc=com
    ```

1. 完成输入后，对话框应如下所示。

    ![简单绑定参数](/mesosphere/dcos/2.0/img/GUI-LDAP-anonymous-simple-bind.png)

    图 1. “使用简单绑定的匿名绑定”参数 

1. 单击 **Add Directory**。

1. [验证您的连接](/mesosphere/dcos/cn/2.0/security/ent/ldap/ldap-verify/)。

## 使用搜索绑定的匿名绑定

当您选择“使用搜索绑定的匿名绑定”时，您必须提供 **用户搜索库** 和 **用户搜素筛选模板**。

1. 在 **添加目录** 窗口中，单击 **身份认证**。
1. 在 **绑定类型**下，单击 **匿名绑定**。
1. 在 **身份认证方法**下，单击 **搜索绑定**。
1. 在 **User Search Base**（用户搜索库）字段中，指定目录中要开始搜索 LDAP 用户名的位置。这应为[搜索库对象](https://technet.microsoft.com/en-us/library/cc978021.aspx)的 DN。例如：

    ```bash
    cn=Users,dc=example,dc=com 
    ```

1. 在 **User Search Filter Template** 字段中指定将 LDAP 用户名转换为有效 LDAP 搜索筛选器的模板。该条目必须包含以下占位符：`%(username)s`。例如：

    ```bash
    (sAMAccountName=%(username)s)
    (uid=%(username)s)
    ```
1. 完成输入后，对话框应如下所示：

    ![使用搜索绑定的匿名绑定](/mesosphere/dcos/2.0/img/GUI-LDAP-anonymous-search-bind.png)

    图 2. “使用搜索绑定的匿名绑定”参数

1. 单击 **Add Directory**。
1. [验证您的连接](/mesosphere/dcos/cn/2.0/security/ent/ldap/ldap-verify/)。

## 使用简单绑定的 LDAP 凭据

选择 **LDAP 凭据** 作为绑定类型并选择 **简单绑定** 作为身份认证类型时，您必须提供 **查找 DN**、**查找密码** 和 **用户 DN 模板**。

1. 在 **添加目录** 窗口中，单击 **身份认证**。
1. 在 **绑定类型** 下，单击 **LDAP 凭据**。
1. 在 **身份认证方法**下，单击 **简单绑定**。
1. 提供用于连接到 LDAP 服务器的用户帐户的完整 DN，以在 **Lookup DN** 字段中导入用户、组以及检查用户凭据。一些示例如下：

    ```bash
        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com
    ```

    <p class="message--note"><strong>注意：</strong>我们建议使用只读用户账户。</p>

1. 在 **Lookup Password** 字段中提供帐户的密码。

1. 键入外部 LDAP 目录可用于在 **用户 DN 模板** 字段中查找用户账户的 DN 模板。此字符串必须包含 `%(username)s`，DC/OS 会将其替换为用户在登录时提供的用户名。示例如下：

    ```bash
    cn=%(username)s,dc=los-pollos,dc=io
    uid=%(username)s,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
    uid=%(username)s,ou=users,dc=example,dc=com
    ```

1. 完成输入后，对话框应如下所示。

    ![简单绑定参数](/mesosphere/dcos/2.0/img/GUI-LDAP-credentials-simple.png)

    图 3. “使用简单绑定的 LDAP 凭据”参数 

1. 单击 **Add Directory**。

1. [验证您的连接](/mesosphere/dcos/cn/2.0/security/ent/ldap/ldap-verify/)。

## 使用搜索绑定的 LDAP 凭据

选择 **LDAP 凭据** 作为绑定类型并选择 **搜索绑定** 作为身份认证类型时，您必须提供 **查找 DN**、**查找密码**、**用户搜索库** 和 **用户搜索筛选模板**。

1. 在 **添加目录** 窗口中，单击 **身份认证**。
1. 在 **绑定类型** 下，单击 **LDAP 凭据**。
1. 提供用于连接到 LDAP 服务器的用户帐户的完整 DN，以在 **Lookup DN** 字段中导入用户、组以及检查用户凭据。一些示例如下：

    ```bash
        cn=read-only-user,dc=los-pollos,dc=io
        uid=read-only-user,cn=users,cn=accounts,dc=demo1,dc=freeipa,dc=org
        uid=read-only-user,ou=users,dc=example,dc=com
    ```

    <p class="message--note"><strong>注意：</strong>我们建议使用只读用户账户。</p>

1. 在 **Lookup Password** 字段中提供帐户的密码。
1. 在 **身份认证方法**下，单击 **搜索绑定**。
1. 在 **User Search Base**（用户搜索库）字段中，指定目录中要开始搜索 LDAP 用户名的位置。这应当是 [搜索库对象] 的 DN。例如：

    ```bash
    cn=Users,dc=example,dc=com 
    ```

1. 在 **User Search Filter Template** 字段中指定将 LDAP 用户名转换为有效 LDAP 搜索筛选器的模板。该条目必须包含以下占位符：`%(username)s`。例如：

    ```bash
    (sAMAccountName=%(username)s)
    (uid=%(username)s)
    ```
1. 完成输入后，对话框应如下所示：

    ![使用搜索绑定的 LDAP 凭据](/mesosphere/dcos/2.0/img/GUI-LDAP-credentials-search.png)

    图 4. “使用搜索绑定的 LDAP 凭据”参数

1. 单击 **Add Directory**。
1. [验证您的连接](/mesosphere/dcos/cn/2.0/security/ent/ldap/ldap-verify/)。

